import type { ProjectMedia } from '@/data/projects';
import { assetMediaMap, type ProjectAssetFolder } from '@/data/generated/assetMediaMap';

/**
 * Construit le tableau `media` à partir d'un dossier assets/video/<folder>/
 * (vidéo en premier si présente, puis images triées par nom).
 */
export function mediaFromAssetFolder(
  folder: ProjectAssetFolder,
  alts: {
    video?: string;
    imageAlts?: string[];
  } = {}
): ProjectMedia[] {
  const entry = assetMediaMap[folder];
  if (!entry) return [];

  const out: ProjectMedia[] = [];
  if (entry.video) {
    out.push({
      type: 'video',
      src: entry.video,
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
