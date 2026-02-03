// app/inventory/[category]/[subcategory]/page.tsx
export const revalidate = 60;

import { client } from '@/lib/sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import Link from 'next/link';
import { Metadata } from 'next';

/* ------------------------------------
   METADATA
------------------------------------ */
export async function generateMetadata({
  params,
}: {
  params: { category: string; subcategory: string };
}): Promise<Metadata> {
  const { category, subcategory } = params;

  const data = await client.fetch(
    `
    {
      "category": *[_type == "category" && slug.current == $category][0]{ name },
      "subcategory": *[_type == "subcategory" && slug.current == $subcategory][0]{ name }
    }
    `,
    { category, subcategory }
  );

  if (!data?.category || !data?.subcategory) {
    return {
      title: 'Used CNC Machines for Sale | Concord Machine Tools',
    };
  }

  return {
    title: `Used ${data.subcategory.name} for Sale | ${data.category.name}`,
    description: `Browse used ${data.subcategory.name.toLowerCase()} for sale from top manufacturers. Inventory updated frequently.`,
    alternates: {
      canonical: `https://www.concordmt.com/inventory/${category}/${subcategory}`,
    },
  };
}

/* ------------------------------------
   TYPES
------------------------------------ */
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
}

/* ------------------------------------
   HELPERS
------------------------------------ */
const builder = imageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source).auto('format').url();

function formatSubcategory(slug: string) {
  return slug
    .replace(/-/g, ' ')
    .replace(/\bcnc\b/gi, 'CNC')
    .replace(/\bvmc\b/gi, 'VMC')
    .replace(/\bedm\b/gi, 'EDM')
    .replace(/\bhmc\b/gi, 'HMC');
}

/* ------------------------------------
   PAGE COMPONENT
------------------------------------ */
export default async function SubcategoryPage({ params }: PageProps) {
  const { category, subcategory } = params;
  const formattedSubcategory = formatSubcategory(subcategory);

  const machines: Machine[] = await client.fetch(
    `*[_type == "machine" && subcategory._ref in *[_type=="subcategory" && slug.current == $slug]._id]
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
     MANUFACTURER LIST (SEO)
  ------------------------------------ */
  const manufacturers = Array.from(
    new Set(
      machines
        .map((m) => m.brand)
        .filter((brand): brand is string => Boolean(brand))
    )
  ).sort();

  /* ------------------------------------
     STRUCTURED DATA (JSON-LD)
  ------------------------------------ */
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${formattedSubcategory} Machines`,
    description: `Browse used ${formattedSubcategory} machines for sale from top manufacturers.`,
    url: `https://www.concordmt.com/inventory/${category}/${subcategory}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      numberOfItems: machines.length,
      itemListElement: machines.map((machine, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: machine.name,
        url: `https://www.concordmt.com/inventory/${category}/${subcategory}/${machine.slug.current}`,
      })),
    },
  };

  if (!machines.length) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold mb-4">
          {formattedSubcategory}
        </h1>
        <p className="text-gray-700">
          There are currently no machines listed in this category.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <h1 className="text-3xl font-semibold mb-4">
        {formattedSubcategory}
      </h1>

      {/* SEO INTRO CONTENT */}
      <div className="max-w-4xl mb-8 text-gray-700 leading-relaxed">

        <p>
          Browse our current inventory of used {formattedSubcategory} machines
          for sale. Concord Machine Tools offers high-quality pre-owned
          industrial equipment sourced from trusted manufacturers and
          maintained to meet demanding production standards.
        </p>

        {manufacturers.length > 0 && (
          <p className="mt-3">
            Our selection includes machines from manufacturers such as{' '}
            <strong>{manufacturers.join(', ')}</strong>. Inventory is updated
            frequently, so check back often or contact us for availability.
          </p>
        )}
      </div>

      {/* MACHINE GRID */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {machines.map((machine) => {
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
    </main>
  );
}
