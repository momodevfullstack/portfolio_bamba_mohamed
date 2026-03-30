import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DeleteMediaButton } from '@/components/admin/DeleteMediaButton';
import { DeleteProjectButton } from '@/components/admin/DeleteProjectButton';
import { ProjectEditorForm } from '@/components/admin/ProjectEditorForm';
import { ProjectMediaUpload } from '@/components/admin/ProjectMediaUpload';
import { fetchProjectAdminBySlug } from '@/lib/projects/adminQueries';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export default async function EditProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  if (!isSupabaseConfigured()) {
    return (
      <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 px-5 py-6 text-sm text-amber-950 shadow-sm">
        Supabase requis. Verifiez <code className="font-mono text-xs">.env.local</code>.
      </div>
    );
  }

  const row = await fetchProjectAdminBySlug(slug);
  if (!row) {
    notFound();
  }

  const media = [...(row.project_media ?? [])].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-1 text-sm font-medium text-teal-800 transition hover:text-teal-950"
        >
          <span aria-hidden>←</span> Retour aux projets
        </Link>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-teal-700">Edition</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">{row.title}</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Slug public : <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-700">/portfolio/{row.slug}</code>
        </p>
      </div>

      {sp.error ? (
        <p className="max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 shadow-sm">
          {decodeURIComponent(sp.error)}
        </p>
      ) : null}
      {sp.saved ? (
        <p className="max-w-2xl rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-900 shadow-sm">
          Modifications enregistrees.
        </p>
      ) : null}

      <div className="space-y-8">
        <section className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm shadow-zinc-900/5 md:p-8">
          <h2 className="text-lg font-semibold text-zinc-900">Metadonnees</h2>
          <p className="mt-1 text-sm text-zinc-500">Textes, liens et options d&apos;affichage sur le site.</p>
          <div className="mt-6">
            <ProjectEditorForm
              mode="edit"
              defaults={{
                slug: row.slug,
                title: row.title,
                summary: row.summary,
                description: row.description,
                stack: row.stack ?? [],
                role: row.role,
                outcome: row.outcome,
                github: row.github,
                demo: row.demo,
                spotlight: row.spotlight,
                in_progress: row.in_progress,
                published: row.published,
                sort_order: row.sort_order,
              }}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm shadow-zinc-900/5 md:p-8">
          <h2 className="text-lg font-semibold text-zinc-900">Medias</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Ordre = tri sur le site. La premiere video sert de hero (autoplay) sur la fiche projet.
          </p>
          <div className="mt-6 space-y-3">
            {media.length === 0 ? (
              <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-8 text-center text-sm text-zinc-500">
                Aucun media pour l&apos;instant.
              </p>
            ) : (
              <ul className="divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/40">
                {media.map((m) => (
                  <li
                    key={m.id}
                    className="flex flex-wrap items-start justify-between gap-3 bg-white px-4 py-3 text-sm first:rounded-t-xl last:rounded-b-xl"
                  >
                    <div className="min-w-0">
                      <span className="inline-flex items-center rounded-md bg-teal-50 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-teal-800">
                        {m.type}
                      </span>
                      <span className="ml-2 text-xs text-zinc-400">ordre {m.sort_order}</span>
                      <p className="mt-1 truncate font-mono text-xs text-zinc-500" title={m.src}>
                        {m.src}
                      </p>
                      {m.alt ? <p className="mt-1 text-xs text-zinc-600">{m.alt}</p> : null}
                    </div>
                    <DeleteMediaButton mediaId={m.id} projectSlug={row.slug} />
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mt-6">
            <ProjectMediaUpload projectId={row.id} projectSlug={row.slug} />
          </div>
        </section>

        <section className="rounded-2xl border border-red-200/80 bg-gradient-to-br from-red-50/90 to-white p-6 shadow-sm md:p-8">
          <h2 className="text-lg font-semibold text-red-950">Zone danger</h2>
          <p className="mt-1 max-w-xl text-sm text-red-800/85">
            Supprime le projet et toutes ses entrees media en base (cascade). Les fichiers dans Storage peuvent rester ; vous
            pouvez les nettoyer a la main si besoin.
          </p>
          <div className="mt-5">
            <DeleteProjectButton slug={row.slug} />
          </div>
        </section>
      </div>
    </div>
  );
}
