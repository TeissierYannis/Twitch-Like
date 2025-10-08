import { NextRequest } from "next/server";

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyGenerator?: (req: NextRequest) => string; // Custom key generator
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// Simple in-memory store (use Redis in production)
const store: RateLimitStore = {};

// Cleanup expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }
}, 5 * 60 * 1000);

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  private getKey(req: NextRequest): string {
    if (this.config.keyGenerator) {
      return this.config.keyGenerator(req);
    }

    // Default: use IP address
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";
    return `rate_limit:${ip}`;
  }

  async check(req: NextRequest): Promise<{
    success: boolean;
    remaining: number;
    resetTime: number;
    error?: string;
  }> {
    const key = this.getKey(req);
    const now = Date.now();
    const windowEnd = now + this.config.windowMs;

    let record = store[key];

    // Initialize or reset if window expired
    if (!record || record.resetTime < now) {
      record = {
        count: 0,
        resetTime: windowEnd,
      };
      store[key] = record;
    }

    // Increment counter
    record.count++;

    const remaining = Math.max(0, this.config.maxRequests - record.count);
    const success = record.count <= this.config.maxRequests;

    return {
      success,
      remaining,
      resetTime: record.resetTime,
      error: success ? undefined : "Rate limit exceeded",
    };
  }
}

// Predefined rate limiters
export const rateLimiters = {
  // General API requests
  api: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000,
  }),

  // Authentication endpoints
  auth: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 50,
  }),

  // Chat messages
  chat: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60,
    keyGenerator: (req) => {
      // Use user ID for chat rate limiting
      const userId = req.headers.get("x-user-id") || "unknown";
      return `chat:${userId}`;
    },
  }),

  // Search requests
  search: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
  }),

  // File uploads
  upload: new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 50,
    keyGenerator: (req) => {
      const userId = req.headers.get("x-user-id") || "unknown";
      return `upload:${userId}`;
    },
  }),

  // Follow/unfollow actions
  follow: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,
    keyGenerator: (req) => {
      const userId = req.headers.get("x-user-id") || "unknown";
      return `follow:${userId}`;
    },
  }),
};

// Middleware helper
export function withRateLimit(limiter: RateLimiter) {
  return async (req: NextRequest) => {
    const result = await limiter.check(req);
    
    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: result.error,
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
        }),
        {
          status: 429,
          statusText: "Too Many Requests",
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": limiter["config"].maxRequests.toString(),
            "X-RateLimit-Remaining": result.remaining.toString(),
            "X-RateLimit-Reset": new Date(result.resetTime).toISOString(),
            "Retry-After": Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    return null; // No rate limit exceeded
  };
}