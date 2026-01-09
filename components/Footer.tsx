import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const topBrands = [
    { name: 'Haas', slug: 'haas' },
    { name: 'Hurco', slug: 'hurco' },
    { name: 'Makino', slug: 'makino' },
    { name: 'Mazak', slug: 'mazak' },
    ];

  return (
    <footer className="bg-slate-800 text-slate-200 mt-12">
      <div className="max-w-6xl mx-auto px-6 py-8 grid md:grid-cols-4 gap-8">
        {/* Logo & About */}
        <div className="md:col-span-1">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Concord Machine Tools"
              width={150}
              height={40}
              className="mb-4 object-contain"
            />
          </Link>
          <p className="text-sm">
            Concord Machine Tools is your trusted source for high-quality used CNC and
            metalworking machinery.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/inventory" className="hover:text-white transition-colors duration-200">
                Inventory
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition-colors duration-200">
                About
              </Link>
            </li>
            <li>
              <Link href="/sell" className="hover:text-white transition-colors duration-200">
                Sell Your Machine
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors duration-200">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white transition-colors duration-200">
                Terms
              </Link>
            </li>
          </ul>
        </div>

        {/* Top Brands */}
        <div>
          <h3 className="font-semibold mb-2">Top Brands</h3>
          <ul className="space-y-1 text-sm">
            {topBrands.map((brand) => (
              <li key={brand.slug}>
                <Link
                  href={`/brands/${brand.slug}`}
                  className="hover:text-white transition-colors duration-200"
                >
                  {brand.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <p className="text-sm">200 E. Big Beaver Rd.</p>
          <p className="text-sm">Troy, MI 48083</p>
          <p className="text-sm">
            Phone:{' '}
            <a
              href="tel:+12482243147"
              className="text-blue-400 hover:text-white underline"
            >
              (248) 224-3147
            </a>
          </p>
          <p className="text-sm">
            Email:{' '}
            <a
              href="mailto:sales@concordmt.com"
              className="text-blue-400 hover:text-white underline"
            >
              sales@concordmt.com
            </a>
          </p>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-4">
            {/* YouTube */}
            <a
              href="https://www.youtube.com/@concordmachinetools"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <svg className="w-6 h-6 fill-current text-white hover:text-red-600" viewBox="0 0 24 24">
                <path d="M23.498 6.186a2.983 2.983 0 0 0-2.1-2.1C19.823 3.5 12 3.5 12 3.5s-7.823 0-9.398.586a2.983 2.983 0 0 0-2.1 2.1C0 7.823 0 12 0 12s0 4.177.502 5.814a2.983 2.983 0 0 0 2.1 2.1C4.177 20.5 12 20.5 12 20.5s7.823 0 9.398-.586a2.983 2.983 0 0 0 2.1-2.1C24 16.177 24 12 24 12s0-4.177-.502-5.814zM9.545 15.568V8.432l6.182 3.568-6.182 3.568z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/concordmachinetools/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg className="w-6 h-6 fill-current text-white hover:text-pink-500" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.337 3.608 1.312.975.975 1.25 2.242 1.312 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.337 2.633-1.312 3.608-.975.975-2.242 1.25-3.608 1.312-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.337-3.608-1.312-.975-.975-1.25-2.242-1.312-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.337-2.633 1.312-3.608.975-.975 2.242-1.25 3.608-1.312C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.766.131 4.545.398 3.515 1.428 2.485 2.458 2.218 3.679 2.159 4.965 2.1 6.246 2.088 6.655 2.088 12s.012 5.754.071 7.035c.059 1.286.326 2.507 1.356 3.537 1.03 1.03 2.251 1.297 3.537 1.356 1.281.059 1.69.071 7.035.071s5.754-.012 7.035-.071c1.286-.059 2.507-.326 3.537-1.356 1.03-1.03 1.297-2.251 1.356-3.537.059-1.281.071-1.69.071-7.035s-.012-5.754-.071-7.035c-.059-1.286-.326-2.507-1.356-3.537-1.03-1.03-2.251-1.297-3.537-1.356C17.754.013 17.345 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/company/concord-machine-tools/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <svg className="w-6 h-6 fill-current text-white hover:text-blue-500" viewBox="0 0 24 24">
                <path d="M4.98 3.5C3.34 3.5 2 4.84 2 6.48c0 1.64 1.34 2.98 2.98 2.98 1.64 0 2.98-1.34 2.98-2.98C7.96 4.84 6.62 3.5 4.98 3.5zM2 21.5h5.96v-11H2v11zM9.95 10.5h5.71v1.57h.08c.8-1.52 2.74-3.12 5.64-3.12 6.03 0 7.15 3.97 7.15 9.13V21.5h-5.96v-8.13c0-1.94-.03-4.44-2.71-4.44-2.71 0-3.13 2.12-3.13 4.3v8.27h-5.96v-11z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/concordmachinetools/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <svg className="w-6 h-6 fill-current text-white hover:text-blue-600" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35C.597 0 0 .592 0 1.326v21.348C0 23.407.597 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.658-4.788 1.325 0 2.463.098 2.794.142v3.24h-1.918c-1.504 0-1.795.715-1.795 1.762v2.31h3.587l-.467 3.622h-3.12V24h6.116C23.403 24 24 23.407 24 22.674V1.326C24 .592 23.403 0 22.675 0z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 text-slate-400 text-center text-xs py-4 border-t border-slate-700">
        © {new Date().getFullYear()} Concord Machine Tools. All rights reserved.
      </div>
    </footer>
  );
}
