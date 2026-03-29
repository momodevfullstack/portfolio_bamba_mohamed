const TECH_ITEMS = [
  'HTML5',
  'CSS',
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'Flutter',
  'Tailwind CSS',
  'PHP',
  'Python',
  'SQL',
  'Git',
  'GitHub',
  'REST APIs',
  'VS Code',
];

function TechStrip() {
  return (
    <>
      {TECH_ITEMS.map((label) => (
        <span
          key={label}
          className="inline-block shrink-0 px-8 text-sm font-semibold uppercase tracking-[0.12em] text-zinc-600 md:px-10 md:text-base"
        >
          {label}
        </span>
      ))}
    </>
  );
}

export function HeroTechMarquee() {
  return (
    <div
      className="relative border-t border-teal-200/80 bg-white/85 py-3.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)] backdrop-blur-sm md:py-4"
      aria-label="Technologies et outils utilises"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-teal-50/95 to-transparent md:w-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-cyan-50/95 to-transparent md:w-20" />

      <div className="overflow-hidden">
        <div className="hero-marquee-track flex w-max motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center">
          <div className="flex shrink-0 items-center motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center">
            <TechStrip />
          </div>
          <div className="flex shrink-0 items-center motion-reduce:hidden" aria-hidden>
            <TechStrip />
          </div>
        </div>
      </div>
    </div>
  );
}
