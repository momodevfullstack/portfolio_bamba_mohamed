import type { ProjectAssetFolder } from '@/data/projectAssetFolders';

/**
 * Videos trop lourdes pour Git / clone Vercel : heberge-les (R2, Bunny, S3, Drive lien direct, etc.)
 * puis definis les variables sur Vercel : Project > Settings > Environment Variables.
 * Prefixe NEXT_PUBLIC_ requis pour que le navigateur puisse charger la video.
 *
 * En local sans .env : les fichiers .mp4 dans assets/video/ + sync:assets restent utilises.
 */
const ENV_BY_FOLDER: Record<ProjectAssetFolder, string> = {
  app_mobile: 'NEXT_PUBLIC_VIDEO_APP_MOBILE',
  esct: 'NEXT_PUBLIC_VIDEO_ESCT',
  site_mariage_1: 'NEXT_PUBLIC_VIDEO_SITE_MARIAGE_1',
  vodason_compagn: 'NEXT_PUBLIC_VIDEO_VODASON',
};

export function remoteVideoUrlForFolder(folder: ProjectAssetFolder): string | null {
  const name = ENV_BY_FOLDER[folder];
  const v = name ? process.env[name] : undefined;
  if (typeof v === 'string' && (v.startsWith('https://') || v.startsWith('http://'))) {
    return v.trim();
  }
  return null;
}
