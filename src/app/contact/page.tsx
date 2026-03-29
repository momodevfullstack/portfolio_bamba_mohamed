import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Contact() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-teal-100/90 via-cyan-50 to-sky-100/85 pb-12 pt-20 md:pb-14 md:pt-24">
          <div
            className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-teal-400/25 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-12 bottom-0 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl"
            aria-hidden
          />
          <div className="pointer-events-none absolute right-1/4 top-12 h-2 w-2 rounded-full bg-teal-500/50 motion-safe:animate-pulse" aria-hidden />

          <div className="relative mx-auto max-w-5xl px-4 text-center">
            <p
              className="animate-reveal-up text-xs font-bold uppercase tracking-[0.22em] text-teal-800"
              style={{ animationDelay: '0ms' }}
            >
              Contact
            </p>
            <h1
              className="animate-reveal-up mt-3 text-3xl font-bold tracking-tight text-zinc-900 md:text-5xl lg:text-6xl"
              style={{ animationDelay: '80ms' }}
            >
              Construisons quelque chose d&apos;<span className="text-teal-700">utile</span> et ambitieux
            </h1>
            <p
              className="animate-reveal-up mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-zinc-700"
              style={{ animationDelay: '160ms' }}
            >
              Disponible pour alternance, stage, premier poste full-stack / IA ou mission produit-tech. Reponse sous 24h.
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
                href="/portfolio"
                className="rounded-full bg-teal-700 px-4 py-2 text-white shadow-md shadow-teal-700/20 transition hover:bg-teal-800"
              >
                Portfolio
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-teal-100/80 bg-slate-50 py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div
                className="animate-reveal-up rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 motion-safe:hover:border-teal-200 motion-safe:hover:shadow-md md:p-8"
                style={{ animationDelay: '0ms' }}
              >
                <h2 className="text-xl font-bold text-zinc-900">Coordonnees</h2>
                <ul className="mt-5 space-y-4 text-sm text-zinc-700">
                  <li>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Email</span>
                    <a
                      className="mt-1 inline-block font-medium text-teal-700 hover:text-teal-800"
                      href="mailto:contact.bambamohamed@gmail.com"
                    >
                      contact.bambamohamed@gmail.com
                    </a>
                  </li>
                  <li>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Telephone</span>
                    <a className="mt-1 inline-block font-medium text-teal-700 hover:text-teal-800" href="tel:+33766689696">
                      +33 7 66 68 96 96
                    </a>
                  </li>
                  <li>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Localisation</span>
                    <span className="mt-1 block">Paris, France (remote-friendly)</span>
                  </li>
                </ul>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="mailto:contact.bambamohamed@gmail.com"
                    className="rounded-md bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
                  >
                    Envoyer un email
                  </a>
                  <Link
                    href="/portfolio"
                    className="rounded-md border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:border-teal-500 hover:text-teal-700"
                  >
                    Voir mes projets
                  </Link>
                </div>
              </div>

              <div
                className="animate-reveal-up rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 motion-safe:hover:border-teal-200 motion-safe:hover:shadow-md md:p-8"
                style={{ animationDelay: '80ms' }}
              >
                <h2 className="text-xl font-bold text-zinc-900">Types de collaboration</h2>
                <div className="mt-5 grid gap-2">
                  {[
                    'Alternance IA / Data',
                    'Stage developpement web / mobile',
                    'CDI Junior Full-Stack',
                    'Mission IA appliquee',
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-teal-200 bg-teal-50/80 px-4 py-2.5 text-sm font-medium text-teal-900"
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-sm leading-relaxed text-zinc-600">
                  Partagez votre contexte et vos objectifs : je peux proposer une approche claire (technique, produit,
                  roadmap).
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
