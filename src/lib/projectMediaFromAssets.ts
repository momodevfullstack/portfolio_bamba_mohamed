import type { ProjectMedia } from '@/data/projects';
import type { ProjectAssetFolder } from '@/data/projectAssetFolders';
import { assetMediaMap } from '@/data/generated/assetMediaMap';

export function mediaFromAssetFolder(
  folder: ProjectAssetFolder,
  alts: {
    video?: string;
    imageAlts?: string[];
  } = {},
): ProjectMedia[] {
  const entry = assetMediaMap[folder];
  const media: ProjectMedia[] = [];

  if (entry.video) {
    media.push({
      type: 'video',
      src: entry.video,
      alt: alts.video ?? `Video — ${folder}`,
    });
  }

  entry.images.forEach((src, index) => {
    media.push({
      type: 'image',
      src,
      alt: alts.imageAlts?.[index] ?? `Capture ${index + 1}`,
    });
  });

  return media;
}
