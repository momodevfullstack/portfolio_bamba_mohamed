import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-12 text-zinc-900">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Mohamed Bamba</h3>
            <p className="text-zinc-600">
              Portfolio professionnel: projets web, mobile et IA.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/portfolio" className="text-zinc-600 hover:text-teal-700 transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-zinc-600 hover:text-teal-700 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-600 hover:text-teal-700 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-zinc-600">contact.bambamohamed@gmail.com</p>
          </div>
        </div>
        <div className="mt-8 border-t border-zinc-200 pt-8 text-center text-zinc-500">
          <p>&copy; 2026 Mohamed Bamba. Tous droits reserves.</p>
        </div>
      </div>
    </footer>
  );
}