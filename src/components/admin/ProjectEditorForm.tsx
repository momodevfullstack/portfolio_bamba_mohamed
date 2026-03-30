import { createProject, updateProject } from '@/app/admin/projects/actions';

export type ProjectFormDefaults = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  stack: string[];
  role: string;
  outcome: string;
  github: string | null;
  demo: string | null;
  spotlight: boolean;
  in_progress: boolean;
  published: boolean;
  sort_order: number;
};

const inputClass =
  'mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20';
const labelClass = 'block text-sm font-medium text-zinc-700';

export function ProjectEditorForm({
  mode,
  defaults,
}: {
  mode: 'create' | 'edit';
  defaults?: ProjectFormDefaults;
}) {
  const action = mode === 'create' ? createProject : updateProject;
  const d = defaults;

  return (
    <form action={action} className="max-w-2xl space-y-6">
      {mode === 'edit' && d ? <input type="hidden" name="original_slug" value={d.slug} /> : null}

      <div>
        <label htmlFor="slug" className={labelClass}>
          Slug (URL)
        </label>
        <input
          id="slug"
          name="slug"
          required
          defaultValue={d?.slug ?? ''}
          placeholder="mon-projet"
          className={inputClass}
        />
        <p className="mt-1 text-xs text-zinc-500">Utilise dans /portfolio/[slug]. Minuscules, chiffres, tirets.</p>
      </div>

      <div>
        <label htmlFor="title" className={labelClass}>
          Titre
        </label>
        <input id="title" name="title" required defaultValue={d?.title ?? ''} className={inputClass} />
      </div>

      <div>
        <label htmlFor="summary" className={labelClass}>
          Resume court
        </label>
        <textarea
          id="summary"
          name="summary"
          required
          rows={2}
          defaultValue={d?.summary ?? ''}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Description (etude de cas)
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={6}
          defaultValue={d?.description ?? ''}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="stack" className={labelClass}>
          Stack (virgules ou lignes)
        </label>
        <textarea
          id="stack"
          name="stack"
          rows={3}
          defaultValue={d?.stack?.join(', ') ?? ''}
          placeholder="Next.js, TypeScript, Supabase"
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="role" className={labelClass}>
            Role
          </label>
          <textarea id="role" name="role" required rows={3} defaultValue={d?.role ?? ''} className={inputClass} />
        </div>
        <div>
          <label htmlFor="outcome" className={labelClass}>
            Impact / resultat
          </label>
          <textarea
            id="outcome"
            name="outcome"
            required
            rows={3}
            defaultValue={d?.outcome ?? ''}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="github" className={labelClass}>
            GitHub (optionnel)
          </label>
          <input
            id="github"
            name="github"
            type="url"
            defaultValue={d?.github ?? ''}
            placeholder="https://github.com/..."
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="demo" className={labelClass}>
            Demo (optionnel)
          </label>
          <input
            id="demo"
            name="demo"
            type="url"
            defaultValue={d?.demo ?? ''}
            placeholder="https://..."
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="sort_order" className={labelClass}>
          Ordre d&apos;affichage
        </label>
        <input
          id="sort_order"
          name="sort_order"
          type="number"
          defaultValue={d?.sort_order ?? 0}
          className={inputClass}
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-sm text-zinc-800 transition hover:bg-zinc-100/80">
          <input
            type="checkbox"
            name="spotlight"
            defaultChecked={d?.spotlight ?? false}
            className="rounded border-zinc-300 text-teal-600 focus:ring-teal-500"
          />
          A la une
        </label>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-sm text-zinc-800 transition hover:bg-zinc-100/80">
          <input
            type="checkbox"
            name="in_progress"
            defaultChecked={d?.in_progress ?? false}
            className="rounded border-zinc-300 text-teal-600 focus:ring-teal-500"
          />
          En cours
        </label>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-sm text-zinc-800 transition hover:bg-zinc-100/80">
          <input
            type="checkbox"
            name="published"
            defaultChecked={d?.published ?? false}
            className="rounded border-zinc-300 text-teal-600 focus:ring-teal-500"
          />
          Publie (visible sur le site)
        </label>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-zinc-100 pt-6">
        <button
          type="submit"
          className="rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-900/15 transition hover:bg-teal-800"
        >
          {mode === 'create' ? 'Creer le projet' : 'Enregistrer les modifications'}
        </button>
      </div>
    </form>
  );
}
