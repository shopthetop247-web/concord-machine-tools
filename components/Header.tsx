'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Canonical categories (label + slug must match Sanity)
  const categories = [
    { title: 'CNC Machines', slug: 'cnc-machinery' },
    { title: 'Manual Machinery', slug: 'manual-machinery' },
    { title: 'Fabricating & Stamping', slug: 'fabricating-and-stamping' },
  ];

  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Concord Machine Tools"
            width={180}
            height={50}
            className="object-contain m-0"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 font-medium">
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

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl"
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-800">
          <ul className="flex flex-col space-y-2 px-4 py-4">
            <li className="font-semibold border-b border-slate-700 pb-2">
              Inventory
              <ul className="mt-2 ml-2 space-y-1">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/inventory/${cat.slug}`}
                      className="block py-1 hover:text-blue-400"
                      onClick={() => setMenuOpen(false)}
                    >
                      {cat.title}
                    </Link>
                  </li>
                ))}
              </ul>
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
