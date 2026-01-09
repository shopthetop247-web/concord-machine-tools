// app/brands/[brand]/page.tsx
export const revalidate = 60;

import { client } from '@/lib/sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import Link from 'next/link';
import { Metadata } from 'next';

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
  category?: { title: string; slug: { current: string } };
  subcategory?: { title: string; slug: { current: string } };
}

interface PageProps {
  params: {
    brand: string;
  };
}

/* ------------------------------------
   HELPERS
------------------------------------ */
const builder = imageUrlBuilder(client);
const urlFor = (source: any) =>
  builder.image(source).auto('format').fit('crop').url();

const normalizeBrand = (slug: string) =>
  slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

/* ------------------------------------
   SEO METADATA
------------------------------------ */
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const brandName = normalizeBrand(params.brand);

  return {
    title: `Used ${brandName} CNC Machines for Sale`,
    description: `Browse our current inventory of used ${brandName} CNC machines including mills, lathes, and machining centers. View photos, specifications, and request a quote.`,
    alternates: {
      canonical: `/brands/${params.brand}`,
    },
    openGraph: {
      title: `Used ${brandName} CNC Machines`,
      description: `View available used ${brandName} CNC machines for sale.`,
      type: 'website',
    },
  };
}

/* ------------------------------------
   PAGE COMPONENT
------------------------------------ */
export default async function BrandPage({ params }: PageProps) {
  const brandName = normalizeBrand(params.brand);

  const machines: Machine[] = await client.fetch(
    `*[_type == "machine" && brand == $brand]
      | order(yearOfMfg desc){
        _id,
        name,
        brand,
        yearOfMfg,
        stockNumber,
        images[]{ asset-> },
        slug,
        category->{ title, slug },
        subcategory->{ title, slug }
      }`,
    { brand: brandName }
  );

  /* ------------------------------------
     STRUCTURED DATA
  ------------------------------------ */
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Used ${brandName} CNC Machines`,
    itemListElement: machines.map((machine, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: machine.name,
      url: `https://www.concordmachinetools.com/inventory/${machine.category?.slug.current}/${machine.subcategory?.slug.current}/${machine.slug.current}`,
    })),
  };

  /* ------------------------------------
     EMPTY STATE
  ------------------------------------ */
  if (!machines.length) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold mb-4">
          Used {brandName} CNC Machines
        </h1>
        <p className="text-gray-700">
          There are currently no {brandName} machines available. Please check back soon or contact us for sourcing assistance.
        </p>
      </main>
    );
  }

  /* ------------------------------------
     UNIQUE CATEGORY LINKS
  ------------------------------------ */
  const categoryLinks = Array.from(
    new Map(
      machines
        .filter(m => m.category && m.subcategory)
        .map(m => [
          `${m.category?.slug.current}/${m.subcategory?.slug.current}`,
          {
            category: m.category!,
            subcategory: m.subcategory!,
          },
        ])
    ).values()
  );

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <h1 className="text-3xl font-semibold mb-4">
        Used {brandName} CNC Machines for Sale
      </h1>

      <p className="text-gray-700 mb-8 max-w-3xl">
        Concord Machine Tools offers a rotating selection of used {brandName} CNC machines,
        including mills, lathes, and machining centers. All equipment is available for
        inspection and ready for shipment.
      </p>

      {/* Category Jump Links */}
      {categoryLinks.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-medium mb-3">
            Browse {brandName} Machines by Category
          </h2>
          <ul className="flex flex-wrap gap-4">
            {Array.from(categoryLinks).map(({ category, subcategory }) => (
              <li key={`${category.slug.current}-${subcategory.slug.current}`}>
                <Link
                  href={`/inventory/${category.slug.current}/${subcategory.slug.current}`}
                  className="text-blue-600 hover:underline"
                >
                  {subcategory.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Machine Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {machines.map(machine => {
          const imageUrl = machine.images?.[0]
            ? urlFor(machine.images[0])
            : '/placeholder.jpg';

          return (
            <Link
              key={machine._id}
              href={`/inventory/${machine.category?.slug.current}/${machine.subcategory?.slug.current}/${machine.slug.current}`}
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
                <h3 className="text-lg font-medium mb-1">
                  {machine.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {machine.yearOfMfg && <>Year: {machine.yearOfMfg} &nbsp;|&nbsp;</>}
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
