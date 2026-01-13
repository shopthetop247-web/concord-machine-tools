// app/brands/[brand]/page.tsx
export const revalidate = 60;

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
   SEO METADATA
------------------------------------ */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const brandName = params.brand.replace(/-/g, ' ');
  return {
    title: `${brandName} Machines | Concord Machine Tools`,
    description: `Browse available used ${brandName} machines including CNC and industrial equipment. View specifications, photos, and request a quote.`,
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
  const brandSlug = params.brand;

  /* ----------------------------
     FETCH BRAND DATA
  ---------------------------- */
  const brand: Brand | null = await client.fetch(
    `*[_type == "brand" && slug.current == $slug][0]{
      name,
      description,
      website,
      slug
    }`,
    { slug: brandSlug }
  );

  const brandName = brand?.name || brandSlug.replace(/-/g, ' ');

  /* ----------------------------
     FETCH MACHINES
  ---------------------------- */
  const machines: Machine[] = await client.fetch(
  `*[
    _type == "machine" &&
    !(_id in path("drafts.**")) &&
    brandRef->slug.current == $slug
  ]{
    _id,
    name,
    yearOfMfg,
    stockNumber,
    images[] { asset-> },
    slug,
    category->{ slug },
    subcategory->{ slug }
  } | order(yearOfMfg desc, name asc)`,
  { slug: brandSlug }
);

  /* ------------------------------------
     BRAND + COLLECTION JSON-LD
  ------------------------------------ */
  const brandSchema = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name: brandName,
    url: `https://www.concordmt.com/brands/${brandSlug}`,
    description: brand?.description,
    sameAs: brand?.website ? [brand.website] : undefined,
    mainEntityOfPage: {
      '@type': 'CollectionPage',
      name: `Used ${brandName} Machines`,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: machines.length,
        itemListElement: machines.map((machine, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: machine.name,
          url: `https://www.concordmt.com/inventory/${machine.category.slug.current}/${machine.subcategory.slug.current}/${machine.slug.current}`,
        })),
      },
    },
  };

  /* ----------------------------
     RENDER PAGE
  ---------------------------- */
  if (!machines.length) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold mb-4 capitalize">{brandName}</h1>
        {brand?.description && (
          <p className="text-gray-700 mb-6">{brand.description}</p>
        )}
        <p className="text-gray-700">
          There are currently no machines listed for this brand.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      {/* Brand Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(brandSchema) }}
      />

      {/* Page Heading */}
      <h1 className="text-3xl font-semibold mb-4 capitalize">{brandName}</h1>

      {/* Brand Description (if exists) */}
      {brand?.description && (
        <section className="mb-8 max-w-4xl">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {brand.description}
          </p>
          {brand.website && (
            <p className="mt-3">
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                Visit official {brandName} website →
              </a>
            </p>
          )}
        </section>
      )}

      {/* Machines Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {machines.map((machine) => {
          const imageUrl = machine.images?.[0]
            ? urlFor(machine.images[0])
            : '/placeholder.jpg';

          return (
            <Link
              key={machine._id}
              href={`/inventory/${machine.category.slug.current}/${machine.subcategory.slug.current}/${machine.slug.current}`}
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
                <h2 className="text-lg font-medium mb-1">{machine.name}</h2>
                <p className="text-sm text-gray-600">
                  {machine.yearOfMfg && <>Year: {machine.yearOfMfg} &nbsp;|&nbsp;</>}
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

