import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { getProjectThumb, projectKindLabel, projectUsesMobileMediaLayout } from '@/lib/projectCard';
import { getPublicProjects } from '@/lib/projects/service';

export default async function Home() {
  const featuredProjects = (await getPublicProjects()).slice(0, 3);
  const valueCards = [
    {
      title: 'Execution produit rapide',
      body: "Je passe d'une idee a un produit utilisable en gardant un code lisible et evolutif.",
      stat: 'MVP clair',
    },
    {
      title: 'Architecture robuste',
      body: 'Je structure les bases techniques pour faciliter la maintenance, les evolutions et la performance.',
      stat: 'Scalable',
    },
    {
      title: 'IA utile, pas gadget',
      body: "J'integre des briques IA quand elles accelerent vraiment l'experience utilisateur et les operations.",
      stat: 'Impact concret',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <About />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Valeur</p>
              <h2 className="mt-2 text-3xl font-bold text-zinc-900 md:text-4xl">Ce que j&apos;apporte a une equipe tech</h2>
              <p className="mt-3 max-w-3xl text-zinc-600">
                Un profil hybride Developpement + IA pour livrer des solutions modernes, fiables et orientees resultat.
              </p>
            </div>
            <Link href="/contact" className="text-sm font-semibold text-teal-700 hover:text-teal-800">
              Planifier un echange →
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {valueCards.map((item) => (
              <article
                key={item.title}
                className="group rounded-2xl border border-zinc-200 bg-zinc-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-teal-300 hover:bg-white hover:shadow-lg"
              >
                <p className="mb-3 inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                  {item.stat}
                </p>
                <h3 className="text-xl font-semibold text-zinc-900">{item.title}</h3>
                <p className="mt-3 text-zinc-600">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Case studies</p>
              <h2 className="mt-2 text-3xl font-bold text-zinc-900 md:text-4xl">Projets en avant</h2>
              <p className="mt-3 max-w-2xl text-zinc-600">
                Apercus techniques et etudes de cas — le projet mis en avant est celui sur lequel je travaille en priorite.
              </p>
            </div>
            <Link href="/portfolio" className="text-sm font-semibold text-teal-700 hover:text-teal-800">
              Voir tout le portfolio →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featuredProjects.map((project) => {
              const thumb = getProjectThumb(project);
              const kind = projectKindLabel(project);
              const mobileCard = projectUsesMobileMediaLayout(project);
              return (
                <article
                  key={project.id}
                  className={`group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:border-teal-300 motion-safe:hover:shadow-md ${
                    project.spotlight ? 'ring-2 ring-amber-400/70 ring-offset-2 ring-offset-slate-50' : ''
                  }`}
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
                        sizes="(max-width: 768px) 100vw, 33vw"
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
                    <h3 className="text-lg font-semibold text-zinc-900">{project.title}</h3>
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

      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl rounded-3xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-teal-50/40 px-6 py-12 text-center md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Contact</p>
          <h2 className="mt-3 text-3xl font-bold text-zinc-900 md:text-4xl">Construisons un produit utile et ambitieux</h2>
          <p className="mx-auto mt-4 max-w-3xl text-zinc-600">
            Ouvert aux opportunites en developpement full-stack et IA appliquee. Reponse en moins de 24h.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="rounded-md bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-800">
              Planifier un echange
            </Link>
            <Link href="/portfolio" className="rounded-md border border-zinc-300 px-6 py-3 font-semibold text-zinc-800 transition hover:border-teal-500 hover:text-teal-700">
              Voir mes realisations
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
