import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimiters, withRateLimit } from '@/lib/rate-limit'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
])

const isApiRoute = createRouteMatcher(['/api(.*)'])
const isAuthRoute = createRouteMatcher(['/api/auth(.*)', '/sign-in(.*)', '/sign-up(.*)'])
const isSearchRoute = createRouteMatcher(['/api/search(.*)', '/search(.*)'])
const isUploadRoute = createRouteMatcher(['/api/uploadthing(.*)'])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Apply rate limiting before authentication
  let rateLimitResponse: Response | null = null;

  // Determine which rate limiter to use
  if (isAuthRoute(req)) {
    rateLimitResponse = await withRateLimit(rateLimiters.auth)(req);
  } else if (isSearchRoute(req)) {
    rateLimitResponse = await withRateLimit(rateLimiters.search)(req);
  } else if (isUploadRoute(req)) {
    rateLimitResponse = await withRateLimit(rateLimiters.upload)(req);
  } else if (isApiRoute(req)) {
    rateLimitResponse = await withRateLimit(rateLimiters.api)(req);
  }

  // Return rate limit response if exceeded
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  // Apply Clerk authentication for protected routes
  if (!isPublicRoute(req)) {
    await auth.protect()
  }

  // Add security headers
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Add user ID to headers for rate limiting (if authenticated)
  const { userId } = await auth()
  if (userId) {
    response.headers.set('X-User-ID', userId)
  }

  return response
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}