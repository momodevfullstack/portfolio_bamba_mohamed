import { createClient } from '@/lib/supabase/server';

export type AdminProjectMediaRow = {
  id: string;
  project_id: string;
  type: 'image' | 'video';
  src: string;
  alt: string;
  poster: string | null;
  sort_order: number;
};

export type AdminProjectRow = {
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
  project_media?: AdminProjectMediaRow[];
};

export async function fetchAllProjectsAdmin(): Promise<AdminProjectRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as AdminProjectRow[];
}

export async function fetchProjectAdminBySlug(slug: string): Promise<AdminProjectRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*, project_media(*)')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as AdminProjectRow | null;
}
