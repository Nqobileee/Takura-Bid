import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple middleware - auth check is handled client-side by AuthContext
// This just ensures cookies are passed along for SSR
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

// Temporarily disabled matcher to avoid deprecated warning
// Route protection is handled client-side in the page components
export const config = {
  matcher: []
}
