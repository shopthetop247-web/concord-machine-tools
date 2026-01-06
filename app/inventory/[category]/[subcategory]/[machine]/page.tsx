import { client } from '@/lib/sanityClient';
import Image from 'next/image';
import RequestQuoteButton from '@/components/RequestQuoteButton';
import imageUrlBuilder from '@sanity/image-url';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

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

// Sanity image builder
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source).auto('format').url();
}

export default async function MachinePage({ params }: PageProps) {
  const { machine } = params;

  // Fetch machine data
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
      <main style={{ padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
        <p>Machine not found</p>
      </main>
    );
  }

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <main style={{ padding: '2rem', fontFamily: 'Inter, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Title */}
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>{machineData.name}</h1>

      {/* Stock & Year */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <p><strong>Stock#:</strong> {machineData.stockNumber}</p>
        {machineData.yearOfMfg && <p><strong>Year of Mfg:</strong> {machineData.yearOfMfg}</p>}
      </div>

      {/* Specifications */}
      {machineData.specifications && (
        <div style={{ marginBottom: '1.5rem', backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '6px' }}>
          <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Specifications:</strong>
          <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{machineData.specifications}</pre>
        </div>
      )}

      {/* Request Quote Button */}
      <RequestQuoteButton stockNumber={machineData.stockNumber} />

      {/* Images Grid */}
      {machineData.images && machineData.images.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
            marginTop: '2rem'
          }}
        >
          {machineData.images.map((img, index) => (
            <div
              key={index}
              style={{ cursor: 'pointer', overflow: 'hidden', borderRadius: '8px', border: '1px solid #ddd' }}
              onClick={() => setLightboxIndex(index)}
            >
              <Image
                src={urlFor(img)}
                alt={machineData.name}
                width={400}
                height={300}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Lightbox for clicked images */}
      {lightboxIndex !== null && (
        <Lightbox
          slides={machineData.images!.map((img) => ({ src: urlFor(img) }))}
          open={lightboxIndex !== null}
          index={lightboxIndex}
          close={() => setLightboxIndex(null)}
        />
      )}
    </main>
  );
}
