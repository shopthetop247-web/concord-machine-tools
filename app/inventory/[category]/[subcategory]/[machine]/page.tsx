import { client } from '@/lib/sanityClient';
import MachineImages from '@/components/MachineImages';
import RequestQuoteSection from '@/components/RequestQuoteSection';
import imageUrlBuilder from '@sanity/image-url';
import Link from 'next/link';

interface Machine {
  _id: string;
  name: string;
  brand?: string; // optional for future search
  yearOfMfg?: string;
  specifications?: string;
  images?: { asset: { _ref: string } }[];
  videoUrl?: string; // ✅ NEW: single YouTube video
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
const urlFor = (source: any) => builder.image(source).auto('format').url();

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

  // Map images to URLs
  const images = machineData.images?.map(urlFor) ?? [];

  // Extract YouTube ID if present
  const videoId = getYouTubeId(machineData.videoUrl);

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
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
              title="Machine video"
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

