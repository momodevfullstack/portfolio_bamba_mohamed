import Link from 'next/link';
import { fetchAllProjectsAdmin } from '@/lib/projects/adminQueries';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  if (!isSupabaseConfigured()) {
    return (
      <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 px-5 py-6 text-sm text-amber-950 shadow-sm">
        <p className="font-medium">Supabase non configure</p>
        <p className="mt-2 text-amber-900/85">
          Ajoutez les variables dans <code className="rounded bg-amber-100/80 px-1 font-mono text-xs">.env.local</code> pour
          lister les projets.
        </p>
      </div>
    );
  }

  let rows: Awaited<ReturnType<typeof fetchAllProjectsAdmin>> = [];
  try {
    rows = await fetchAllProjectsAdmin();
  } catch (e) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800 shadow-sm">
        Impossible de charger les projets : {e instanceof Error ? e.message : String(e)}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">Contenu</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">Projets</h1>
          <p className="mt-2 max-w-xl text-sm text-zinc-500">
            Creer, modifier, publier. Seuls les projets publies apparaissent sur le site public.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-900/15 transition hover:bg-teal-800"
        >
          + Nouveau projet
        </Link>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 shadow-sm">{error}</p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm shadow-zinc-900/5">
        <ul className="divide-y divide-zinc-100">
          {rows.length === 0 ? (
            <li className="px-6 py-14 text-center">
              <p className="text-sm font-medium text-zinc-700">Aucun projet</p>
              <p className="mt-1 text-sm text-zinc-500">Creez un projet ou importez des donnees via SQL.</p>
              <Link
                href="/admin/projects/new"
                className="mt-4 inline-flex rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
              >
                Creer un projet
              </Link>
            </li>
          ) : (
            rows.map((row) => (
              <li
                key={row.id}
                className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 transition hover:bg-zinc-50/80"
              >
                <div className="min-w-0">
                  <Link
                    href={`/admin/projects/${row.slug}`}
                    className="font-semibold text-zinc-900 transition hover:text-teal-800"
                  >
                    {row.title}
                  </Link>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                    <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-zinc-600">/portfolio/{row.slug}</code>
                    {!row.published ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-900">Brouillon</span>
                    ) : (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-800">Publie</span>
                    )}
                    {row.spotlight ? (
                      <span className="rounded-full bg-amber-200/90 px-2 py-0.5 font-medium text-amber-950">A la une</span>
                    ) : null}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Link
                    href={`/portfolio/${row.slug}`}
                    className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-600 shadow-sm transition hover:border-teal-200 hover:text-teal-800"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Apercu public
                  </Link>
                  <Link
                    href={`/admin/projects/${row.slug}`}
                    className="rounded-lg bg-teal-700 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
                  >
                    Modifier
                  </Link>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
