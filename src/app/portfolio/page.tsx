import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getOrderedProjects, projects } from '@/data/projects';
import { getProjectThumb, projectKindLabel, projectUsesMobileMediaLayout } from '@/lib/projectCard';

export default function Portfolio() {
  const ordered = getOrderedProjects();

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-teal-100/90 via-cyan-50 to-sky-100/85 pb-12 pt-20 md:pb-14 md:pt-24">
          <div
            className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-teal-400/25 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl"
            aria-hidden
          />
          <div className="pointer-events-none absolute -left-6 top-16 h-14 w-14 rounded-full border-2 border-teal-300/60 motion-safe:animate-pulse" aria-hidden />

          <div className="relative mx-auto max-w-6xl px-4 text-center">
            <p
              className="animate-reveal-up text-xs font-bold uppercase tracking-[0.22em] text-teal-800"
              style={{ animationDelay: '0ms' }}
            >
              Portfolio
            </p>
            <h1
              className="animate-reveal-up mt-3 text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl lg:text-6xl"
              style={{ animationDelay: '80ms' }}
            >
              Mes <span className="text-teal-700">projets</span>
            </h1>
            <p
              className="animate-reveal-up mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-zinc-700"
              style={{ animationDelay: '160ms' }}
            >
              Case studies avec contexte, stack, choix techniques et impact produit — du mobile au web et a l&apos;IA.
            </p>
            <div
              className="animate-reveal-up mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold"
              style={{ animationDelay: '240ms' }}
            >
              <Link
                href="/"
                className="rounded-full bg-white/70 px-4 py-2 text-zinc-600 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-teal-800"
              >
                ← Accueil
              </Link>
              <Link
                href="/services"
                className="rounded-full border-2 border-teal-600/40 bg-white/50 px-4 py-2 text-teal-800 backdrop-blur-sm transition hover:border-teal-600 hover:bg-white"
              >
                Services
              </Link>
              <Link
                href="/contact"
                className="rounded-full bg-teal-700 px-4 py-2 text-white shadow-md shadow-teal-700/20 transition hover:bg-teal-800"
              >
                Contact
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-teal-100/80 bg-slate-50 py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <p
              className="animate-reveal-up text-center text-xs font-bold uppercase tracking-[0.2em] text-teal-700"
              style={{ animationDelay: '0ms' }}
            >
              Case studies
            </p>
            <p
              className="animate-reveal-up mx-auto mt-2 max-w-2xl text-center text-sm text-zinc-500"
              style={{ animationDelay: '60ms' }}
            >
              {projects.length} projet{projects.length !== 1 ? 's' : ''} — cliquez pour le detail
            </p>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ordered.map((project, i) => {
                const thumb = getProjectThumb(project);
                const kind = projectKindLabel(project);
                const mobileCard = projectUsesMobileMediaLayout(project);
                return (
                  <article
                    key={project.id}
                    className={`animate-reveal-up group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:border-teal-300 motion-safe:hover:shadow-md ${
                      project.spotlight ? 'ring-2 ring-amber-400/70 ring-offset-2 ring-offset-slate-50' : ''
                    }`}
                    style={{ animationDelay: `${Math.min(i * 70, 400)}ms` }}
                  >
                    <Link
                      href={`/portfolio/${project.id}`}
                      className={`relative block overflow-hidden bg-zinc-200 ${
                        mobileCard
                          ? 'flex min-h-[280px] items-center justify-center py-8'
                          : 'aspect-[16/10] bg-zinc-100'
                      }`}
                    >
                      {mobileCard ? (
                        <div className="relative aspect-[9/16] w-[min(52%,220px)] overflow-hidden rounded-[1.35rem] border-[3px] border-zinc-800 bg-zinc-950 shadow-lg ring-1 ring-black/20">
                          <Image
                            src={thumb.src}
                            alt={thumb.alt}
                            fill
                            className="object-contain transition duration-500 motion-safe:group-hover:scale-[1.02]"
                            sizes="220px"
                          />
                        </div>
                      ) : (
                        <Image
                          src={thumb.src}
                          alt={thumb.alt}
                          fill
                          className="object-cover transition duration-500 motion-safe:group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      )}
                      {!mobileCard ? (
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-900/50 via-transparent to-transparent" />
                      ) : null}
                      <div className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-2">
                        {project.spotlight ? (
                          <span className="rounded-md bg-amber-400 px-2.5 py-1 text-xs font-bold text-amber-950 shadow-sm">
                            A la une
                          </span>
                        ) : null}
                        {project.inProgress ? (
                          <span className="rounded-md bg-sky-700 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                            En cours
                          </span>
                        ) : null}
                        <span className="rounded-md bg-white/95 px-2.5 py-1 text-xs font-semibold text-teal-800 shadow-sm backdrop-blur-sm">
                          {kind}
                        </span>
                      </div>
                    </Link>

                    <div className="p-5">
                      <h2 className="text-lg font-semibold text-zinc-900">{project.title}</h2>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-600">{project.summary}</p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.stack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-800"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.stack.length > 3 && (
                          <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-600">
                            +{project.stack.length - 3}
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/portfolio/${project.id}`}
                        className="mt-5 inline-flex items-center text-sm font-semibold text-teal-700 transition hover:text-teal-800"
                      >
                        Voir l&apos;etude de cas
                        <span className="ml-1 transition group-hover:translate-x-0.5" aria-hidden>
                          →
                        </span>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
