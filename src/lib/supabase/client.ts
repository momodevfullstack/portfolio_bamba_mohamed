'use client';

import { createBrowserClient } from '@supabase/ssr';

function getSupabaseBrowserEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';
  if (!url || !anonKey) {
    throw new Error(
      'Supabase non configure : ajoutez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans portfolio-clean/.env.local (voir env.example), puis redemarrez le serveur (npm run dev). Cles : Supabase > Project Settings > API.',
    );
  }
  return { url, anonKey };
}

export function createClient() {
  const { url, anonKey } = getSupabaseBrowserEnv();
  return createBrowserClient(url, anonKey);
}
