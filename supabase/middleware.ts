import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // 1. Refresca la sesión de autenticación del usuario y obtiene los datos.
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Lógica para proteger la carpeta '/protected'
  const isProtectedPath = request.nextUrl.pathname.startsWith('/protected');

  if (isProtectedPath && !user) {
    // Si no hay usuario y está en /protected, redirige a la página de login.
    const url = request.nextUrl.clone();
    url.pathname = '/login'; // Cambia esto si tu página de login está en otra ruta (ej: /signin)
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // El matcher se asegura de que solo las rutas que comienzan con /protected
  // disparen la lógica de redirección de autenticación.
  matcher: [
    '/x/:path*',
  ],
};