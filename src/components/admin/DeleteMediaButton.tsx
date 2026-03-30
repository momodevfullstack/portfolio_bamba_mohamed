'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteProjectMediaById } from '@/app/admin/projects/actions';

export function DeleteMediaButton({ mediaId, projectSlug }: { mediaId: string; projectSlug: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      className="shrink-0 rounded-lg px-2 py-1 text-sm font-medium text-red-700 transition hover:bg-red-50 hover:text-red-900 disabled:opacity-50"
      onClick={() => {
        if (!confirm('Supprimer ce fichier de la liste (la ligne en base) ? Le fichier peut rester dans Storage.')) {
          return;
        }
        setBusy(true);
        void (async () => {
          const r = await deleteProjectMediaById(mediaId, projectSlug);
          setBusy(false);
          if (!r.ok) {
            alert(r.message);
            return;
          }
          router.refresh();
        })();
      }}
    >
      Supprimer
    </button>
  );
}
