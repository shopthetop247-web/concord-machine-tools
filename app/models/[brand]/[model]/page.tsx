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

/* -------------------------
   HELPERS
-------------------------- */
const formatBrand = (str: string) =>
  str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

/* -------------------------
   SEO
-------------------------- */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const brandName = formatBrand(params.brand);
  const modelName = params.model.replace(/-/g, ' ');

  return {
    title: `Used ${brandName} ${modelName} CNC Machines for Sale`,
    description: `Browse available used ${brandName} ${modelName} machines in stock with photos, pricing, and details.`,
  };
}

/* -------------------------
   PAGE
-------------------------- */
export default async function ModelPage({ params }: PageProps) {
  const brandSlug = params.brand;
  const modelSlug = params.model;

  const brandName = formatBrand(brandSlug);

  /**
   * ✅ FULLY GROQ-BASED FILTERING
   * No JS filtering anymore
   */
  const machines = await client.fetch(
    `*[
      _type == "machine" &&
      lower(brand) match $brand &&
      modelSlug == $modelSlug
    ]{
      _id,
      name,
      model,
      modelSlug,
      modelDisplay,
      slug,
      category->{slug},
      subcategory->{slug},
      images[]{asset->},
      yearOfMfg,
      stockNumber
    } | order(yearOfMfg desc)`,
    {
      brand: `*${brandSlug}*`,
      modelSlug: modelSlug
    }
  );

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">

      <h1 className="text-3xl font-semibold mb-6">
        Used {brandName} {modelSlug.replace(/-/g, ' ')} CNC Machines for Sale
      </h1>

      {/* EMPTY STATE */}
      {machines.length === 0 ? (
        <div className="text-gray-600">
          <p>No current inventory for this model.</p>

          <p className="mt-2 text-sm text-gray-500">
            This may be a sourcing-only model. Contact us and we can locate one.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">

          {machines.map((machine: any) => {
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

                <div className="h-48 w-full">
                  <img
                    src={imageUrl}
                    alt={machine.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <h2 className="font-medium">{machine.name}</h2>

                  <p className="text-sm text-gray-500">
                    {machine.yearOfMfg} | {machine.stockNumber}
                  </p>

                  {machine.modelDisplay && (
                    <p className="text-xs text-gray-400 mt-1">
                      Model: {machine.modelDisplay}
                    </p>
                  )}
                </div>

              </Link>
            );
          })}

        </div>
      )}

    </main>
  );
}
