// app/brands/page.tsx
import { client } from '@/lib/sanityClient';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brands | Concord Machine Tools',
  description: 'Browse used CNC and metalworking machines by brand, including Haas, Mazak, DMG Mori, and more.',
  alternates: {
    canonical: '/brands',
  },
};

interface Brand {
  name: string;
  slug: string;
  count: number; // optional: number of machines
}

export default async function BrandsIndexPage() {
  // Fetch all distinct brands from your machines collection
  const brands: Brand[] = await client.fetch(
    `*[_type == "machine" && defined(brand)]{
      "name": brand,
      "slug": coalesce(lower(replace(brand, " ", "-")), "unknown")
    } | order(name asc)`
  );

  // Count machines per brand
  const brandsWithCount = await Promise.all(
    brands.map(async (brand) => {
      const count: number = await client.fetch(
        `count(*[_type=="machine" && brand == $brand])`,
        { brand: brand.name }
      );
      return { ...brand, count };
    })
  );

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-8">Browse Machines by Brand</h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {brandsWithCount.map((brand) => (
          <Link
            key={brand.slug}
            href={`/brands/${brand.slug}`}
            className="block border rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-medium mb-2">{brand.name}</h2>
            <p className="text-sm text-gray-600">
              {brand.count} {brand.count === 1 ? 'machine' : 'machines'}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
