import { NextResponse } from "next/server";
import { z } from "zod";

interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
    [key: string]: any;
  };
}

interface ApiErrorResponse {
  success: false;
  error: string;
  details?: string[];
  code?: string;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// Success response helper
export function createSuccessResponse<T>(
  data: T,
  meta?: ApiSuccessResponse<T>["meta"]
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      meta,
    },
    { status: 200 }
  );
}

// Error response helpers
export function createErrorResponse(
  error: string,
  status: number = 400,
  details?: string[],
  code?: string
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      details,
      code,
    },
    { status }
  );
}

export function createValidationErrorResponse(
  errors: string[]
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: "Validation failed",
      details: errors,
      code: "VALIDATION_ERROR",
    },
    { status: 422 }
  );
}

export function createNotFoundResponse(
  resource: string = "Resource"
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: `${resource} not found`,
      code: "NOT_FOUND",
    },
    { status: 404 }
  );
}

export function createUnauthorizedResponse(): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: "Unauthorized",
      code: "UNAUTHORIZED",
    },
    { status: 401 }
  );
}

export function createForbiddenResponse(): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: "Forbidden",
      code: "FORBIDDEN",
    },
    { status: 403 }
  );
}

export function createRateLimitResponse(
  retryAfter: number
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: "Rate limit exceeded",
      code: "RATE_LIMIT_EXCEEDED",
    },
    {
      status: 429,
      headers: {
        "Retry-After": retryAfter.toString(),
      },
    }
  );
}

export function createServerErrorResponse(
  message: string = "Internal server error"
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      code: "INTERNAL_ERROR",
    },
    { status: 500 }
  );
}

// Validation wrapper for API routes
export function withValidation<T>(
  schema: z.ZodSchema<T>,
  handler: (validatedData: T, request: Request) => Promise<NextResponse>
) {
  return async (request: Request): Promise<NextResponse> => {
    try {
      let data: unknown;

      // Parse request body based on content type
      const contentType = request.headers.get("content-type");
      
      if (contentType?.includes("application/json")) {
        data = await request.json();
      } else if (contentType?.includes("application/x-www-form-urlencoded")) {
        const formData = await request.formData();
        data = Object.fromEntries(formData.entries());
      } else {
        // For GET requests, use URL search params
        const url = new URL(request.url);
        data = Object.fromEntries(url.searchParams.entries());
      }

      // Validate data
      const result = schema.safeParse(data);
      
      if (!result.success) {
        const errors = result.error.errors.map((err) => {
          const path = err.path.join(".");
          return path ? `${path}: ${err.message}` : err.message;
        });
        return createValidationErrorResponse(errors);
      }

      // Call the handler with validated data
      return await handler(result.data, request);
    } catch (error) {
      console.error("API Error:", error);
      
      if (error instanceof SyntaxError) {
        return createErrorResponse("Invalid JSON", 400);
      }
      
      return createServerErrorResponse();
    }
  };
}

// Pagination helper
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): NextResponse<ApiSuccessResponse<T[]>> {
  const hasMore = page * limit < total;
  
  return createSuccessResponse(data, {
    page,
    limit,
    total,
    hasMore,
    totalPages: Math.ceil(total / limit),
  });
}

// Error handling for async API routes
export function withErrorHandling(
  handler: (request: Request) => Promise<NextResponse>
) {
  return async (request: Request): Promise<NextResponse> => {
    try {
      return await handler(request);
    } catch (error) {
      console.error("Unhandled API Error:", error);
      
      // Log error details in development
      if (process.env.NODE_ENV === "development") {
        console.error("Error stack:", error);
      }
      
      return createServerErrorResponse();
    }
  };
}

// Combine validation and error handling
export function createApiHandler<T>(
  schema: z.ZodSchema<T>,
  handler: (validatedData: T, request: Request) => Promise<NextResponse>
) {
  return withErrorHandling(withValidation(schema, handler));
}