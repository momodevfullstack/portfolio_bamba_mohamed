import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Pour les routes admin, on laisse le composant client gérer l'authentification
  // Le middleware Next.js ne peut pas accéder à localStorage côté serveur
  
  // Si l'utilisateur essaie d'accéder à /admin sans être sur /login,
  // on laisse passer et le composant client redirigera si nécessaire
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Si l'utilisateur est sur la page de login, on laisse passer
  if (request.nextUrl.pathname === '/login') {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login']
};
