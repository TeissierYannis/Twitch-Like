import { z } from "zod";

// Base schemas
export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be less than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
  .refine((val) => !val.startsWith("_"), "Username cannot start with underscore")
  .refine((val) => !val.endsWith("_"), "Username cannot end with underscore");

export const streamTitleSchema = z
  .string()
  .min(1, "Stream title is required")
  .max(100, "Stream title must be less than 100 characters")
  .refine((val) => val.trim().length > 0, "Stream title cannot be empty");

export const streamDescriptionSchema = z
  .string()
  .max(500, "Description must be less than 500 characters")
  .optional();

export const chatMessageSchema = z
  .string()
  .min(1, "Message cannot be empty")
  .max(500, "Message must be less than 500 characters")
  .refine((val) => val.trim().length > 0, "Message cannot be empty");

// Stream schemas
export const createStreamSchema = z.object({
  title: streamTitleSchema,
  description: streamDescriptionSchema,
  thumbnailUrl: z.string().url("Invalid thumbnail URL").optional(),
  categoryId: z.string().uuid("Invalid category ID").optional(),
  tags: z.array(z.string().max(20)).max(5, "Maximum 5 tags allowed").optional(),
});

export const updateStreamSchema = createStreamSchema.partial();

// User schemas
export const updateUserSchema = z.object({
  username: usernameSchema.optional(),
  bio: z.string().max(300, "Bio must be less than 300 characters").optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),
});

// Chat schemas
export const sendMessageSchema = z.object({
  content: chatMessageSchema,
  roomId: z.string().min(1, "Room ID is required"),
});

export const moderateMessageSchema = z.object({
  messageId: z.string().uuid("Invalid message ID"),
  action: z.enum(["delete", "timeout", "ban"]),
  reason: z.string().max(200, "Reason must be less than 200 characters").optional(),
  duration: z.number().positive().optional(), // for timeout in minutes
});

// Follow schemas
export const followSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export const blockSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

// Search schemas
export const searchSchema = z.object({
  q: z.string().min(1, "Search query is required").max(100, "Query too long"),
  category: z.string().optional(),
  sort: z.enum(["relevance", "viewers", "recent"]).default("relevance"),
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
});

// Upload schemas
export const uploadSchema = z.object({
  fileType: z.enum(["image", "thumbnail", "avatar"]),
  fileName: z.string().min(1, "File name is required"),
  fileSize: z.number().positive().max(10 * 1024 * 1024, "File too large (max 10MB)"),
});

// Pagination schemas
export const paginationSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

// Analytics schemas
export const analyticsQuerySchema = z.object({
  period: z.enum(["24h", "7d", "30d", "90d"]).default("7d"),
  metric: z.enum(["views", "followers", "engagement", "revenue"]).optional(),
  granularity: z.enum(["hour", "day", "week"]).default("day"),
});

// Webhook schemas
export const webhookEventSchema = z.object({
  type: z.enum(["stream.started", "stream.ended", "user.followed", "user.unfollowed"]),
  data: z.record(z.string(), z.any()),
  timestamp: z.string().datetime(),
});

// API Response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  meta: z.object({
    page: z.number().optional(),
    limit: z.number().optional(),
    total: z.number().optional(),
    hasMore: z.boolean().optional(),
  }).optional(),
});

// Form validation helpers
export type CreateStreamInput = z.infer<typeof createStreamSchema>;
export type UpdateStreamInput = z.infer<typeof updateStreamSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type AnalyticsQueryInput = z.infer<typeof analyticsQuerySchema>;

// Validation middleware helper
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  options?: { stripUnknown?: boolean }
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err) => {
        const path = err.path.join(".");
        return path ? `${path}: ${err.message}` : err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: ["Invalid input"] };
  }
}

// Custom validation schemas for specific business logic
export const businessValidations = {
  // Check if username is available (would need DB check)
  isUsernameAvailable: (username: string) => {
    // This would typically check against database
    const reserved = ["admin", "api", "www", "support", "help"];
    return !reserved.includes(username.toLowerCase());
  },

  // Check if stream title is appropriate
  isStreamTitleAppropriate: (title: string) => {
    const inappropriate = ["spam", "scam", "hack"];
    return !inappropriate.some(word => 
      title.toLowerCase().includes(word)
    );
  },

  // Check if user can perform action (rate limiting at business level)
  canUserPerformAction: (userId: string, action: string) => {
    // This would check user permissions, subscription status, etc.
    return true; // Placeholder
  },
};

// Real-time validation for forms
export const createFormValidation = <T>(schema: z.ZodSchema<T>) => {
  return {
    validate: (data: unknown) => validateInput(schema, data),
    validateField: (fieldName: keyof T, value: unknown) => {
      try {
        const fieldSchema = schema.shape[fieldName as string];
        if (fieldSchema) {
          fieldSchema.parse(value);
          return { success: true as const };
        }
        return { success: false as const, error: "Unknown field" };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return { 
            success: false as const, 
            error: error.errors[0]?.message || "Invalid value" 
          };
        }
        return { success: false as const, error: "Validation error" };
      }
    },
  };
};