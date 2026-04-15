export const revalidate = 60;

import { client } from '@/lib/sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import Link from 'next/link';
import { Metadata } from 'next';

interface Machine {
  _id: string;
  name: string;
  model?: string;
  brand?: string;
  yearOfMfg?: number;
  stockNumber: string;
  images?: any[];
  slug: { current: string };
  category: { slug: { current: string } };
  subcategory: { slug: { current: string } };
}

const builder = imageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source).auto('format').url();

const slugify = (str: string) =>
  str?.toLowerCase().replace(/\s+/g, '-').trim();

/* ------------------------------------
   FALLBACK SEO CONTENT (BRAND LEVEL ONLY)
------------------------------------ */
const brandContentMap: Record<string, string> = {
  haas: `<h2>Used Haas CNC Machines for Sale</h2><p>Browse available Haas CNC machines including vertical machining centers, lathes, and automation-ready systems.</p>`,
  mazak: `<h2>Used Mazak CNC Machines for Sale</h2><p>Explore Mazak multi-tasking machines, turning centers, and machining solutions.</p>`,
  hurco: `<h2>Used Hurco CNC Machines for Sale</h2><p>Hurco CNC machines known for conversational programming and ease of use.</p>`,
  makino: `<h2>Used Makino CNC Machines for Sale</h2><p>High-precision Makino machining centers for mold and aerospace applications.</p>`,
  doosan: `<h2>Used DN Solutions CNC Machines for Sale</h2><p>Reliable and cost-effective CNC turning and milling solutions.</p>`,
  okuma: `<h2>Used Okuma CNC Machines for Sale</h2><p>Durable and high-performance CNC machines with integrated control systems.</p>`,
};

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const brandName = params.brand.replace(/-/g, ' ');
  const formattedBrand =
    brandName.charAt(0).toUpperCase() + brandName.slice(1);

  return {
    title: `Used ${formattedBrand} CNC Machines for Sale | Concord Machine Tools`,
    description: `Browse used ${formattedBrand} CNC machines including machining centers, lathes, and production equipment.`,
  };
}

export default async function BrandPage({ params }: any) {
  const brandSlug = params.brand;

  const brand = await client.fetch(
    `*[_type == "brand" && slug.current == $slug][0]{name, description, website}`,
    { slug: brandSlug }
  );

  const brandName = brand?.name || brandSlug.replace(/-/g, ' ');
  const formattedBrand =
    brandName.charAt(0).toUpperCase() + brandName.slice(1);

  const machines: Machine[] = await client.fetch(
    `*[
      _type == "machine" &&
      lower(brand) == lower($brand)
    ]{
      _id,
      name,
      model,
      brand,
      yearOfMfg,
      stockNumber,
      images[]{asset->},
      slug,
      category->{slug},
      subcategory->{slug}
    }`,
    { brand: brandName }
  );

  /* ----------------------------
     UNIQUE MODEL LIST (TEXT ONLY)
  ---------------------------- */
  const modelSet = new Set<string>();

  machines.forEach((m) => {
    if (m.model) modelSet.add(m.model);
  });

  const models = Array.from(modelSet).sort();

  const content =
    brand?.description || brandContentMap[brandSlug.toLowerCase()];

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">

      {/* HEADER */}
      <h1 className="text-3xl font-semibold mb-2">
        Used {formattedBrand} CNC Machines for Sale
      </h1>

      {/* OPTIONAL BRAND WEBSITE */}
      {brand?.website && (
        <a
          href={brand.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline block mb-6"
        >
          Visit official {formattedBrand} website →
        </a>
      )}

      {/* OPTIONAL INTRO (GENERIC ONLY) */}
      <p className="text-gray-600 mb-8 max-w-3xl">
        Browse available used {formattedBrand} CNC machines. Select a model to
        view current inventory and machine details.
      </p>

      {/* =========================
          MODEL LINKS (TEXT ONLY)
      ========================= */}
      {models.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">
            Browse by Model
          </h2>

          <div className="flex flex-wrap gap-2">
            {models.map((model) => {
              const slug = slugify(model);

              return (
                <Link
                  key={model}
                  href={`/models/${brandSlug}/${slug}`}
                  className="px-3 py-1 border rounded-full text-sm hover:bg-black hover:text-white transition"
                >
                  {model}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================
          MACHINE GRID (WITH IMAGES)
      ========================= */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {machines.map((machine) => {
          const imageUrl = machine.images?.[0]
            ? urlFor(machine.images[0])
            : '/placeholder.jpg';

          return (
            <Link
              key={machine._id}
              href={`/inventory/${machine.category.slug.current}/${machine.subcategory.slug.current}/${machine.slug.current}`}
              className="block border rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={imageUrl}
                className="h-48 w-full object-cover"
                alt={machine.name}
              />

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

      {/* SEO CONTENT (BRAND ONLY) */}
      {content && (
        <section className="max-w-4xl prose text-gray-700">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </section>
      )}

    </main>
  );
}
