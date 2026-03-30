import Link from 'next/link';
import { AdminLogoutButton } from '@/components/admin/AdminLogoutButton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 via-zinc-50 to-teal-50/25 text-zinc-900">
      <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-white/85 shadow-sm shadow-zinc-900/5 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/admin/projects"
              className="text-lg font-bold tracking-tight text-teal-800 transition hover:text-teal-950"
            >
              Portfolio <span className="font-normal text-zinc-400">·</span> admin
            </Link>
            <nav className="flex flex-wrap items-center gap-1 text-sm font-medium">
              <Link
                href="/admin/projects"
                className="rounded-full px-3 py-1.5 text-zinc-600 transition hover:bg-teal-50 hover:text-teal-800"
              >
                Projets
              </Link>
              <Link
                href="/"
                className="rounded-full px-3 py-1.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800"
              >
                Voir le site
              </Link>
            </nav>
          </div>
          <AdminLogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}
