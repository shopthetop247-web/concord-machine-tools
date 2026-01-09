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
  count: number;
}

export default async function BrandsIndexPage() {
  // Fetch all distinct brands
  const brandsData: { brand: string }[] = await client.fetch(
    `*[_type == "machine" && defined(brand)]{
      "brand": brand
    }`
  );

  // Deduplicate brands
  const uniqueBrands = Array.from(new Set(brandsData.map(b => b.brand)));

  // Create slug & count
  const brands: Brand[] = await Promise.all(
    uniqueBrands.map(async (brand) => {
      const slug = brand.toLowerCase().replace(/\s+/g, '-'); // generate slug in JS
      const count: number = await client.fetch(
        `count(*[_type=="machine" && brand == $brand])`,
        { brand }
      );
      return { name: brand, slug, count };
    })
  );

  // Sort alphabetically
  brands.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-8">Browse Machines by Brand</h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {brands.map((brand) => (
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
