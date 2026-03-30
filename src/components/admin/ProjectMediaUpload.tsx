'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { addProjectMediaRecord } from '@/app/admin/projects/actions';
import { createClient } from '@/lib/supabase/client';

const BUCKET = 'portfolio-media';

function mediaKind(file: File): 'image' | 'video' | null {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  return null;
}

export function ProjectMediaUpload({
  projectId,
  projectSlug,
}: {
  projectId: string;
  projectSlug: string;
}) {
  const router = useRouter();
  const [alt, setAlt] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      className="max-w-xl space-y-4 rounded-xl border border-zinc-200 bg-gradient-to-br from-zinc-50/90 to-teal-50/20 p-5 shadow-inner shadow-zinc-900/5"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const input = form.querySelector<HTMLInputElement>('input[type="file"]');
        const file = input?.files?.[0];
        if (!file) {
          setMessage('Choisissez un fichier.');
          return;
        }
        const type = mediaKind(file);
        if (!type) {
          setMessage('Type non supporte (image ou video uniquement).');
          return;
        }

        setBusy(true);
        setMessage(null);
        void (async () => {
          try {
            const supabase = createClient();
            const ext = file.name.includes('.') ? file.name.split('.').pop() : 'bin';
            const safeExt = ext?.replace(/[^a-z0-9]/gi, '') || 'bin';
            const objectPath = `projects/${projectId}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${safeExt}`;

            const { error: uploadError } = await supabase.storage.from(BUCKET).upload(objectPath, file, {
              cacheControl: '3600',
              upsert: false,
            });

            if (uploadError) {
              setMessage(uploadError.message);
              return;
            }

            const r = await addProjectMediaRecord({
              projectId,
              projectSlug,
              type,
              src: objectPath,
              alt: alt.trim() || (type === 'video' ? 'Video' : 'Image'),
            });

            if (!r.ok) {
              setMessage(r.message);
              return;
            }

            setAlt('');
            if (input) input.value = '';
            router.refresh();
          } finally {
            setBusy(false);
          }
        })();
      }}
    >
      <p className="text-sm font-semibold text-zinc-800">Ajouter un fichier</p>
      <p className="text-xs text-zinc-500">Envoi vers le bucket Supabase Storage (admin uniquement).</p>
      <input
        type="file"
        accept="image/*,video/*"
        disabled={busy}
        className="block w-full cursor-pointer text-sm text-zinc-700 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-700 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-teal-800"
      />
      <div>
        <label htmlFor={`alt-${projectId}`} className="block text-xs font-medium text-zinc-600">
          Texte alternatif
        </label>
        <input
          id={`alt-${projectId}`}
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          disabled={busy}
          placeholder={"Description courte pour l'accessibilite"}
          className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
        />
      </div>
      {message ? (
        <p className="text-sm text-red-700" role="alert">
          {message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:opacity-60"
      >
        {busy ? 'Envoi…' : 'Uploader et enregistrer'}
      </button>
    </form>
  );
}
