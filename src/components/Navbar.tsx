import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-teal-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <div className="text-xl font-bold tracking-wide text-teal-800 md:text-2xl">
          BAMBA MOHAMED
        </div>
        <div className="hidden items-center gap-7 md:flex">
          <Link href="/" className="text-sm font-medium text-zinc-700 hover:text-teal-700 transition-colors">
            Accueil
          </Link>
          <Link href="/services" className="text-sm font-medium text-zinc-700 hover:text-teal-700 transition-colors">
            Services
          </Link>
          <Link href="/portfolio" className="text-sm font-medium text-zinc-700 hover:text-teal-700 transition-colors">
            Portfolio
          </Link>
          <Link href="/contact" className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 transition-colors">
            PARLONS-EN
          </Link>
        </div>
      </div>
    </nav>
  );
}