import Link from 'next/link';
import { ProjectEditorForm } from '@/components/admin/ProjectEditorForm';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  if (!isSupabaseConfigured()) {
    return (
      <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 px-5 py-6 text-sm text-amber-950 shadow-sm">
        Supabase requis pour creer un projet. Verifiez <code className="font-mono text-xs">.env.local</code>.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-1 text-sm font-medium text-teal-800 transition hover:text-teal-950"
        >
          <span aria-hidden>←</span> Retour aux projets
        </Link>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-teal-700">Creation</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">Nouveau projet</h1>
        <p className="mt-2 text-sm text-zinc-500">Renseignez les champs puis publiez quand le contenu est pret.</p>
      </div>

      {error ? (
        <p className="max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 shadow-sm">
          {decodeURIComponent(error)}
        </p>
      ) : null}

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm shadow-zinc-900/5 md:p-8">
        <ProjectEditorForm mode="create" />
      </div>
    </div>
  );
}
