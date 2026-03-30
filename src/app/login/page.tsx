import { Suspense } from 'react';
import { LoginForm } from '@/components/admin/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-100 via-white to-teal-50/30 px-4 py-12">
      <Suspense
        fallback={
          <p className="rounded-xl border border-zinc-200 bg-white px-6 py-8 text-sm text-zinc-500 shadow-sm">Chargement…</p>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
