import { createClient as createAnonClient } from '@supabase/supabase-js';
import type { Project, ProjectMedia } from '@/data/projects';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import {
  getStaticOrderedProjects,
  getStaticProjectBySlug,
} from '@/data/projects';

const BUCKET = 'portfolio-media';

type DbProject = {
  id: string;
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

type DbProjectMedia = {
  id: string;
  project_id: string;
  type: 'image' | 'video';
  src: string;
  alt: string;
  poster: string | null;
  sort_order: number;
};

function supabasePublic() {
  return createAnonClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/** src = URL absolue OU chemin dans le bucket portfolio-media */
export function resolveProjectMediaSrc(src: string): string {
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  const supabase = supabasePublic();
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(src);
  return data.publicUrl;
}

function mapDbProject(row: DbProject, mediaRows: DbProjectMedia[]): Project {
  const media: ProjectMedia[] = [...mediaRows]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((m) => ({
      type: m.type,
      src: resolveProjectMediaSrc(m.src),
      alt: m.alt || 'Media projet',
      poster: m.poster ?? undefined,
    }));

  return {
    id: row.slug,
    title: row.title,
    summary: row.summary,
    description: row.description,
    stack: row.stack ?? [],
    role: row.role,
    outcome: row.outcome,
    github: row.github ?? undefined,
    demo: row.demo ?? undefined,
    spotlight: row.spotlight,
    inProgress: row.in_progress,
    media,
  };
}

export async function getPublicProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    return getStaticOrderedProjects();
  }

  const supabase = supabasePublic();
  const { data: rows, error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .order('spotlight', { ascending: false })
    .order('sort_order', { ascending: true });

  if (error || !rows?.length) {
    return getStaticOrderedProjects();
  }

  const projects = rows as DbProject[];
  const ids = projects.map((p) => p.id);
  const { data: mediaAll } = await supabase
    .from('project_media')
    .select('*')
    .in('project_id', ids)
    .order('sort_order', { ascending: true });

  const mediaList = (mediaAll ?? []) as DbProjectMedia[];
  const byProject = new Map<string, DbProjectMedia[]>();
  for (const m of mediaList) {
    const list = byProject.get(m.project_id) ?? [];
    list.push(m);
    byProject.set(m.project_id, list);
  }

  return projects.map((p) => mapDbProject(p, byProject.get(p.id) ?? []));
}

export async function getPublicProjectBySlug(slug: string): Promise<Project | null> {
  if (!isSupabaseConfigured()) {
    return getStaticProjectBySlug(slug) ?? null;
  }

  const supabase = supabasePublic();
  const { data: row, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error || !row) {
    return getStaticProjectBySlug(slug) ?? null;
  }

  const p = row as DbProject;
  const { data: mediaRows } = await supabase
    .from('project_media')
    .select('*')
    .eq('project_id', p.id)
    .order('sort_order', { ascending: true });

  return mapDbProject(p, (mediaRows ?? []) as DbProjectMedia[]);
}

export async function getPublicProjectSlugs(): Promise<{ id: string }[]> {
  const list = await getPublicProjects();
  return list.map((p) => ({ id: p.id }));
}
