// app/brands/[brand]/page.tsx
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
    brand: string;
  };
}

const builder = imageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source).auto('format').url();

/* ------------------------------------
   SEO METADATA
------------------------------------ */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const brandName = params.brand.replace(/-/g, ' ');

  return {
    title: `${brandName} Machines for Sale | Concord Machine Tools`,
    description: `View our current inventory of ${brandName} metalworking machines, including CNC and industrial equipment.`,
    alternates: {
      canonical: `/brands/${params.brand}`,
    },
    openGraph: {
      title: `${brandName} Machines for Sale`,
      description: `Browse available ${brandName} machines including CNC and industrial equipment.`,
      type: 'website',
    },
  };
}

/* ------------------------------------
   PAGE COMPONENT
------------------------------------ */
export default async function BrandPage({ params }: PageProps) {
  const { brand } = params;

  // Convert slug back to brand name (replace hyphens with spaces, capitalize each word)
  const brandName = brand
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const machines: Machine[] = await client.fetch(
    `*[_type == "machine" && brand == $brandName] | order(yearOfMfg desc, name asc){
      _id,
      name,
      brand,
      yearOfMfg,
      stockNumber,
      images[] {
        asset->
      },
      slug
    }`,
    { brandName }
  );

  /* ------------------------------------
     STRUCTURED DATA (JSON-LD)
  ------------------------------------ */
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${brandName} Machines`,
    itemListElement: machines.map((machine, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: machine.name,
      url: `https://www.concordmachinetools.com/inventory/${machine.slug.current}`,
    })),
  };

  if (!machines.length) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold mb-4">{brandName}</h1>
        <p className="text-gray-700">There are currently no machines listed for this brand.</p>
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

      <h1 className="text-3xl font-semibold mb-6">{brandName}</h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {machines.map((machine) => {
          const imageUrl = machine.images?.[0] ? urlFor(machine.images[0]) : '/placeholder.jpg';
          return (
            <Link
              key={machine._id}
              href={`/inventory/${machine.slug.current}`}
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
                <h2 className="text-lg font-medium mb-1">{machine.name}</h2>
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
