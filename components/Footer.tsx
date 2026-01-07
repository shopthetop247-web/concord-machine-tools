import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-200 mt-12">
      <div className="max-w-6xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-8">
        {/* Logo & About */}
        <div>
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

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <p className="text-sm">220 E. Big Beaver Rd.</p>
          <p className="text-sm">Troy, MI 48083</p>
          <p className="text-sm">Phone: (248) 224-3147</p>
          <p className="text-sm">Email: sales@concordmt.com</p>
        </div>
      </div>

      <div className="bg-slate-900 text-slate-400 text-center text-xs py-4 border-t border-slate-700">
        © {new Date().getFullYear()} Concord Machine Tools. All rights reserved.
      </div>
    </footer>
  );
}
