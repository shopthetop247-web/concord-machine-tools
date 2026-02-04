export const revalidate = 60;

import { client } from '@/lib/sanityClient';
import MachineImages from '@/components/MachineImages';
import RequestQuoteSection from '@/components/RequestQuoteSection';
import imageUrlBuilder from '@sanity/image-url';
import Link from 'next/link';
import { Metadata } from 'next';

interface Machine {
  _id: string;
  name: string;
  brand?: string;
  yearOfMfg?: number;
  specifications?: string;
  description?: string;
  images?: { asset: { _ref: string } }[];
  videoUrl?: string;
  stockNumber: string;
  slug?: { current: string };
  subcategory?: { _ref: string };
}

interface PageProps {
  params: {
    category: string;
    subcategory: string;
    machine: string;
  };
}

const builder = imageUrlBuilder(client);
const urlFor = (source: any) =>
  builder.image(source).auto('format').fit('max').url();

/* -----------------------------------
   YouTube ID Extractor
----------------------------------- */
function getYouTubeId(url?: string) {
  if (!url) return null;

  const match =
    url.match(/v=([^&]+)/) ||
    url.match(/youtu\.be\/([^?]+)/);

  return match ? match[1] : null;
}

/* -----------------------------------
   SEO METADATA
----------------------------------- */
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const machine: Machine | null = await client.fetch(
    `*[_type == "machine" && slug.current == $slug][0]{
      name,
      brand,
      yearOfMfg,
      stockNumber,
      description
    }`,
    { slug: params.machine }
  );

  if (!machine) {
    return {
      title: 'Machine Not Found | Concord Machine Tools',
    };
  }

  const brandPrefix = machine.brand ? `${machine.brand} ` : '';
  const title = `${brandPrefix}${machine.name} for Sale | Used CNC Machinery`;

  const description =
    machine.description ??
    `Used ${brandPrefix}${machine.name} for sale. View photos, specifications, video, and request a quote. Stock #${machine.stockNumber}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/inventory/${params.category}/${params.subcategory}/${params.machine}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

/* -----------------------------------
   PAGE
----------------------------------- */
export default async function MachinePage({ params }: PageProps) {
  const machineData: Machine | null = await client.fetch(
    `*[_type == "machine" && slug.current == $slug][0]{
      _id,
      name,
      brand,
      yearOfMfg,
      specifications,
      description,
      images[]{ asset-> },
      videoUrl,
      stockNumber,
      slug,
      subcategory
    }`,
    { slug: params.machine }
  );

  if (!machineData) {
    return <p className="p-6">Machine not found</p>;
  }

  const images =
    machineData.images
      ?.map((img) => {
        try {
          return urlFor(img);
        } catch {
          return null;
        }
      })
      .filter(Boolean) ?? [];

  const videoId = getYouTubeId(machineData.videoUrl);

  /* -----------------------------------
     RELATED MACHINES QUERY
  ----------------------------------- */
  const relatedMachines: Machine[] = await client.fetch(
    `
    *[_type == "machine" &&
      slug.current != $slug &&
      subcategory._ref == $subcategoryRef
    ]
    | order(brand == $brand desc, yearOfMfg desc)[0...4]{
      _id,
      name,
      brand,
      yearOfMfg,
      stockNumber,
      images[]{ asset-> },
      slug
    }
    `,
    {
      slug: params.machine,
      subcategoryRef: machineData.subcategory?._ref,
      brand: machineData.brand ?? '',
    }
  );

  /* -----------------------------------
     STRUCTURED DATA (Product + Offer)
  ----------------------------------- */
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${machineData.brand ?? ''} ${machineData.name}`.trim(),
    image: images.length ? images : undefined,
    description:
      machineData.description ??
      `Used ${machineData.brand ?? ''} ${machineData.name} for sale.`,
    sku: machineData.stockNumber,
    brand: machineData.brand
      ? { '@type': 'Brand', name: machineData.brand }
      : undefined,
    category: params.subcategory.replace(/-/g, ' '),
    itemCondition: 'https://schema.org/UsedCondition',
    offers: {
      '@type': 'Offer',
      url: `https://www.concordmt.com/inventory/${params.category}/${params.subcategory}/${params.machine}`,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Concord Machine Tools',
        url: 'https://www.concordmt.com',
      },
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inventory',
        item: 'https://www.concordmt.com/inventory',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: params.category.replace(/-/g, ' '),
        item: `https://www.concordmt.com/inventory/${params.category}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: params.subcategory.replace(/-/g, ' '),
        item: `https://www.concordmt.com/inventory/${params.category}/${params.subcategory}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: machineData.name,
      },
    ],
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([productSchema, breadcrumbSchema]),
        }}
      />

      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/inventory" className="text-blue-500 hover:underline">
          Inventory
        </Link>
        <span className="mx-1">›</span>
        <Link
          href={`/inventory/${params.category}/${params.subcategory}`}
          className="text-blue-500 hover:underline"
        >
          {params.subcategory.replace(/-/g, ' ')}
        </Link>
        <span className="mx-1 text-gray-700">›</span>
        <span className="font-medium text-gray-900">
          {machineData.name}
        </span>
      </nav>

      <h1 className="text-3xl font-semibold mb-2">
        {machineData.name}
      </h1>

      <div className="text-gray-700 mb-4">
        {machineData.yearOfMfg && (
          <>
            <strong>Year:</strong> {machineData.yearOfMfg} &nbsp;|&nbsp;
          </>
        )}
        <strong>Stock #:</strong> {machineData.stockNumber}
      </div>

      {machineData.description && (
        <p className="mb-6 text-gray-800 leading-relaxed">
          {machineData.description}
        </p>
      )}

      {images.length > 0 && <MachineImages images={images} />}

      {videoId && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">
            Machine Video
          </h2>
          <div className="relative w-full max-w-4xl aspect-video rounded-lg overflow-hidden border bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              title={`${machineData.name} video`}
            />
          </div>
        </section>
      )}

      {machineData.specifications && (
        <section className="mt-8">
          <h2 className="text-lg font-medium mb-2">
            Specifications
          </h2>
          <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded border text-sm">
            {machineData.specifications}
          </pre>
        </section>
      )}

      {/* Quote */}
      <section className="mt-8">
        <RequestQuoteSection stockNumber={machineData.stockNumber} />
      </section>

      {/* Related Machines */}
      {relatedMachines.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">
            Related Machines
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedMachines.map((machine) => {
              const imageUrl = machine.images?.[0]
                ? urlFor(machine.images[0])
                : '/placeholder.jpg';

              return (
                <Link
                  key={machine._id}
                  href={`/inventory/${params.category}/${params.subcategory}/${machine.slug?.current}`}
                  className="block border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="w-full h-40">
                    <img
                      src={imageUrl}
                      alt={`${machine.name} for sale`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="text-md font-medium mb-1">
                      {machine.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {machine.yearOfMfg && <>Year: {machine.yearOfMfg} &nbsp;|&nbsp;</>}
                      Stock #: {machine.stockNumber}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}

