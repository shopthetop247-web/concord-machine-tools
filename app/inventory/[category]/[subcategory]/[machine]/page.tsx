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
      images[]{
        asset->
      },
      videoUrl,
      stockNumber,
      slug
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
     STRUCTURED DATA
  ----------------------------------- */
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${machineData.brand ?? ''} ${machineData.name}`.trim(),
    image: images,
    description:
      machineData.description ??
      `Used ${machineData.brand ?? ''} ${machineData.name} for sale.`,
    sku: machineData.stockNumber,
    brand: machineData.brand
      ? { '@type': 'Brand', name: machineData.brand }
      : undefined,
    itemCondition: 'https://schema.org/UsedCondition',
    seller: {
      '@type': 'Organization',
      name: 'Concord Machine Tools',
    },
  };

  const videoSchema = videoId
    ? {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: `${machineData.name} Machine Video`,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
      }
    : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inventory',
        item: 'https://www.concordmachinetools.com/inventory',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: params.category.replace(/-/g, ' '),
        item: `https://www.concordmachinetools.com/inventory/${params.category}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: params.subcategory.replace(/-/g, ' '),
        item: `https://www.concordmachinetools.com/inventory/${params.category}/${params.subcategory}`,
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
          __html: JSON.stringify(
            [productSchema, videoSchema, breadcrumbSchema].filter(Boolean)
          ),
        }}
      />

      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/inventory" className="text-blue-500 hover:underline">
          Inventory
        </Link>
        <span className="mx-1">›</span>
        <Link
          href={`/inventory/${params.category}`}
          className="text-blue-500 hover:underline"
        >
          {params.category.replace(/-/g, ' ')}
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

      {/* Title */}
      <h1 className="text-3xl font-semibold mb-2">
        {machineData.name}
      </h1>

      {/* Meta */}
      <div className="text-gray-700 mb-4">
        {machineData.yearOfMfg && (
          <>
            <strong>Year:</strong> {machineData.yearOfMfg} &nbsp;|&nbsp;
          </>
        )}
        <strong>Stock #:</strong> {machineData.stockNumber}
      </div>

      {/* Description */}
      {machineData.description && (
        <p className="mb-6 text-gray-800 leading-relaxed">
          {machineData.description}
        </p>
      )}

      {/* Images */}
      {images.length > 0 && <MachineImages images={images} />}

      {/* Video */}
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

      {/* Specs */}
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
    </main>
  );
}
