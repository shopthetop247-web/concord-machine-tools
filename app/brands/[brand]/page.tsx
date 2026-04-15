// app/brands/[brand]/page.tsx
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
  images?: { asset: { _ref: string } }[];
  slug: { current: string };
  category: { slug: { current: string } };
  subcategory: { slug: { current: string } };
}

interface Brand {
  name: string;
  description?: string;
  website?: string;
  slug: string;
}

interface PageProps {
  params: {
    brand: string;
  };
}

const builder = imageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source).auto('format').url();

/* ------------------------------------
   FALLBACK SEO CONTENT
------------------------------------ */
const brandContentMap: Record<string, string> = {
  haas: `
<h2>Used Haas CNC Machines for Sale</h2>
<p>Haas CNC machines are widely used across North America for their reliability and affordability.</p>
<h3>Popular Models</h3>
<p>VF Series, ST Lathes, UMC 5-axis, EC Horizontal machining centers.</p>
<h3>Why Buy Used Haas</h3>
<p>Strong support network, low cost of ownership, and wide availability of parts.</p>
`,

  mazak: `
<h2>Used Mazak CNC Machines for Sale</h2>
<p>Mazak is a leader in advanced CNC machining and multi-tasking systems.</p>
<h3>Popular Models</h3>
<p>VCN, Quick Turn, Integrex multi-tasking machines.</p>
`,

  hurco: `
<h2>Used Hurco CNC Machines for Sale</h2>
<p>Hurco machines are known for intuitive controls and fast programming.</p>
`,

  makino: `
<h2>Used Makino CNC Machines for Sale</h2>
<p>Makino delivers high-precision machining for aerospace and mold applications.</p>
`,

  doosan: `
<h2>Used DN Solutions CNC Machines for Sale</h2>
<p>Reliable and cost-effective CNC machining solutions used worldwide.</p>
`,

  okuma: `
<h2>Used Okuma CNC Machines for Sale</h2>
<p>Known for durability, integrated controls, and long-term performance.</p>
`,
};

/* ------------------------------------
   METADATA
------------------------------------ */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const brandName = params.brand.replace(/-/g, ' ');
  const formattedBrand =
    brandName.charAt(0).toUpperCase() + brandName.slice(1);

  return {
    title: `Used ${formattedBrand} CNC Machines for Sale | Concord Machine Tools`,
    description: `Browse used ${formattedBrand} CNC machines including machining centers and lathes.`,
  };
}

/* ------------------------------------
   PAGE COMPONENT
------------------------------------ */
export default async function BrandPage({ params }: PageProps) {
  const brandSlug = params.brand;

  const brand = await client.fetch(
    `*[_type == "brand" && slug.current == $slug][0]{
      name,
      description,
      website
    }`,
    { slug: brandSlug }
  );

  const brandName = brand?.name || brandSlug.replace(/-/g, ' ');
  const formattedBrand =
    brandName.charAt(0).toUpperCase() + brandName.slice(1);

  /* ----------------------------
     GET MACHINES
  ---------------------------- */
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
     FULL MODEL LIST (REAL SOURCE)
  ---------------------------- */
  const modelData: { model?: string }[] = await client.fetch(
    `*[
      _type == "machine" &&
      lower(brand) == lower($brand) &&
      defined(model)
    ]{
      model
    }`,
    { brand: brandName }
  );

  const modelSet = new Set<string>();
  modelData.forEach((m) => {
    if (m.model) modelSet.add(m.model);
  });

  const models = Array.from(modelSet).sort();

  /* ----------------------------
     BUILD MODEL IMAGE CARDS
  ---------------------------- */
  const modelCards = Array.from(
    new Map(
      machines
        .filter((m) => m.model)
        .map((m) => [m.model, m])
    ).values()
  );

  const content = brand?.description || brandContentMap[brandSlug.toLowerCase()];

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">

      {/* HEADER */}
      <h1 className="text-3xl font-semibold mb-2">
        Used {formattedBrand} CNC Machines for Sale
      </h1>

      {/* WEBSITE */}
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

      {/* =========================
          MODEL GRID (WITH IMAGES)
      ========================= */}
      {modelCards.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">
            Browse by Model
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {modelCards.map((machine: any) => {
              const model = machine.model;
              const slug = model.toLowerCase().replace(/\s+/g, '-');

              const imageUrl = machine.images?.[0]
                ? urlFor(machine.images[0])
                : '/placeholder.jpg';

              return (
                <Link
                  key={model}
                  href={`/models/${brandSlug}/${slug}`}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition"
                >
                  <div className="h-40 w-full">
                    <img
                      src={imageUrl}
                      className="h-full w-full object-cover"
                      alt={model}
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium">{model}</h3>
                    <p className="text-sm text-gray-500">
                      View available inventory
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================
          MACHINES GRID
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
              <img src={imageUrl} className="h-48 w-full object-cover" />
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

      {/* SEO CONTENT */}
      {content && (
        <section className="max-w-4xl prose text-gray-700">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </section>
      )}

    </main>
  );
}

    </main>
  );
}
