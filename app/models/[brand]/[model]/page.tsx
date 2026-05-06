console.log("MODEL PAGE HIT:", Date.now());
export const dynamic = 'force-dynamic';

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
  str.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const normalize = (str: string) =>
  (str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/* -------------------------
   SEO fallback
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
  const modelName = modelSlug.replace(/-/g, ' ');

  /* =========================================================
     1. MODEL DATA (Sanity model document)
  ========================================================= */
  const modelData = await client.fetch(
    `*[
      _type == "model" &&
      slug.current == $modelSlug &&
      brand->slug.current == $brandSlug
    ][0]{
      title,
      description,
      commonApplications,
      popularIndustries
    }`,
    {
      modelSlug,
      brandSlug,
    }
  );

  /* =========================================================
     2. MACHINES (NOW PROPERLY FILTERED IN GROQ)
  ========================================================= */
  const machines = await client.fetch(
    `*[
      _type == "machine" &&
      defined(slug.current) &&
      defined(modelSlug) &&
      defined(brand)
    ]{
      _id,
      name,
      model,
      modelSlug,
      slug,
      category->{slug},
      subcategory->{slug},
      images[]{asset->},
      yearOfMfg,
      stockNumber,
      brand,
      brandRef->{name, slug}
    }`
  );

  /* =========================================================
     3. STRICT FILTER (NO FUZZY MATCHING)
  ========================================================= */
  const filtered = machines.filter((m: any) => {
    const brandRaw =
      m.brandRef?.slug?.current ||
      m.brandRef?.name ||
      m.brand ||
      '';

    const modelRaw =
      m.modelSlug?.current ||
      m.modelSlug ||
      m.model ||
      '';

    return (
      normalize(brandRaw) === normalize(brandSlug) &&
      normalize(modelRaw) === normalize(modelSlug)
    );
  });

  const safeMachines = filtered.filter(
    (m: any) =>
      m?._id &&
      m?.name &&
      m?.slug?.current &&
      m?.category?.slug?.current &&
      m?.subcategory?.slug?.current
  );

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">

      {/* HEADER */}
      <h1 className="text-3xl font-semibold mb-4">
        Used {brandName} {modelName} CNC Machines for Sale
      </h1>

      {/* SEO DESCRIPTION (TOP) */}
      {modelData?.description && (
        <section
          className="prose max-w-4xl mb-8"
          dangerouslySetInnerHTML={{ __html: modelData.description }}
        />
      )}

      {/* MACHINE GRID */}
      {safeMachines.length === 0 ? (
        <div className="text-gray-600 mb-8">
          <p>No current inventory for this model.</p>
          <p className="mt-2 text-sm text-gray-500">
            This may be a sourcing-only model. Contact us and we can locate one.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">

          {safeMachines.map((machine: any) => {
            const category = machine.category.slug.current;
            const subcategory = machine.subcategory.slug.current;
            const slug = machine.slug.current;

            const imageUrl = machine.images?.[0]
              ? urlFor(machine.images[0])
              : '/placeholder.jpg';

            return (
              <Link
                key={machine._id}
                href={`/inventory/${category}/${subcategory}/${slug}`}
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
                </div>
              </Link>
            );
          })}

        </div>
      )}

      {/* COMMON APPLICATIONS */}
      {modelData?.commonApplications?.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-3">
            Common Applications
          </h2>

          <ul className="list-disc pl-5 text-gray-700">
            {modelData.commonApplications.map((app: string, i: number) => (
              <li key={i}>{app}</li>
            ))}
          </ul>
        </section>
      )}

      {/* INDUSTRIES */}
      {modelData?.popularIndustries?.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-3">
            Industries
          </h2>

          <ul className="list-disc pl-5 text-gray-700">
            {modelData.popularIndustries.map((ind: string, i: number) => (
              <li key={i}>{ind}</li>
            ))}
          </ul>
        </section>
      )}

    </main>
  );
}
