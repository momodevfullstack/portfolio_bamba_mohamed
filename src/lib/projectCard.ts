import type { Project, ProjectMedia } from '@/data/projects';

export const PLACEHOLDER_THUMB = '/photo_profile.png';

export function withBasePath(src: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return basePath && src.startsWith('/') && !src.startsWith('//') ? `${basePath}${src}` : src;
}

/** Vignette projet : image du projet ou photo locale par défaut. */
export function getProjectThumb(project: Project): { src: string; alt: string } {
  const firstImage = project.media.find((m) => m.type === 'image');
  const alt = firstImage?.alt ?? `Apercu — ${project.title}`;
  if (firstImage?.src.startsWith('http')) {
    return { src: firstImage.src, alt };
  }
  if (firstImage?.src.startsWith('/')) {
    return { src: withBasePath(firstImage.src), alt };
  }
  return { src: withBasePath(PLACEHOLDER_THUMB), alt };
}

export function projectKindLabel(project: Project): string {
  if (
    project.stack.some((s) =>
      /flutter|react native|expo/i.test(s)
    )
  )
    return 'Mobile';
  if (project.stack.some((s) => /openai|python/i.test(s))) return 'IA';
  return 'Web';
}

/** Captures / video enregistres sur telephone : affichage portrait, object-contain (pas du 16:9 qui coupe tout). */
export function projectUsesMobileMediaLayout(project: Project): boolean {
  return projectKindLabel(project) === 'Mobile';
}

/** Premiere video du projet pour le hero (autoplay), ou null. */
export function getProjectHeroVideo(project: Project): { media: ProjectMedia; index: number } | null {
  const index = project.media.findIndex((m) => m.type === 'video');
  if (index === -1) return null;
  const media = project.media[index];
  if (!media || media.type !== 'video') return null;
  return { media, index };
}

/** URL affichée pour une image de galerie. */
export function getMediaDisplaySrc(media: ProjectMedia): string {
  if (media.type !== 'image') return media.src;
  if (media.src.startsWith('http')) return media.src;
  if (media.src.startsWith('/')) return withBasePath(media.src);
  return withBasePath(PLACEHOLDER_THUMB);
}
