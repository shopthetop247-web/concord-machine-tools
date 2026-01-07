'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="Concord Machine Tools"
            width={150}
            height={40}
            className="object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 font-medium">
          <Link
            href="/inventory"
            className="hover:text-blue-400 transition-colors duration-200"
          >
            Inventory
          </Link>
          <Link
            href="/about"
            className="hover:text-blue-400 transition-colors duration-200"
          >
            About
          </Link>
          <Link
            href="/sell"
            className="hover:text-blue-400 transition-colors duration-200"
          >
            Sell Your Machine
          </Link>
          <Link
            href="/contact"
            className="hover:text-blue-400 transition-colors duration-200"
          >
            Contact
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none text-2xl"
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-800 text-white">
          <ul className="flex flex-col space-y-2 px-4 py-4">
            <li>
              <Link href="/inventory" onClick={() => setMenuOpen(false)}>
                Inventory
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={() => setMenuOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link href="/sell" onClick={() => setMenuOpen(false)}>
                Sell Your Machine
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
