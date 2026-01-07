// app/inventory/[category]/[subcategory]/page.tsx
import { client } from '@/lib/sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import Link from 'next/link';

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

export default async function SubcategoryPage({ params }: PageProps) {
  const { category, subcategory } = params;

  // Fetch machines in this subcategory
  const machines: Machine[] = await client.fetch(
    `*[_type == "machine" && subcategory._ref in *[_type=="subcategory" && slug.current == $slug]._id]{
      _id,
      name,
      brand,
      yearOfMfg,
      stockNumber,
      images,
      slug
    }`,
    { slug: subcategory }
  );

  if (!machines.length) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold mb-6">No Machines Found</h1>
        <p className="text-gray-700">
          There are no machines listed in this subcategory yet.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold mb-6">{subcategory.replace(/-/g, ' ')}</h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {machines.map((machine) => {
          const imageUrl = machine.images?.[0] ? urlFor(machine.images[0]) : '/placeholder.jpg';
          return (
            <Link
              key={machine._id}
              href={`/inventory/${category}/${subcategory}/${machine.slug.current}`}
              className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="w-full h-48 relative">
                <img
                  src={imageUrl}
                  alt={machine.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4 bg-white">
                <h2 className="text-lg font-medium mb-1">{machine.name}</h2>
                <p className="text-gray-600 text-sm">
                  {machine.yearOfMfg && <>Year: {machine.yearOfMfg} &nbsp;|&nbsp; </>}
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
