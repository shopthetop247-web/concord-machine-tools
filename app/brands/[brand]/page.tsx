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
  subcategory: { title: string; slug: { current: string } };
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
    description: `Browse all ${brandName} machines including CNC and industrial equipment. View specifications, photos, and request a quote.`,
    alternates: {
      canonical: `/brands/${params.brand}`,
    },
    openGraph: {
      title: `${brandName} Machines`,
      description: `View our current inventory of ${brandName} machines.`,
      type: 'website',
    },
  };
}

/* ------------------------------------
   PAGE COMPONENT
------------------------------------ */
export default async function BrandPage({ params }: PageProps) {
  const { brand } = params;
  const brandName = brand.replace(/-/g, ' ');

  // Fetch all machines for this brand, including their subcategory info
  const machines: Machine[] = await client.fetch(
    `*[_type=="machine" && brand match $brand]{
      _id,
      name,
      brand,
      yearOfMfg,
      stockNumber,
      images[] {
        asset->
      },
      slug,
      subcategory->{title, slug}
    } | order(subcategory->title asc, yearOfMfg desc)`,
    { brand: brandName }
  );

  // Group machines by subcategory
  const grouped: Record<string, Machine[]> = {};
  machines.forEach((m) => {
    const key = m.subcategory?.title || 'Other';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(m);
  });

  if (!machines.length) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold mb-4 capitalize">{brandName}</h1>
        <p className="text-gray-700">No machines found for this brand.</p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold mb-6 capitalize">{brandName}</h1>

      {Object.entries(grouped).map(([subcategory, machines]) => (
        <section key={subcategory} className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">{subcategory}</h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {machines.map((machine) => {
              const imageUrl = machine.images?.[0]
                ? urlFor(machine.images[0])
                : '/placeholder.jpg';

              return (
                <Link
                  key={machine._id}
                  href={`/inventory/${machine.subcategory?.slug.current || 'other'}/${machine.slug.current}`}
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
                    <h3 className="text-lg font-medium mb-1">{machine.name}</h3>
                    <p className="text-sm text-gray-600">
                      {machine.yearOfMfg && <>Year: {machine.yearOfMfg} &nbsp;|&nbsp;</>}
                      Stock #: {machine.stockNumber}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: `${brandName} Machines`,
            itemListElement: machines.map((machine, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: machine.name,
              url: `https://www.concordmachinetools.com/inventory/${machine.subcategory?.slug.current || 'other'}/${machine.slug.current}`,
            })),
          }),
        }}
      />
    </main>
  );
}
