import Image from 'next/image';
import Link from 'next/link';
import profilePhoto from '../../assets/photo_profile.png';
import { HeroTechMarquee } from '@/components/HeroTechMarquee';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 pb-16 pt-16 md:pb-24 md:pt-24">
      <div className="pointer-events-none absolute -left-10 top-14 h-20 w-20 rounded-full border border-teal-200/70 motion-safe:animate-pulse" />
      <div className="pointer-events-none absolute bottom-10 left-1/3 h-4 w-4 rounded-full bg-teal-200/70 motion-safe:animate-pulse" />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-12 md:items-center">
        <div className="md:col-span-7 animate-fade-in">
          <p className="mb-4 text-sm font-medium tracking-wide text-teal-700">Portfolio Professionnel</p>
          <h1 className="mb-3 text-4xl font-bold leading-tight text-zinc-900 md:text-6xl animate-slide-in-left">
            Bonjour, je suis <span className="text-teal-700">Mohamed Bamba</span>
          </h1>
          <p className="mb-4 text-3xl font-semibold text-teal-700 animate-slide-in-right">Developpeur Web & Mobile</p>
          <p className="mb-8 max-w-2xl text-base text-zinc-600 md:text-lg animate-fade-in">
            Developpeur Full-Stack avec un parcours en developpement d&apos;applications web/mobile.
            Actuellement en Master 1 Expert en Intelligence Artificielle.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/portfolio"
              className="rounded-md border border-teal-300 bg-white px-8 py-3 text-center font-semibold text-teal-800 transition hover:bg-teal-50"
            >
              DECOUVRIR
            </Link>
            <Link
              href="/contact"
              className="rounded-md bg-teal-700 px-8 py-3 text-center font-semibold text-white transition hover:bg-teal-800"
            >
              CONTACTEZ-MOI
            </Link>
          </div>
        </div>

        <div className="md:col-span-5 animate-scale-in">
          <div className="relative mx-auto flex min-h-[400px] w-full max-w-lg flex-col items-center justify-center pb-6 pt-4 md:min-h-[520px] md:pb-8 md:pt-6">
            <div
              className="pointer-events-none absolute left-1/2 top-[42%] z-0 h-[min(100vw,22rem)] w-[min(100vw,22rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border-[10px] border-white/70 shadow-inner motion-safe:animate-[spin_28s_linear_infinite] md:h-[26rem] md:w-[26rem] md:border-[12px]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute left-1/2 top-[42%] z-0 h-[min(92vw,19rem)] w-[min(92vw,19rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-teal-200/40 to-cyan-200/30 motion-safe:animate-[spin_18s_linear_infinite_reverse] md:h-[22.5rem] md:w-[22.5rem]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute left-1/2 top-[42%] z-0 h-[min(78vw,16rem)] w-[min(78vw,16rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-teal-300/50 motion-safe:animate-pulse md:h-[19rem] md:w-[19rem]"
              aria-hidden
            />

            <div className="group relative z-10 w-[88%] max-w-[20rem] animate-float md:max-w-[24rem]">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] ring-4 ring-white transition duration-500 ease-out will-change-transform hover:-translate-y-4 hover:scale-[1.04] hover:shadow-[0_35px_60px_-12px_rgba(15,118,110,0.45)] md:rounded-3xl md:ring-[6px]">
                <Image
                  src={profilePhoto}
                  alt="Portrait de Mohamed Bamba"
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="(max-width: 768px) 320px, 384px"
                />
              </div>
              <p className="mt-5 text-center text-sm font-medium text-zinc-600">
                Developpeur Full-Stack | Etudiant en IA
              </p>
            </div>
          </div>
        </div>
      </div>

      <HeroTechMarquee />
    </section>
  );
}
