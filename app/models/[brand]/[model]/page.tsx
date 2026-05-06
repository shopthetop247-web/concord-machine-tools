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

const normalize = (str: string) =>
  str
    ?.toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

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

  const brandNorm = normalize(brandSlug);
  const modelNorm = normalize(modelSlug);

  const brandName = formatBrand(brandSlug);

  /* =========================================================
     MODEL DATA (SEO CONTENT)
  ========================================================= */
  const modelData = await client.fetch(
    `*[_type == "model" && slug.current == $model][0]{
      name,
      seoDescription,
      commonApplications,
      industries
    }`,
    { model: modelSlug }
  );

  console.log('modelData:', modelData);

  /* =========================================================
     MACHINES
  ========================================================= */
  const machines = await client.fetch(
    `*[_type == "machine"]{
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
      stockNumber,
      brand,
      brandRef->{name, slug}
    }`
  );

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
      normalize(brandRaw) === brandNorm &&
      normalize(modelRaw) === modelNorm
    );
  });

  const safeMachines = filtered.filter((m: any) =>
    m?._id &&
    m?.name &&
    m?.slug?.current &&
    m?.category?.slug?.current &&
    m?.subcategory?.slug?.current
  );

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">

      {/* =========================
          TITLE
      ========================= */}
      <h1 className="text-3xl font-semibold mb-4">
        Used {brandName} {modelSlug.replace(/-/g, ' ')} CNC Machines for Sale
      </h1>

      {/* =========================
          SEO DESCRIPTION (ABOVE GRID)
      ========================= */}
      {modelData?.seoDescription && (
        <div className="prose max-w-4xl mb-8">
          <p>{modelData.seoDescription}</p>
        </div>
      )}

      {/* =========================
          MACHINE GRID
      ========================= */}
      {safeMachines.length === 0 ? (
        <div className="text-gray-600 mb-10">
          <p>No current inventory for this model.</p>
          <p className="mt-2 text-sm text-gray-500">
            This may be a sourcing-only model. Contact us and we can locate one.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">

          {safeMachines.map((machine: any) => {
            const category = machine.category?.slug?.current;
            const subcategory = machine.subcategory?.slug?.current;
            const slug = machine.slug?.current;

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

      {/* =========================
          SUPPORT CONTENT (BELOW GRID)
      ========================= */}
      {(modelData?.commonApplications?.length > 0 ||
        modelData?.industries?.length > 0) && (
        <section className="max-w-4xl mt-10">

          {modelData?.commonApplications?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                Common Applications
              </h2>
              <ul className="list-disc pl-5">
                {modelData.commonApplications.map((item: string) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {modelData?.industries?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Industries
              </h2>
              <ul className="list-disc pl-5">
                {modelData.industries.map((item: string) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

        </section>
      )}

    </main>
  );
}
