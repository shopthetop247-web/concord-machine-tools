import React, { useState } from 'react';
import { client } from '@/lib/sanityClient';
import Image from 'next/image';
import RequestQuoteModal from '@/components/RequestQuoteModal';
import imageUrlBuilder from '@sanity/image-url';

// ----- TYPES -----
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

// ----- SANITY IMAGE BUILDER -----
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source).url();
}

// ----- CLIENT-SIDE MODAL WRAPPER -----
'use client';
function RequestQuoteButton({ stockNumber }: { stockNumber: string }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div style={{ marginTop: '16px' }}>
      <button
        onClick={() => setShowModal(true)}
        style={{
          padding: '8px 16px',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Request Quote
      </button>

      {showModal && (
        <RequestQuoteModal
          stockNumber={stockNumber}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

// ----- SERVER COMPONENT PAGE -----
export default async function MachinePage({ params }: PageProps) {
  const { category, subcategory, machine } = params;

  // Fetch machine data from Sanity
  const query = `*[_type=="machine" && slug.current==$slug][0]{
    _id,
    name,
    yearOfMfg,
    specifications,
    images,
    stockNumber
  }`;

  const machineData: Machine | null = await client.fetch(query, { slug: machine });

  if (!machineData) {
    return <p>Machine not found.</p>;
  }

  return (
    <main style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>{machineData.name}</h1>

      <p>
        <strong>Stock#:</strong> {machineData.stockNumber}
      </p>

      {machineData.yearOfMfg && (
        <p>
          <strong>Year of Mfg:</strong> {machineData.yearOfMfg}
        </p>
      )}

      {machineData.specifications && (
        <div style={{ whiteSpace: 'pre-wrap', marginTop: '12px' }}>
          <strong>Specifications:</strong>
          <p>{machineData.specifications}</p>
        </div>
      )}

      {/* Request Quote Button & Modal */}
      <RequestQuoteButton stockNumber={machineData.stockNumber} />

      {/* Images */}
      {machineData.images && machineData.images.length > 0 && (
        <div
          style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '16px',
            marginTop: '24px',
            paddingBottom: '12px',
          }}
        >
          {machineData.images.map((img, index) => {
            const src = urlFor(img);
            if (!src) return null;
            return (
              <div key={index} style={{ flex: '0 0 auto' }}>
                <Image
                  src={src}
                  alt={`${machineData.name} image ${index + 1}`}
                  width={400}
                  height={300}
                  style={{ borderRadius: '8px' }}
                />
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
