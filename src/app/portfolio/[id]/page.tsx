import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getPublicProjectBySlug, getPublicProjectSlugs } from '@/lib/projects/service';
import {
  getMediaDisplaySrc,
  getProjectHeroVideo,
  getProjectThumb,
  projectKindLabel,
  projectUsesMobileMediaLayout,
} from '@/lib/projectCard';

type Params = {
  id: string;
};

export async function generateStaticParams() {
  return getPublicProjectSlugs();
}

export default async function ProjectDetail({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const project = await getPublicProjectBySlug(id);

  if (!project) {
    notFound();
  }

  const heroVideo = getProjectHeroVideo(project);
  const hero = getProjectThumb(project);
  const kind = projectKindLabel(project);
  const galleryMedia = project.media.filter((_, i) => i !== heroVideo?.index);
  const galleryImages = galleryMedia.filter((m) => m.type === 'image');
  const galleryVideos = galleryMedia.filter((m) => m.type === 'video');
  const mobileLayout = projectUsesMobileMediaLayout(project);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-teal-100/90 via-cyan-50 to-sky-100/85 pb-10 pt-16 md:pb-12 md:pt-20">
          <div
            className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-teal-400/25 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl"
            aria-hidden
          />

          <div className="relative mx-auto max-w-6xl px-4">
            <Link
              href="/portfolio"
              className="animate-reveal-up inline-flex text-sm font-semibold text-teal-800 transition hover:text-teal-950"
              style={{ animationDelay: '0ms' }}
            >
              ← Retour au portfolio
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {project.spotlight ? (
                <span
                  className="animate-reveal-up rounded-full bg-amber-400 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-950 shadow-sm"
                  style={{ animationDelay: '40ms' }}
                >
                  A la une
                </span>
              ) : null}
              {project.inProgress ? (
                <span
                  className="animate-reveal-up rounded-full bg-sky-700 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm"
                  style={{ animationDelay: '50ms' }}
                >
                  En cours
                </span>
              ) : null}
              <span
                className="animate-reveal-up rounded-full border border-teal-600/35 bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-800 backdrop-blur-sm"
                style={{ animationDelay: '60ms' }}
              >
                {kind}
              </span>
            </div>

            <h1
              className="animate-reveal-up mt-3 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl lg:text-5xl"
              style={{ animationDelay: '100ms' }}
            >
              {project.title}
            </h1>
            <p
              className="animate-reveal-up mt-4 max-w-3xl text-lg leading-relaxed text-zinc-700"
              style={{ animationDelay: '160ms' }}
            >
              {project.summary}
            </p>

            {project.inProgress ? (
              <p
                className="animate-reveal-up mt-4 max-w-3xl rounded-xl border border-amber-200/90 bg-amber-50/90 px-4 py-3 text-sm leading-relaxed text-amber-950"
                style={{ animationDelay: '200ms' }}
              >
                Projet personnel en cours : le fonctionnel n&apos;est pas detaille volontairement.
              </p>
            ) : null}

            {(project.demo || project.github) && (
              <div
                className="animate-reveal-up mt-6 flex flex-wrap gap-3"
                style={{ animationDelay: '220ms' }}
              >
                {project.demo ? (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-700/20 transition hover:bg-teal-800"
                  >
                    Voir la demo
                  </a>
                ) : null}
                {project.github ? (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border-2 border-teal-600/40 bg-white/60 px-5 py-2.5 text-sm font-semibold text-teal-900 backdrop-blur-sm transition hover:border-teal-600 hover:bg-white"
                  >
                    Code source
                  </a>
                ) : null}
              </div>
            )}

            <div
              className={`animate-reveal-up mt-10 flex w-full justify-center ${mobileLayout ? 'px-2' : ''}`}
              style={{ animationDelay: '280ms' }}
            >
              <div
                className={
                  mobileLayout
                    ? 'relative w-[min(88vw,340px)] overflow-hidden rounded-[2rem] border-4 border-zinc-800 bg-zinc-950 shadow-2xl shadow-zinc-900/40 ring-1 ring-white/10'
                    : `relative w-full overflow-hidden rounded-2xl border border-white/60 bg-zinc-900 shadow-lg shadow-teal-900/10 ${
                        heroVideo ? 'aspect-video max-h-[min(72vh,820px)]' : 'aspect-[21/9]'
                      }`
                }
              >
                {mobileLayout ? (
                  <div className="relative aspect-[9/18] w-full">
                    {heroVideo ? (
                      <video
                        className="absolute inset-0 h-full w-full object-contain"
                        autoPlay
                        muted
                        playsInline
                        loop
                        poster={heroVideo.media.poster}
                        aria-label={heroVideo.media.alt}
                      >
                        <source src={heroVideo.media.src} type="video/mp4" />
                      </video>
                    ) : (
                      <Image
                        src={hero.src}
                        alt={hero.alt}
                        fill
                        className="object-contain"
                        priority
                        sizes="340px"
                      />
                    )}
                  </div>
                ) : heroVideo ? (
                  <video
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    playsInline
                    loop
                    poster={heroVideo.media.poster}
                    aria-label={heroVideo.media.alt}
                  >
                    <source src={heroVideo.media.src} type="video/mp4" />
                  </video>
                ) : (
                  <Image
                    src={hero.src}
                    alt={hero.alt}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1152px) 100vw, 1152px"
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-teal-100/80 bg-slate-50 py-14 md:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <p className="text-base leading-relaxed text-zinc-700 md:text-lg">{project.description}</p>

            <div className="mt-8 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-teal-200/80 bg-white px-4 py-1.5 text-sm font-medium text-teal-900 shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            {galleryImages.length > 0 ? (
              <div className="mt-12">
                <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
                  <h2 className="text-lg font-semibold text-zinc-900">Galerie</h2>
                  {galleryImages.length > 1 ? (
                    <p className="text-sm text-zinc-500">
                      {mobileLayout
                        ? 'Defilez horizontalement — apercus format telephone (portrait).'
                        : 'Faites defiler horizontalement pour voir toutes les images'}
                    </p>
                  ) : null}
                </div>
                <div
                  className="-mx-4 flex gap-4 overflow-x-auto overflow-y-hidden px-4 pb-4 pt-1 [-webkit-overflow-scrolling:touch] scroll-smooth snap-x snap-mandatory md:mx-0 md:px-0"
                  role="region"
                  aria-label="Galerie images du projet"
                >
                  {galleryImages.map((media) => {
                    const index = project.media.indexOf(media);
                    return (
                      <div
                        key={`${project.id}-img-${index}`}
                        className={
                          mobileLayout
                            ? 'w-[min(78vw,280px)] shrink-0 snap-center overflow-hidden rounded-[1.75rem] border-4 border-zinc-800 bg-zinc-950 shadow-lg ring-1 ring-white/10 sm:w-[min(70vw,300px)]'
                            : 'w-[min(88vw,520px)] shrink-0 snap-center overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-md shadow-zinc-900/5 md:w-[min(72vw,560px)] lg:w-[min(60vw,600px)]'
                        }
                      >
                        <div
                          className={
                            mobileLayout
                              ? 'relative aspect-[9/18] w-full'
                              : 'relative aspect-video w-full'
                          }
                        >
                          <Image
                            src={getMediaDisplaySrc(project, media, index)}
                            alt={media.alt}
                            fill
                            className={mobileLayout ? 'object-contain' : 'object-cover'}
                            sizes={mobileLayout ? '300px' : '(max-width: 768px) 88vw, 560px'}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {galleryVideos.length > 0 ? (
              <div
                className={
                  mobileLayout
                    ? 'mt-10 flex flex-wrap justify-center gap-6'
                    : 'mt-10 grid gap-5 md:grid-cols-2'
                }
              >
                {galleryVideos.map((media) => {
                  const index = project.media.indexOf(media);
                  return (
                    <div
                      key={`${project.id}-vid-${index}`}
                      className={
                        mobileLayout
                          ? 'w-[min(88vw,320px)] overflow-hidden rounded-[1.75rem] border-4 border-zinc-800 bg-zinc-950 shadow-lg ring-1 ring-white/10'
                          : 'overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-md shadow-zinc-900/5'
                      }
                    >
                      <div className={mobileLayout ? 'relative aspect-[9/18] w-full' : ''}>
                        <video
                          controls
                          playsInline
                          poster={media.poster}
                          className={
                            mobileLayout
                              ? 'absolute inset-0 h-full w-full object-contain'
                              : 'aspect-video w-full object-cover'
                          }
                          aria-label={media.alt}
                        >
                          <source src={media.src} type="video/mp4" />
                        </video>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-zinc-900">Role dans le projet</h2>
                <p className="mt-3 leading-relaxed text-zinc-600">{project.role}</p>
              </div>
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-zinc-900">Impact et resultat</h2>
                <p className="mt-3 leading-relaxed text-zinc-600">{project.outcome}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
