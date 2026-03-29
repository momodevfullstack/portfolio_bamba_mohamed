import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ServiceOfferSection } from '@/components/ServiceOfferSection';

export default function Services() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />
      <main>
        {/* Hero coloré : même famille que la home, halos doux — lisible et pas “arc-en-ciel” */}
        <section className="relative overflow-hidden bg-gradient-to-br from-teal-100/90 via-cyan-50 to-sky-100/85 pb-14 pt-20 md:pb-16 md:pt-24">
          <div
            className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-teal-400/25 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-1/2 top-1/3 h-[min(90vw,28rem)] w-[min(90vw,28rem)] -translate-x-1/2 rounded-full bg-cyan-300/15 blur-3xl"
            aria-hidden
          />
          <div className="pointer-events-none absolute -left-8 top-20 h-16 w-16 rounded-full border-2 border-teal-300/60 motion-safe:animate-pulse" aria-hidden />
          <div className="pointer-events-none absolute bottom-16 right-1/4 h-3 w-3 rounded-full bg-teal-500/50 motion-safe:animate-pulse" aria-hidden />

          <div className="relative mx-auto max-w-6xl px-4 text-center">
            <p
              className="animate-reveal-up text-xs font-bold uppercase tracking-[0.22em] text-teal-800"
              style={{ animationDelay: '0ms' }}
            >
              Offre
            </p>
            <h1
              className="animate-reveal-up mt-3 text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl lg:text-6xl"
              style={{ animationDelay: '80ms' }}
            >
              Des <span className="text-teal-700">services</span> sur mesure
            </h1>
            <p
              className="animate-reveal-up mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-zinc-700"
              style={{ animationDelay: '160ms' }}
            >
              Du developpement web et mobile a la data et l&apos;IA : une offre claire, orientee livrables et impact
              metier — du front au pilotage produit.
            </p>
            <div
              className="animate-reveal-up mt-8 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold"
              style={{ animationDelay: '240ms' }}
            >
              <Link
                href="/"
                className="rounded-full bg-white/70 px-4 py-2 text-zinc-600 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-teal-800"
              >
                ← Accueil
              </Link>
              <Link
                href="/portfolio"
                className="rounded-full bg-teal-700 px-4 py-2 text-white shadow-md shadow-teal-700/20 transition hover:bg-teal-800"
              >
                Portfolio
              </Link>
              <Link
                href="/contact"
                className="rounded-full border-2 border-teal-600/40 bg-white/50 px-4 py-2 text-teal-800 backdrop-blur-sm transition hover:border-teal-600 hover:bg-white"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="relative mx-auto mt-14 max-w-6xl px-4">
            <div className="mx-auto max-w-xl rounded-2xl border border-teal-200/60 bg-white/60 px-6 py-5 shadow-sm backdrop-blur-md">
              <p
                className="animate-reveal-up text-center text-xs font-bold uppercase tracking-[0.2em] text-teal-800"
                style={{ animationDelay: '280ms' }}
              >
                Au programme
              </p>
              <p
                className="animate-reveal-up mt-2 text-center text-sm text-zinc-600"
                style={{ animationDelay: '320ms' }}
              >
                Huit prestations pour couvrir vos enjeux techniques et produit
              </p>
            </div>
          </div>
        </section>

        <ServiceOfferSection
          variant="muted"
          showIntro={false}
          className="border-t border-teal-100/80 pb-20 pt-10 md:pt-12"
        />

        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <section className="animate-reveal-up rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-8 text-center shadow-sm md:p-10">
            <h2 className="text-2xl font-bold text-zinc-900 md:text-3xl">Un projet en tete ?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-700">
              Partagez votre contexte : je reviens vers vous avec une proposition claire en moins de 24h.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex rounded-md bg-teal-700 px-8 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
            >
              Discuter de votre projet
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
