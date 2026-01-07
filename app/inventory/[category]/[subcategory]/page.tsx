import { client } from '@/lib/sanityClient';
import Link from 'next/link';
import imageUrlBuilder from '@sanity/image-url';

interface Machine {
  _id: string;
  name: string;
  brand?: string;
  yearOfMfg?: string;
  stockNumber: string;
  images?: { asset: { _ref: string } }[];
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
  const machines: Machine[] = await client.fetch(
    `*[_type == "machine" && subcategory->slug.current == $subcategory]{
      _id,
      name,
      brand,
      yearOfMfg,
      stockNumber,
      images
    }`,
    { subcategory: params.subcategory }
  );

  if (!machines || machines.length === 0) {
    return <p className="p-6">No machines found for this subcategory.</p>;
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold mb-6">
        {params.subcategory.replace(/-/g, ' ')}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {machines.map((machine) => {
          const imageUrl = machine.images?.[0] ? urlFor(machine.images[0]) : '/placeholder.jpg';
          return (
            <Link
              key={machine._id}
              href={`/inventory/${params.category}/${params.subcategory}/${machine._id}`}
              className="block bg-gray-50 rounded shadow hover:shadow-lg transition overflow-hidden"
            >
              <div className="w-full h-48 relative">
                <img
                  src={imageUrl}
                  alt={machine.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-medium">{machine.name}</h2>
                {machine.yearOfMfg && <p>Year: {machine.yearOfMfg}</p>}
                <p>Stock #: {machine.stockNumber}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
