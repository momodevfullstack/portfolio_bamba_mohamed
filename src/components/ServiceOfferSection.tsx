import { serviceOfferCards } from '@/data/service-offer';

type Props = {
  className?: string;
  /** Fond de section (ex. blanc sur la home, neutre sur /services) */
  variant?: 'plain' | 'muted';
  /** Sur /services le hero porte deja l’intro : masquer le bloc titre + paragraphe */
  showIntro?: boolean;
};

export function ServiceOfferSection({
  className = '',
  variant = 'plain',
  showIntro = true,
}: Props) {
  const bg = variant === 'muted' ? 'bg-slate-50' : 'bg-white';

  return (
    <section id="services" className={`scroll-mt-24 ${bg} py-16 md:py-20 ${className}`}>
      <div className="mx-auto max-w-6xl px-4">
        {showIntro ? (
          <div className="mb-14 text-center">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Prestations</span>
            <h2 className="mb-4 text-3xl font-bold text-zinc-900 md:text-4xl">Ce que je propose</h2>
            <p className="mx-auto max-w-3xl text-lg text-zinc-600">
              Des services alignes sur vos enjeux produit : du front au data, avec une approche technique rigoureuse
              et orientee resultats.
            </p>
          </div>
        ) : (
          <h2 className="sr-only">Detail des prestations</h2>
        )}

        <div className={`grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-4 ${showIntro ? '' : 'pt-2'}`}>
          {serviceOfferCards.map((item, i) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="animate-reveal-up group relative mt-10 rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:border-teal-400 motion-safe:hover:shadow-md"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div
                  className={`absolute left-1/2 top-0 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-teal-700 text-white ring-4 ring-white transition duration-300 motion-safe:group-hover:scale-105 motion-safe:group-hover:bg-teal-800 motion-safe:group-hover:shadow-xl motion-safe:group-hover:ring-teal-100 ${
                    item.iconShadow ? 'shadow-lg' : 'shadow-md'
                  }`}
                >
                  <Icon
                    className="h-9 w-9 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-110"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </div>
                <div className="px-5 pb-8 pt-14 text-left">
                  <h3 className="mb-3 text-lg font-semibold text-zinc-900 transition-colors duration-300 group-hover:text-teal-800">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-600 transition-colors duration-300 group-hover:text-zinc-700">
                    {item.body}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
