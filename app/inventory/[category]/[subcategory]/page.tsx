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
}

const builder = imageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source).auto('format').url();

/* ------------------------------------
   SEO METADATA
------------------------------------ */
function formatSubcategory(slug: string) {
  return slug
    .replace(/-/g, ' ')
    .replace(/\bcnc\b/gi, 'CNC')
    .replace(/\bvmc\b/gi, 'VMC')
    .replace(/\bedm\b/gi, 'EDM')
    .replace(/\bhmc\b/gi, 'HMC');
;
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const subcategoryName = formatSubcategory(params.subcategory);


  return {
    title: `${subcategoryName} for Sale | Used Industrial Machinery`,
    description: `Browse available ${subcategoryName} machines including CNC and industrial equipment. View specifications, photos, and request a quote.`,
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
export default async function SubcategoryPage({ params }: PageProps) {
  const { category, subcategory } = params;

  const machines: Machine[] = await client.fetch(
    `*[_type == "machine" && subcategory._ref in *[_type=="subcategory" && slug.current == $slug]._id
    ]
    | order(yearOfMfg desc, brand asc){
      _id,
      name,
      brand,
      yearOfMfg,
      stockNumber,
      images[]{
      asset->
      },
      slug
    }`,
    { slug: subcategory }
  );

  /* ------------------------------------
     STRUCTURED DATA (JSON-LD)
  ------------------------------------ */
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${formatSubcategory(subcategory)} Machines`,
    itemListElement: machines.map((machine, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: machine.name,
      url: `https://www.concordmachinetools.com/inventory/${category}/${subcategory}/${machine.slug.current}`,
    })),
  };

  if (!machines.length) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold mb-4">
        {formatSubcategory(subcategory)}
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

      <h1 className="text-3xl font-semibold mb-6">
      {formatSubcategory(subcategory)}
      </h1>


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

