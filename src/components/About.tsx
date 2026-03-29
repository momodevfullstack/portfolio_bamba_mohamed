import Link from 'next/link';
import { Brain, Briefcase, GraduationCap, Monitor, Smartphone, Wrench } from 'lucide-react';

/** Projets personnels mis en avant (chiffre fixe ; le compte GitHub total peut etre plus eleve). */
const PERSONAL_PROJECTS_COUNT = 17;

const services = [
  {
    icon: Monitor,
    title: 'Developpement web',
    subtitle: 'React, Next.js, interfaces performantes',
  },
  {
    icon: Smartphone,
    title: 'Applications mobiles',
    subtitle: 'Flutter, parcours fluides iOS & Android',
  },
  {
    icon: Brain,
    title: 'IA & donnees',
    subtitle: 'Python, analyse et produits data-aware',
  },
] as const;

export default function About() {
  const proRoles = 2;
  const experienceLabel = '1+';
  const experienceHint = 'an en milieu professionnel';

  return (
    <section className="bg-white py-20 text-zinc-900 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Colonne gauche — services + rail (inspire du reference, en teal / clair) */}
          <div className="animate-reveal-up lg:col-span-4" style={{ animationDelay: '0ms' }}>
            <p className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Ce que je fais</p>
            <div className="relative">
              <div
                className="absolute left-7 top-8 bottom-8 w-0.5 -translate-x-1/2 bg-gradient-to-b from-teal-600 via-teal-300 to-teal-100"
                aria-hidden
              />
              <ul className="relative space-y-10">
                {services.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.title} className="flex gap-5">
                      <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-teal-600 bg-white shadow-sm">
                        <Icon className="h-6 w-6 text-teal-700" strokeWidth={1.5} aria-hidden />
                      </div>
                      <div className="pt-2">
                        <p className="font-semibold text-zinc-900">{item.title}</p>
                        <p className="mt-1 text-sm text-zinc-500">{item.subtitle}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Colonne droite — bio + stats */}
          <div className="lg:col-span-8">
            <h2
              className="animate-reveal-up text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
              style={{ animationDelay: '80ms' }}
            >
              A propos
            </h2>
            <p
              className="animate-reveal-up mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600"
              style={{ animationDelay: '160ms' }}
            >
              Developpeur full-stack oriente produit : j&apos;assemble le web, le mobile et la data pour livrer des
              experiences stables et utiles. En parallele, je poursuis un Master 1 en intelligence artificielle pour
              renforcer mon angle data et IA.
            </p>

            <div
              className="animate-reveal-up mt-10 grid grid-cols-1 gap-8 border-t border-zinc-200 pt-10 sm:grid-cols-3"
              style={{ animationDelay: '240ms' }}
            >
              <div>
                <p className="font-bold tabular-nums text-zinc-900">
                  <span className="text-4xl md:text-5xl">{PERSONAL_PROJECTS_COUNT}</span>
                </p>
                <p className="mt-2 text-sm text-zinc-500">Projets </p>
              </div>
              <div>
                <p className="flex items-baseline gap-1 font-bold tabular-nums text-zinc-900">
                  <span className="text-4xl md:text-5xl">{proRoles}</span>
                  <span className="text-lg font-semibold text-teal-600">+</span>
                </p>
                <p className="mt-2 text-sm text-zinc-500">Experiences en entreprise</p>
              </div>
              <div>
                <p className="flex items-baseline gap-1 font-bold tabular-nums text-zinc-900">
                  <span className="text-4xl md:text-5xl">{experienceLabel}</span>
                </p>
                <p className="mt-2 text-sm text-zinc-500">{experienceHint}</p>
              </div>
            </div>

            <div
              className="animate-reveal-up mt-10 flex flex-wrap gap-4 text-sm font-semibold"
              style={{ animationDelay: '320ms' }}
            >
              <Link href="/portfolio" className="text-teal-700 underline-offset-4 hover:text-teal-800 hover:underline">
                Voir les projets
              </Link>
              <span className="text-zinc-300" aria-hidden>
                |
              </span>
              <Link href="/services" className="text-teal-700 underline-offset-4 hover:text-teal-800 hover:underline">
                Prestations
              </Link>
              <span className="text-zinc-300" aria-hidden>
                |
              </span>
              <Link href="/contact" className="text-teal-700 underline-offset-4 hover:text-teal-800 hover:underline">
                Me contacter
              </Link>
            </div>
          </div>
        </div>

        {/* Detail condense — parcours, outils, experience (sans alourdir le hero about) */}
        <div
          className="animate-reveal-up mt-20 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-8 md:p-10"
          style={{ animationDelay: '400ms' }}
        >
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <div className="mb-3 flex items-center gap-2 text-teal-700">
                <GraduationCap className="h-5 w-5" aria-hidden />
                <h3 className="text-sm font-bold uppercase tracking-wider">Parcours</h3>
              </div>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li>
                  <span className="font-semibold text-zinc-800">Licence</span> — Developpement web & mobile
                </li>
                <li>
                  <span className="font-semibold text-zinc-800">Master 1 (en cours)</span> — Expertise IA
                </li>
                <li className="pt-1 text-xs font-medium text-emerald-700">Disponible pour opportunites pro</li>
              </ul>
            </div>
            <div>
              <div className="mb-3 flex items-center gap-2 text-teal-700">
                <Wrench className="h-5 w-5" aria-hidden />
                <h3 className="text-sm font-bold uppercase tracking-wider">Outils</h3>
              </div>
              <p className="text-sm text-zinc-600">
                Git, GitHub, GitLab, VS Code, Agile. Langues : francais (courant), anglais (technique).
              </p>
            </div>
            <div>
              <div className="mb-3 flex items-center gap-2 text-teal-700">
                <Briefcase className="h-5 w-5" aria-hidden />
                <h3 className="text-sm font-bold uppercase tracking-wider">Experience</h3>
              </div>
              <ul className="space-y-3 text-sm text-zinc-600">
                <li>
                  <span className="font-semibold text-zinc-800">Developpeur Web & Analyste digital</span>
                  <span className="mt-0.5 block text-xs text-zinc-500">ESCT, Abidjan — Oct. 2024 - Mai 2025</span>
                </li>
                <li>
                  <span className="font-semibold text-zinc-800">Developpeur Web & Mobile</span>
                  <span className="mt-0.5 block text-xs text-zinc-500">Smart Com, Abidjan — Fev. - Juil. 2024</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* <div
          className="animate-reveal-up mt-16 flex justify-center"
          style={{ animationDelay: '480ms' }}
          aria-hidden
        >
          <div className="h-14 w-px rounded-full bg-gradient-to-b from-teal-600 via-teal-300 to-transparent" />
        </div> */}
      </div>
    </section>
  );
}
