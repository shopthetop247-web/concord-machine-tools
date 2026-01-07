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
  yearOfMfg?: string;
  specifications?: string;
  images?: { asset: { _ref: string } }[];
  videoUrl?: string; // single YouTube URL
  stockNumber: string;
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

/**
 * Safely extract a YouTube video ID
 */
function getYouTubeId(url?: string) {
  if (!url) return null;

  const match =
    url.match(/v=([^&]+)/) ||
    url.match(/youtu\.be\/([^?]+)/);

  return match ? match[1] : null;
}

/* ---------------- SEO METADATA ---------------- */
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const machine: Machine | null = await client.fetch(
    `*[_type == "machine" && slug.current == $slug][0]{
      name,
      brand,
      yearOfMfg,
      stockNumber
    }`,
    { slug: params.machine }
  );

  if (!machine) {
    return {
      title: 'Machine Not Found | Concord Machine Tools',
    };
  }

  const brandPart = machine.brand ? `${machine.brand} ` : '';
  const title = `${brandPart}${machine.name} CNC Machine for Sale | Concord Machine Tools`;

  const description = `Used ${brandPart}${machine.name} CNC machine for sale. View photos, specifications, and request a quote from Concord Machine Tools. Stock #${machine.stockNumber}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

/* ---------------- PAGE ---------------- */
export default async function MachinePage({ params }: PageProps) {
  const machineData: Machine | null = await client.fetch(
    `*[_type == "machine" && slug.current == $slug][0]{
      _id,
      name,
      brand,
      yearOfMfg,
      specifications,
      images,
      videoUrl,
      stockNumber
    }`,
    { slug: params.machine }
  );

  if (!machineData) {
    return <p className="p-6">Machine not found</p>;
  }

  const images = machineData.images?.map(urlFor) ?? [];
  const videoId = getYouTubeId(machineData.videoUrl);

  /* ----------- STRUCTURED DATA (JSON-LD) ----------- */
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${machineData.brand ?? ''} ${machineData.name}`.trim(),
    brand: machineData.brand
      ? {
          '@type': 'Brand',
          name: machineData.brand,
        }
      : undefined,
    image: images,
    description: `Used ${machineData.brand ?? ''} ${machineData.name} CNC machine for sale.`,
    sku: machineData.stockNumber,
    itemCondition: 'https://schema.org/UsedCondition',
    seller: {
      '@type': 'Organization',
      name: 'Concord Machine Tools',
    },
    video: videoId
      ? {
          '@type': 'VideoObject',
          name: `${machineData.name} Machine Video`,
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
        }
      : undefined,
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
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
        {machineData.brand && `${machineData.brand} `}
        {machineData.name}
      </h1>

      {/* Meta */}
      <div className="text-gray-700 mb-6">
        {machineData.yearOfMfg && (
          <>
            <strong>Year:</strong> {machineData.yearOfMfg} &nbsp;|&nbsp;
          </>
        )}
        <strong>Stock #:</strong> {machineData.stockNumber}
      </div>

      {/* Images */}
      {images.length > 0 && <MachineImages images={images} />}

      {/* 🎥 Machine Video */}
      {videoId && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">
            Machine Video
          </h2>

          <div className="relative w-full max-w-4xl aspect-video rounded-lg overflow-hidden border bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
          <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded border border-gray-200 text-sm">
            {machineData.specifications}
          </pre>
        </section>
      )}

      {/* Quote CTA */}
      <section className="mt-8">
        <RequestQuoteSection stockNumber={machineData.stockNumber} />
      </section>
    </main>
  );
}
