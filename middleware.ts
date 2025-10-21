// RUTA: ./middleware.ts

import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from './utils/supabase/middleware' 

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)

  const { data: { user } } = await (response as any).supabase.auth.getUser()
  
  const isProtectedPath = request.nextUrl.pathname.startsWith('/x')

  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login' 
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  // Intercepta SOLO la carpeta /x y todas sus subrutas
  matcher: [
    '/x/:path*',
  ],
}