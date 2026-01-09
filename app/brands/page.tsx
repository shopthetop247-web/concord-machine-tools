// app/brands/page.tsx
export const revalidate = 60;

import { client } from '@/lib/sanityClient';
import Link from 'next/link';
import { Metadata } from 'next';

interface Brand {
  name: string;
  slug: string;
  count: number;
}

export const metadata: Metadata = {
  title: 'Brands | Concord Machine Tools',
  description: 'Browse all machine brands available at Concord Machine Tools.',
};

/* ------------------------------------
   PAGE COMPONENT
------------------------------------ */
export default async function BrandsPage() {
  // Fetch distinct brands and count of machines per brand
  const brands: Brand[] = await client.fetch(
    `*[_type == "machine" && defined(brand)]
      {
        "name": brand,
      }`
  );

  // Count machines per brand
  const brandMap: Record<string, number> = {};
  brands.forEach((b) => {
    const key = b.name;
    brandMap[key] = (brandMap[key] || 0) + 1;
  });

  // Build unique brand array with slugs
  const uniqueBrands: Brand[] = Object.keys(brandMap)
    .sort()
    .map((name) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'), // convert spaces to hyphens
      count: brandMap[name],
    }));

  if (!uniqueBrands.length) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold mb-4">Brands</h1>
        <p className="text-gray-700">No brands available at this time.</p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold mb-6">Brands</h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {uniqueBrands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/brands/${brand.slug}`}
            className="block border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white text-center"
          >
            <h2 className="text-lg font-medium mb-1 capitalize">{brand.name}</h2>
            <p className="text-sm text-gray-600">{brand.count} machines</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
