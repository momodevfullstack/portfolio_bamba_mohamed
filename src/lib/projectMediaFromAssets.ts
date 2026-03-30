import type { ProjectMedia } from '@/data/projects';
import type { ProjectAssetFolder } from '@/data/projectAssetFolders';
import { assetMediaMap } from '@/data/generated/assetMediaMap';
import { remoteVideoUrlForFolder } from '@/lib/remoteProjectVideos';

type AssetFolderEntry = { video: string | null; images: readonly string[] };

/**
 * Construit le tableau `media` à partir d'un dossier assets/video/<folder>/
 * (vidéo en premier si présente, puis images triées par nom).
 * URL video distante (NEXT_PUBLIC_VIDEO_*) prioritaire sur le fichier local /public.
 */
export function mediaFromAssetFolder(
  folder: ProjectAssetFolder,
  alts: {
    video?: string;
    imageAlts?: string[];
  } = {}
): ProjectMedia[] {
  const map = assetMediaMap as Readonly<Record<string, AssetFolderEntry>>;
  const entry = map[folder];
  if (!entry) return [];

  const out: ProjectMedia[] = [];
  const videoSrc = remoteVideoUrlForFolder(folder) ?? entry.video;
  if (videoSrc) {
    out.push({
      type: 'video',
      src: videoSrc,
      alt: alts.video ?? `Video — ${folder}`,
    });
  }
  entry.images.forEach((src, i) => {
    out.push({
      type: 'image',
      src,
      alt: alts.imageAlts?.[i] ?? `Capture ${i + 1}`,
    });
  });
  return out;
}
