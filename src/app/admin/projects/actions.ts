'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

function parseStack(raw: string): string[] {
  return raw
    .split(/[,|\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseSlug(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export async function createProject(formData: FormData) {
  const supabase = await createClient();
  const slug = parseSlug(String(formData.get('slug') ?? ''));
  if (!slug) {
    redirect(
      '/admin/projects/new?error=' +
        encodeURIComponent('Slug obligatoire (lettres minuscules, chiffres, tirets).'),
    );
  }

  const row = {
    slug,
    title: String(formData.get('title') ?? '').trim(),
    summary: String(formData.get('summary') ?? '').trim(),
    description: String(formData.get('description') ?? '').trim(),
    stack: parseStack(String(formData.get('stack') ?? '')),
    role: String(formData.get('role') ?? '').trim(),
    outcome: String(formData.get('outcome') ?? '').trim(),
    github: String(formData.get('github') ?? '').trim() || null,
    demo: String(formData.get('demo') ?? '').trim() || null,
    spotlight: formData.get('spotlight') === 'on',
    in_progress: formData.get('in_progress') === 'on',
    published: formData.get('published') === 'on',
    sort_order: Number.parseInt(String(formData.get('sort_order') ?? '0'), 10) || 0,
  };

  if (!row.title || !row.summary || !row.description || !row.role || !row.outcome) {
    redirect(
      '/admin/projects/new?error=' +
        encodeURIComponent('Remplissez titre, resume, description, role et impact.'),
    );
  }

  const { error } = await supabase.from('projects').insert(row);
  if (error) {
    redirect('/admin/projects/new?error=' + encodeURIComponent(error.message));
  }

  revalidatePath('/');
  revalidatePath('/portfolio');
  redirect(`/admin/projects/${slug}`);
}

export async function updateProject(formData: FormData) {
  const supabase = await createClient();
  const originalSlug = String(formData.get('original_slug') ?? '').trim();
  const slug = parseSlug(String(formData.get('slug') ?? ''));
  if (!originalSlug || !slug) {
    redirect('/admin/projects?error=' + encodeURIComponent('Slug invalide.'));
  }

  const row = {
    slug,
    title: String(formData.get('title') ?? '').trim(),
    summary: String(formData.get('summary') ?? '').trim(),
    description: String(formData.get('description') ?? '').trim(),
    stack: parseStack(String(formData.get('stack') ?? '')),
    role: String(formData.get('role') ?? '').trim(),
    outcome: String(formData.get('outcome') ?? '').trim(),
    github: String(formData.get('github') ?? '').trim() || null,
    demo: String(formData.get('demo') ?? '').trim() || null,
    spotlight: formData.get('spotlight') === 'on',
    in_progress: formData.get('in_progress') === 'on',
    published: formData.get('published') === 'on',
    sort_order: Number.parseInt(String(formData.get('sort_order') ?? '0'), 10) || 0,
  };

  const { error } = await supabase.from('projects').update(row).eq('slug', originalSlug);
  if (error) {
    redirect(`/admin/projects/${originalSlug}?error=` + encodeURIComponent(error.message));
  }

  revalidatePath('/');
  revalidatePath('/portfolio');
  revalidatePath(`/portfolio/${slug}`);
  revalidatePath(`/portfolio/${originalSlug}`);

  if (slug !== originalSlug) {
    redirect(`/admin/projects/${slug}?saved=1`);
  }
  redirect(`/admin/projects/${slug}?saved=1`);
}

export async function deleteProject(formData: FormData) {
  const supabase = await createClient();
  const slug = String(formData.get('slug') ?? '').trim();
  if (!slug) redirect('/admin/projects');

  const { error } = await supabase.from('projects').delete().eq('slug', slug);
  if (error) {
    redirect(`/admin/projects/${slug}?error=` + encodeURIComponent(error.message));
  }

  revalidatePath('/');
  revalidatePath('/portfolio');
  revalidatePath(`/portfolio/${slug}`);
  redirect('/admin/projects');
}

export async function addProjectMediaRecord(input: {
  projectId: string;
  projectSlug: string;
  type: 'image' | 'video';
  src: string;
  alt: string;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const supabase = await createClient();
  const { projectId, projectSlug, type, src, alt } = input;
  if (!projectId || !projectSlug || !src || (type !== 'image' && type !== 'video')) {
    return { ok: false, message: 'Donnees media invalides.' };
  }

  const { data: last } = await supabase
    .from('project_media')
    .select('sort_order')
    .eq('project_id', projectId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  const sortOrder = (last?.sort_order ?? -1) + 1;

  const { error } = await supabase.from('project_media').insert({
    project_id: projectId,
    type,
    src,
    alt: alt || (type === 'video' ? 'Video' : 'Image'),
    sort_order: sortOrder,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath('/');
  revalidatePath('/portfolio');
  revalidatePath(`/portfolio/${projectSlug}`);
  return { ok: true };
}

export async function deleteProjectMediaById(
  mediaId: string,
  projectSlug: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const supabase = await createClient();
  if (!mediaId || !projectSlug) {
    return { ok: false, message: 'Parametres manquants.' };
  }

  const { error } = await supabase.from('project_media').delete().eq('id', mediaId);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath('/');
  revalidatePath('/portfolio');
  revalidatePath(`/portfolio/${projectSlug}`);
  return { ok: true };
}
