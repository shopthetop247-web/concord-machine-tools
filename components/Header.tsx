'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { client } from '@/lib/sanityClient';

interface Subcategory {
  _id: string;
  title: string;
  slug: { current: string };
}

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  subcategories?: Subcategory[];
}

export default function Header() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileSubmenus, setOpenMobileSubmenus] = useState<string[]>([]);

  // Fetch categories and nested subcategories from Sanity
  useEffect(() => {
    const fetchCategories = async () => {
      const data: Category[] = await client.fetch(
        `*[_type == "category"]{
          _id,
          title,
          "slug": slug,
          "subcategories": *[_type == "subcategory" && references(^._id)]{
            _id,
            title,
            "slug": slug
          }
        }`
      );
      setCategories(data);
    };
    fetchCategories();
  }, []);

  // Toggle mobile submenus
  const toggleMobileSubmenu = (id: string) => {
    setOpenMobileSubmenus((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          Concord Machine Tools
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <div className="relative group">
            <span className="cursor-pointer font-medium">Inventory</span>

            {/* Dropdown */}
            <div className="absolute left-0 mt-2 w-56 bg-white text-gray-900 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
              {categories.length === 0 ? (
                <div className="p-2 text-gray-500">Loading...</div>
              ) : (
                categories.map((cat) => (
                  <div key={cat._id} className="group relative">
                    <Link
                      href={`/inventory/${cat.slug.current}`}
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      {cat.title}
                    </Link>
                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <div className="absolute top-0 left-full mt-0 ml-1 w-56 bg-white text-gray-900 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub._id}
                            href={`/inventory/${cat.slug.current}/${sub.slug.current}`}
                            className="block px-4 py-2 hover:bg-gray-200"
                          >
                            {sub.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <Link href="/about" className="font-medium hover:underline">
            About
          </Link>
          <Link href="/contact" className="font-medium hover:underline">
            Contact
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Open menu</span>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 text-white px-6 py-4 space-y-2">
          <Link href="/about" className="block py-2">
            About
          </Link>
          <Link href="/contact" className="block py-2">
            Contact
          </Link>

          <span className="block py-2 font-medium">Inventory</span>
          <div className="pl-4 space-y-1">
            {categories.length === 0 ? (
              <div className="text-gray-400">Loading...</div>
            ) : (
              categories.map((cat) => (
                <div key={cat._id}>
                  <button
                    className="w-full text-left py-1 font-medium"
                    onClick={() => toggleMobileSubmenu(cat._id)}
                  >
                    {cat.title}
                  </button>
                  {openMobileSubmenus.includes(cat._id) && cat.subcategories && (
                    <div className="pl-4 space-y-1">
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub._id}
                          href={`/inventory/${cat.slug.current}/${sub.slug.current}`}
                          className="block py-1 hover:underline"
                        >
                          {sub.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </header>
  );
}
