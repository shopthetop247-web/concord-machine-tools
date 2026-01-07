import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-slate-900 text-white shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo.svg" // Place your Concord logo in /public/logo.svg
            alt="Concord Machine Tools"
            width={150}
            height={40}
            className="object-contain"
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-6 font-medium">
          <Link href="/inventory" className="hover:text-blue-400">
            Inventory
          </Link>
          <Link href="/about" className="hover:text-blue-400">
            About
          </Link>
          <Link href="/sell" className="hover:text-blue-400">
            Sell Your Machine
          </Link>
          <Link href="/contact" className="hover:text-blue-400">
            Contact
          </Link>
        </nav>

        {/* Mobile Menu Placeholder */}
        <div className="md:hidden">
          {/* We'll add a hamburger menu later */}
          <span>☰</span>
        </div>
      </div>
    </header>
  );
}
