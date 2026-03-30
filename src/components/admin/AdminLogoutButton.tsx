'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export function AdminLogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  if (!isSupabaseConfigured()) {
    return null;
  }

  async function handleLogout() {
    setPending(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleLogout()}
      disabled={pending}
      className="rounded-full border border-zinc-300 bg-white px-4 py-1.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-900 disabled:opacity-60"
    >
      {pending ? 'Deconnexion…' : 'Deconnexion'}
    </button>
  );
}
