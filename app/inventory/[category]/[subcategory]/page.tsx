// app/inventory/[category]/[subcategory]/page.tsx
export const revalidate = 60;

import { client } from '@/lib/sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import Link from 'next/link';
import { Metadata } from 'next';

interface Machine {
  _id: string;
  name: string;
  brand?: string;
  yearOfMfg?: number;
  stockNumber: string;
  images?: { asset: { _ref: string } }[];
  slug: { current: string };
}

interface PageProps {
  params: {
    category: string;
    subcategory: string;
  };
  searchParams?: {
    brand?: string;
    year?: string;
  };
}

const builder = imageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source).auto('format').url();

/* ------------------------------------
   YEAR BUCKET DEFINITIONS
------------------------------------ */
const YEAR_BUCKETS = {
  '2020+': (year?: number) => year && year >= 2020,
  '2015-2019': (year?: number) => year && year >= 2015 && year <= 2019,
  '2010-2014': (year?: number) => year && year >= 2010 && year <= 2014,
  'Pre-2010': (year?: number) => year && year < 2010,
};

/* ------------------------------------
   SEO METADATA
------------------------------------ */
export async function generateMetadata(
  { params }: { params: PageProps['params'] }
): Promise<Metadata> {
  const subcategoryName = params.subcategory.replace(/-/g, ' ');

  return {
    title: `${subcategoryName} for Sale | Used Industrial Machinery`,
    description: `Browse available ${subcategoryName} machines. Filter by brand and year. View specs, photos, and request a quote.`,
    alternates: {
      canonical: `/inventory/${params.category}/${params.subcategory}`,
    },
    openGraph: {
      title: `${subcategoryName} for Sale`,
      description: `View our current inventory of ${subcategoryName} machines.`,
      type: 'website',
    },
  };
}

/* ------------------------------------
   PAGE COMPONENT
------------------------------------ */
export default async function SubcategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { category, subcategory } = params;

  const selectedBrands = searchParams?.brand
    ? searchParams.brand.split(',')
    : [];

  const selectedYearBucket = searchParams?.year;

  const machines: Machine[] = await client.fetch(
    `*[_type == "machine" && subcategory._ref in *[_type=="subcategory" && slug.current == $slug]]
     | order(yearOfMfg desc, brand asc){
        _id,
        name,
        brand,
        yearOfMfg,
        stockNumber,
        images[]{ asset-> },
        slug
     }`,
    { slug: subcategory }
  );

  /* ------------------------------------
     FILTERED MACHINES
  ------------------------------------ */
  const filteredMachines = machines.filter((machine) => {
    const brandMatch =
      !selectedBrands.length ||
      (machine.brand && selectedBrands.includes(machine.brand));

    const yearMatch =
      !selectedYearBucket ||
      YEAR_BUCKETS[selectedYearBucket as keyof typeof YEAR_BUCKETS]?.(
        machine.yearOfMfg
      );

    return brandMatch && yearMatch;
  });

  /* ------------------------------------
     AVAILABLE FILTER VALUES
  ------------------------------------ */
  const availableBrands = Array.from(
    new Set(machines.map((m) => m.brand).filter(Boolean))
  ).sort();

  /* ------------------------------------
     STRUCTURED DATA
  ------------------------------------ */
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${subcategory.replace(/-/g, ' ')} Machines`,
    itemListElement: filteredMachines.map((machine, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: machine.name,
      url: `https://www.concordmachinetools.com/inventory/${category}/${subcategory}/${machine.slug.current}`,
    })),
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <h1 className="text-3xl font-semibold mb-6 capitalize">
        {subcategory.replace(/-/g, ' ')}
      </h1>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 text-sm">
        {/* Brand Filters */}
        <div>
          <span className="font-medium mr-2">Brand:</span>
          {availableBrands.map((brand) => {
            const active = selectedBrands.includes(brand!);
            const nextBrands = active
              ? selectedBrands.filter((b) => b !== brand)
              : [...selectedBrands, brand];

            const params = new URLSearchParams();
            if (nextBrands.length) params.set('brand', nextBrands.join(','));
            if (selectedYearBucket) params.set('year', selectedYearBucket);

            return (
              <Link
                key={brand}
                href={`?${params.toString()}`}
                className={`mr-3 ${
                  active ? 'font-semibold underline' : 'text-blue-600'
                }`}
              >
                {brand}
              </Link>
            );
          })}
        </div>

        {/* Year Filters */}
        <div>
          <span className="font-medium mr-2">Year:</span>
          {Object.keys(YEAR_BUCKETS).map((bucket) => {
            const params = new URLSearchParams();
            if (selectedBrands.length)
              params.set('brand', selectedBrands.join(','));
            params.set('year', bucket);

            return (
              <Link
                key={bucket}
                href={`?${params.toString()}`}
                className={`mr-3 ${
                  selectedYearBucket === bucket
                    ? 'font-semibold underline'
                    : 'text-blue-600'
                }`}
              >
                {bucket}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {filteredMachines.length === 0 ? (
        <p className="text-gray-700">
          No machines match the selected filters.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredMachines.map((machine) => {
            const imageUrl = machine.images?.[0]
              ? urlFor(machine.images[0])
              : '/placeholder.jpg';

            return (
              <Link
                key={machine._id}
                href={`/inventory/${category}/${subcategory}/${machine.slug.current}`}
                className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="w-full h-48">
                  <img
                    src={imageUrl}
                    alt={`${machine.name} for sale`}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4 bg-white">
                  <h2 className="text-lg font-medium mb-1">
                    {machine.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {machine.yearOfMfg && (
                      <>Year: {machine.yearOfMfg} &nbsp;|&nbsp;</>
                    )}
                    Stock #: {machine.stockNumber}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
