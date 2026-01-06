import { client } from '@/lib/sanityClient';
import MachineImages from '@/components/MachineImages';
import RequestQuoteSection from '@/components/RequestQuoteSection';
import imageUrlBuilder from '@sanity/image-url';
import Link from 'next/link';

interface Machine {
  _id: string;
  name: string;
  yearOfMfg?: string;
  specifications?: string;
  images?: { asset: { _ref: string } }[];
  videos?: string[];
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
  builder.image(source).auto('format').url();

export default async function MachinePage({ params }: PageProps) {
  const machineData: Machine | null = await client.fetch(
    `*[_type == "machine" && slug.current == $slug][0]{
      _id,
      name,
      yearOfMfg,
      specifications,
      images,
      stockNumber
    }`,
    { slug: params.machine }
  );

  if (!machineData) {
    return <p className="p-6">Machine not found</p>;
  }

  const galleryItems = [
  ...(machineData.images?.map((img) => ({
    type: 'image' as const,
    src: urlFor(img),
  })) ?? []),
  ...(machineData.videos?.map((url: string) => ({
    type: 'video' as const,
    src: url.split('v=')[1]?.split('&')[0] || url.split('/').pop(),
  })) ?? []),
];


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
            <strong>Year:</strong> {machineData.yearOfMfg}
            &nbsp;|&nbsp;
          </>
        )}
        <strong>Stock #:</strong> {machineData.stockNumber}
      </div>

      {/* Images */}
      {imageUrls.length > 0 && (
        <MachineImages images={imageUrls} />
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

      {/* Quote CTA (client component) */}
      <section className="mt-8">
        <RequestQuoteSection stockNumber={machineData.stockNumber} />
      </section>
    </main>
  );
}

