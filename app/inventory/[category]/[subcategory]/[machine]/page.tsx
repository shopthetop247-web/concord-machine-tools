// app/inventory/[category]/[subcategory]/[machine]/page.tsx

import { client } from '@/lib/sanityClient';
import Image from 'next/image';
import RequestQuoteButton from '@/components/RequestQuoteButton';
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

// Initialize Sanity image builder
const builder = imageUrlBuilder(client);
function urlFor(source: { asset: { _ref: string } }) {
  if (!source || !source.asset?._ref) return '';
  return builder.image(source).auto('format').url();
}

export default async function MachinePage({ params }: PageProps) {
  const { machine } = params;

  // Fetch machine data from Sanity
  const query = `*[_type == "machine" && slug.current == $slug][0]{
    _id,
    name,
    yearOfMfg,
    specifications,
    images,
    stockNumber
  }`;

  const machineData: Machine | null = await client.fetch(query, { slug: machine });

  if (!machineData) {
    return (
      <main style={{ padding: '24px' }}>
        <p>Machine not found</p>
      </main>
    );
  }

  return (
    <main style={{ padding: '24px' }}>
      <h1>{machineData.name}</h1>

      {machineData.yearOfMfg && (
        <p>
          <strong>Year of Mfg:</strong> {machineData.yearOfMfg}
        </p>
      )}

      {machineData.specifications && (
        <div style={{ marginTop: '8px' }}>
          <strong>Specifications:</strong>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: '4px' }}>
            {machineData.specifications}
          </pre>
        </div>
      )}

      <p style={{ marginTop: '8px' }}>
        <strong>Stock#:</strong> {machineData.stockNumber}
      </p>

      {/* Request Quote Button */}
      <div style={{ marginTop: '12px' }}>
        <RequestQuoteButton stockNumber={machineData.stockNumber} />
      </div>

      {/* Machine Images */}
      {machineData.images && machineData.images.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '16px',
            flexWrap: 'wrap',
          }}
        >
          {machineData.images.map((img, index) => {
            const imgUrl = urlFor(img);
            return imgUrl ? (
              <Image
                key={index}
                src={imgUrl}
                alt={machineData.name}
                width={400}
                height={300}
                style={{ objectFit: 'contain' }}
              />
            ) : null; // skip broken images
          })}
        </div>
      )}
    </main>
  );
}
