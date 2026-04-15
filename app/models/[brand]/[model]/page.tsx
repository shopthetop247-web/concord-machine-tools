import { client } from '@/lib/sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import Link from 'next/link';
import { Metadata } from 'next';

interface PageProps {
  params: {
    brand: string;
    model: string;
  };
}

const builder = imageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source).auto('format').url();

const normalize = (str: string) =>
  str?.toLowerCase().replace(/\s+/g, '-').trim();

/* -------------------------
   SEO
-------------------------- */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const brand = params.brand.replace(/-/g, ' ');
  const model = params.model.replace(/-/g, ' ');

  return {
    title: `Used ${brand} ${model} CNC Machines for Sale`,
    description: `Browse available used ${brand} ${model} CNC machines in stock with photos, pricing, and details.`,
  };
}

/* -------------------------
   PAGE
-------------------------- */
export default async function ModelPage({ params }: PageProps) {
  const brandName = params.brand.replace(/-/g, ' ');
  const modelSlug = params.model;

  const machines = await client.fetch(
    `*[
      _type == "machine" &&
      lower(brand) == lower($brand)
    ]{
      _id,
      name,
      model,
      slug,
      category->{slug},
      subcategory->{slug},
      images[]{asset->},
      yearOfMfg,
      stockNumber
    }`,
    { brand: brandName }
  );

  // FILTER BY MODEL FIELD
  const filtered = machines.filter((m: any) => {
    if (!m.model) return false;
    return normalize(m.model) === modelSlug;
  });

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">

      <h1 className="text-3xl font-semibold mb-6">
        Used {brandName} {modelSlug.replace(/-/g, ' ')} CNC Machines for Sale
      </h1>

      {filtered.length === 0 ? (
        <p className="text-gray-600">
          No current inventory for this model.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">

          {filtered.map((machine: any) => {
            const category = machine.category?.slug?.current;
            const subcategory = machine.subcategory?.slug?.current;

            const imageUrl = machine.images?.[0]
              ? urlFor(machine.images[0])
              : '/placeholder.jpg';

            return (
              <Link
                key={machine._id}
                href={`/inventory/${category}/${subcategory}/${machine.slug.current}`}
                className="block border rounded-lg overflow-hidden hover:shadow-lg transition"
              >

                {/* IMAGE */}
                <div className="h-48 w-full">
                  <img
                    src={imageUrl}
                    alt={machine.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* TEXT */}
                <div className="p-4">
                  <h2 className="font-medium">{machine.name}</h2>
                  <p className="text-sm text-gray-500">
                    {machine.yearOfMfg} | {machine.stockNumber}
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
