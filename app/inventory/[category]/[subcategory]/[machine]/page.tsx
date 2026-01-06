import { client } from '@/lib/sanityClient';
import RequestQuoteButton from '@/components/RequestQuoteButton';
import MachineImages from '@/components/MachineImages';
import imageUrlBuilder from '@sanity/image-url';

interface Machine {
  _id: string;
  name: string;
  yearOfMfg?: string;
  specifications?: string;
  images?: { asset: { _ref: string } }[];
  stockNumber: string;
}

interface PageProps {
  params: { category: string; subcategory: string; machine: string };
}

// Sanity image URL builder
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source).auto('format').url();
}

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
      <main style={{ padding: '24px' }}>
        <p>Machine not found</p>
      </main>
    );
  }

  const imageUrls =
    machineData.images?.map((img) => urlFor(img)) ?? [];

  return (
    <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '12px' }}>
        {machineData.name}
      </h1>

      {/* IMAGES */}
      {imageUrls.length > 0 && (
        <MachineImages images={imageUrls} />
      )}

      {/* DETAILS */}
      <section style={{ marginTop: '24px' }}>
        {machineData.yearOfMfg && (
          <p>
            <strong>Year of Mfg:</strong> {machineData.yearOfMfg}
          </p>
        )}

        <p>
          <strong>Stock #:</strong> {machineData.stockNumber}
        </p>
      </section>

      {/* SPECIFICATIONS */}
      {machineData.specifications && (
        <section style={{ marginTop: '16px' }}>
          <h3>Specifications</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {machineData.specifications}
          </pre>
        </section>
      )}

      {/* REQUEST QUOTE */}
      <section style={{ marginTop: '24px' }}>
        <RequestQuoteButton stockNumber={machineData.stockNumber} />
      </section>
    </main>
  );
}
