'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/admin';
  const configured = isSupabaseConfigured();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setPending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErr(error.message);
        return;
      }
      router.push(next);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-lg shadow-zinc-900/5">
      <h1 className="text-xl font-semibold text-zinc-900">Connexion admin</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Compte avec le role <span className="font-medium text-zinc-800">admin</span> dans{' '}
        <code className="rounded bg-zinc-100 px-1 text-xs">profiles</code> (voir SQL dans{' '}
        <code className="rounded bg-zinc-100 px-1 text-xs">supabase/migrations</code>).
      </p>

      {!configured ? (
        <div
          className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-950"
          role="alert"
        >
          <p className="font-medium">Variables Supabase manquantes</p>
          <ol className="mt-2 list-decimal space-y-1 pl-4 text-amber-900/95">
            <li>
              Dans le dossier <code className="rounded bg-amber-100/80 px-1 text-xs">portfolio-clean</code>, copiez{' '}
              <code className="rounded bg-amber-100/80 px-1 text-xs">env.example</code> vers{' '}
              <code className="rounded bg-amber-100/80 px-1 text-xs">.env.local</code>.
            </li>
            <li>
              Renseignez{' '}
              <code className="rounded bg-amber-100/80 px-1 text-xs">NEXT_PUBLIC_SUPABASE_URL</code> et{' '}
              <code className="rounded bg-amber-100/80 px-1 text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> depuis le
              tableau Supabase :{' '}
              <a
                href="https://supabase.com/dashboard/project/_/settings/api"
                className="font-medium text-teal-800 underline hover:text-teal-950"
                target="_blank"
                rel="noopener noreferrer"
              >
                Project Settings → API
              </a>
              .
            </li>
            <li>Redemarrez <code className="rounded bg-amber-100/80 px-1 text-xs">npm run dev</code>.</li>
          </ol>
        </div>
      ) : null}

      <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 space-y-4">
        <div>
          <label htmlFor="admin-email" className="block text-sm font-medium text-zinc-700">
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={!configured}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-teal-600/30 focus:border-teal-600 focus:ring-2 disabled:cursor-not-allowed disabled:bg-zinc-50"
          />
        </div>
        <div>
          <label htmlFor="admin-password" className="block text-sm font-medium text-zinc-700">
            Mot de passe
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={!configured}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-teal-600/30 focus:border-teal-600 focus:ring-2 disabled:cursor-not-allowed disabled:bg-zinc-50"
          />
        </div>
        {err ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {err}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending || !configured}
          className="w-full rounded-xl bg-teal-700 py-3 text-sm font-semibold text-white shadow-md shadow-teal-900/15 transition hover:bg-teal-800 disabled:opacity-60"
        >
          {pending ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}
