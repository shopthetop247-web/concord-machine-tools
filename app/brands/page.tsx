// app/brands/page.tsx
export const revalidate = 60;

import { client } from '@/lib/sanityClient';
import Link from 'next/link';
import { Metadata } from 'next';

/* ------------------------------------
   SEO METADATA
------------------------------------ */
export const metadata: Metadata = {
  title: 'Machine Brands We Carry | Concord Machine Tools',
  description:
    'Browse used CNC and industrial machines by brand including Haas, Mazak, DMG Mori, Okuma, and more. View available inventory by manufacturer.',
  alternates: {
    canonical: '/brands',
  },
  openGraph: {
    title: 'Machine Brands | Concord Machine Tools',
    description:
      'Explore our inventory of used CNC machines by brand. Trusted manufacturers, ready for immediate delivery.',
    type: 'website',
  },
};

/* ------------------------------------
   PAGE COMPONENT
------------------------------------ */
export default async function BrandsIndexPage() {
  const brands: string[] = await client.fetch(`
    array::unique(
      *[_type == "machine" && defined(brand)].brand
    ) | order(@ asc)
  `);

  /* ------------------------------------
     STRUCTURED DATA (JSON-LD)
  ------------------------------------ */
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Machine Brands',
    itemListElement: brands.map((brand, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: brand,
      url: `https://www.concordmachinetools.com/brands/${brand
        .toLowerCase()
        .replace(/\s+/g, '-')}`,
    })),
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <h1 className="text-3xl font-semibold mb-4">
        Machine Brands We Carry
      </h1>

      <p className="text-gray-700 mb-8 max-w-3xl">
        Browse our available inventory by manufacturer. We stock a wide range of
        used CNC and industrial machines from trusted brands known for precision,
        reliability, and performance.
      </p>

      {brands.length === 0 ? (
        <p className="text-gray-600">
          No brands are currently available.
        </p>
      ) : (
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {brands.map((brand) => {
            const slug = brand.toLowerCase().replace(/\s+/g, '-');

            return (
              <li key={brand}>
                <Link
                  href={`/brands/${slug}`}
                  className="block border rounded-lg px-4 py-3 bg-white hover:shadow-md transition-shadow"
                >
                  <span className="text-lg font-medium">{brand}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
