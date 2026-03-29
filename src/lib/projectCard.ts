import type { Project, ProjectMedia } from '@/data/projects';

export const PLACEHOLDER_THUMB = '/photo_profile.png';

/** Vignette projet : URL absolue ou fichier local (hors placeholder) ; sinon Picsum par id. */
export function getProjectThumb(project: Project): { src: string; alt: string } {
  const firstImage = project.media.find((m) => m.type === 'image');
  const alt = firstImage?.alt ?? `Apercu — ${project.title}`;
  if (firstImage?.src.startsWith('http')) {
    return { src: firstImage.src, alt };
  }
  if (firstImage?.src.startsWith('/') && firstImage.src !== PLACEHOLDER_THUMB) {
    return { src: firstImage.src, alt };
  }
  const seed = encodeURIComponent(project.id);
  return {
    src: `https://picsum.photos/seed/${seed}/800/480`,
    alt,
  };
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

/** URL affichée pour une image de galerie (Picsum par seed si placeholder). */
export function getMediaDisplaySrc(project: Project, media: ProjectMedia, index: number): string {
  if (media.type !== 'image') return media.src;
  if (media.src.startsWith('http')) return media.src;
  if (media.src.startsWith('/') && media.src !== PLACEHOLDER_THUMB) return media.src;
  const seed = encodeURIComponent(`${project.id}-${index}`);
  return `https://picsum.photos/seed/${seed}/1200/675`;
}
