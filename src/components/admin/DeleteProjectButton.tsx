'use client';

import { deleteProject } from '@/app/admin/projects/actions';

export function DeleteProjectButton({ slug }: { slug: string }) {
  return (
    <form action={deleteProject}>
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        className="rounded-lg border border-red-300/90 bg-white px-4 py-2.5 text-sm font-semibold text-red-800 shadow-sm transition hover:border-red-400 hover:bg-red-50"
        onClick={(e) => {
          if (!confirm('Supprimer definitivement ce projet ? Cette action est irreversible.')) {
            e.preventDefault();
          }
        }}
      >
        Supprimer le projet
      </button>
    </form>
  );
}
