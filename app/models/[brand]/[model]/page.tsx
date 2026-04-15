import { client } from '@/lib/sanityClient';
import Link from 'next/link';
import { Metadata } from 'next';

interface PageProps {
  params: {
    brand: string;
    model: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const brand = params.brand.replace(/-/g, ' ');
  const model = params.model.replace(/-/g, ' ');

  return {
    title: `Used ${brand} ${model} CNC Machines for Sale`,
    description: `Browse available used ${brand} ${model} CNC machines in stock.`,
  };
}

export default async function ModelPage({ params }: PageProps) {
  const brandName = params.brand.replace(/-/g, ' ');
  const modelName = params.model.replace(/-/g, ' ');

  const machines = await client.fetch(
    `*[
      _type == "machine" &&
      lower(brand) == lower($brand)
    ]{
      _id,
      name,
      slug,
      category->{slug},
      subcategory->{slug},
      images[]{asset->},
      yearOfMfg,
      stockNumber
    }`,
    { brand: brandName }
  );

  const filtered = machines.filter((m: any) =>
    m.name?.toLowerCase().includes(modelName.toLowerCase())
  );

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">

      <h1 className="text-3xl font-semibold mb-6">
        Used {brandName} {modelName} CNC Machines for Sale
      </h1>

      {filtered.length === 0 ? (
        <p className="text-gray-600">
          No current inventory for this model.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((machine: any) => (
            <Link
              key={machine._id}
              href={`/inventory/${machine.category.slug.current}/${machine.subcategory.slug.current}/${machine.slug.current}`}
              className="border rounded-lg p-4 hover:shadow-md"
            >
              <h2 className="font-medium">{machine.name}</h2>
              <p className="text-sm text-gray-500">
                {machine.yearOfMfg} | {machine.stockNumber}
              </p>
            </Link>
          ))}
        </div>
      )}

    </main>
  );
}
