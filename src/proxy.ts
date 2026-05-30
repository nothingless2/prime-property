import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth'

interface RateLimitRecord {
  count: number;
  timestamp: number;
}

const globalRateLimit = new Map<string, RateLimitRecord>();
const authRateLimit = new Map<string, RateLimitRecord>();

export default async function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value
  const session = sessionCookie ? await decrypt(sessionCookie) : null

  const isServerAction = request.headers.has('next-action') || request.headers.has('x-action')

  // Protect /agent/properties
  if (request.nextUrl.pathname.startsWith('/agent/properties') || request.nextUrl.pathname.startsWith('/agent/users')) {
    if (!session && !isServerAction) {
      return NextResponse.redirect(new URL('/agent/login', request.url))
    }
  }

  // Redirect authenticated users away from login
  if (request.nextUrl.pathname === '/agent/login') {
    if (session && !isServerAction) {
      return NextResponse.redirect(new URL('/agent/properties', request.url))
    }
  }

  // Rate Limiting Logic
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
  const pathname = request.nextUrl.pathname;
  const isAuthPath = pathname.startsWith('/agent/login') || pathname.startsWith('/api/auth');
  
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  
  if (Math.random() < 0.01) {
    globalRateLimit.forEach((val, key) => { if (now - val.timestamp > windowMs) globalRateLimit.delete(key); });
    authRateLimit.forEach((val, key) => { if (now - val.timestamp > windowMs) authRateLimit.delete(key); });
  }

  if (isAuthPath && request.method === 'POST') {
    const authRecord = authRateLimit.get(ip) || { count: 0, timestamp: now };
    if (now - authRecord.timestamp > windowMs) {
      authRecord.count = 1;
      authRecord.timestamp = now;
    } else {
      authRecord.count++;
    }
    authRateLimit.set(ip, authRecord);

    if (authRecord.count > 10) {
      return new NextResponse(
        JSON.stringify({ error: 'Too Many Requests', message: 'Tingkat akses auth terlalu tinggi. Silakan coba lagi dalam 1 menit.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  const globalRecord = globalRateLimit.get(ip) || { count: 0, timestamp: now };
  if (now - globalRecord.timestamp > windowMs) {
    globalRecord.count = 1;
    globalRecord.timestamp = now;
  } else {
    globalRecord.count++;
  }
  globalRateLimit.set(ip, globalRecord);

  if (globalRecord.count > 100) {
    return new NextResponse(
      JSON.stringify({ error: 'Too Many Requests', message: 'Tingkat akses global terlalu tinggi. Silakan coba lagi dalam 1 menit.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Set Security Headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
