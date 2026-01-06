import { client } from '@/lib/sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import RequestQuoteButton from '@/components/RequestQuoteButton';
import MachineImages from '@/components/MachineImages';

interface Machine {
  _id: string;
  name: string;
  yearOfMfg?: string;
  specifications?: string;
  images?: { asset: { _ref: string } }[];
  stockNumber: string;
}

interface PageProps {
  params: {
    category: string;
    subcategory: string;
    machine: string;
  };
}

/* ------------------------------
   Sanity Image URL Builder
-------------------------------- */
const builder = imageUrlBuilder(client);

function urlFor(source: any): string {
  return builder.image(source).auto('format').fit('max').url();
}

/* ------------------------------
   Page Component (SERVER)
-------------------------------- */
export default async function MachinePage({ params }: PageProps) {
  const { machine } = params;

  const query = `*[_type == "machine" && slug.current == $slug][0]{
    _id,
    name,
    yearOfMfg,
    specifications,
    images,
    stockNumber
  }`;

  const machineData: Machine | null = await client.fetch(query, {
    slug: machine,
  });

  if (!machineData) {
    return (
      <main className="p-6">
        <p>Machine not found</p>
      </main>
    );
  }

  /* ------------------------------
     BUILD IMAGE URLS (IMPORTANT)
     This is the FIX
  -------------------------------- */
  const imageUrls: string[] =
    machineData.images?.map((img) => urlFor(img)) ?? [];

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">
        {machineData.name}
      </h1>

      {machineData.yearOfMfg && (
        <p className="mb-2">
          <strong>Year of Mfg:</strong> {machineData.yearOfMfg}
        </p>
      )}

      <p className="mb-4">
        <strong>Stock #:</strong> {machineData.stockNumber}
      </p>

      {/* Images (Client Component) */}
      {imageUrls.length > 0 && (
        <MachineImages
          images={imageUrls}
          alt={machineData.name}
        />
      )}

      {/* Specifications */}
      {machineData.specifications && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">
            Specifications
          </h2>
          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
            {machineData.specifications}
          </pre>
        </div>
      )}

      {/* Request Quote */}
      <div className="mt-6">
        <RequestQuoteButton stockNumber={machineData.stockNumber} />
      </div>
    </main>
  );
}
