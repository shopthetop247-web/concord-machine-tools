'use client';

import React, { useState } from 'react';
import { client } from '@/lib/sanityClient';
import Image from 'next/image';
import RequestQuoteModal from '@/components/RequestQuoteModal';
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

// Setup Sanity image builder
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
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
  const machineData: Machine = await client.fetch(query, { slug: machine });

  if (!machineData) {
    return <p>Machine not found</p>;
  }

  const [showModal, setShowModal] = useState(false);

  return (
    <main style={{ padding: '24px' }}>
      <h1>{machineData.name}</h1>

      {machineData.yearOfMfg && (
        <p>
          <strong>Year of Mfg:</strong> {machineData.yearOfMfg}
        </p>
      )}

      <p>
        <strong>Stock#:</strong> {machineData.stockNumber}
      </p>

      {machineData.specifications && (
        <div style={{ whiteSpace: 'pre-line', marginTop: '16px' }}>
          <strong>Specifications:</strong>
          <div>{machineData.specifications}</div>
        </div>
      )}

      <button
        style={{
          marginTop: '16px',
          padding: '8px 16px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
        onClick={() => setShowModal(true)}
      >
        Request Quote
      </button>

      {showModal && (
        <RequestQuoteModal
          stockNumber={machineData.stockNumber}
          onClose={() => setShowModal(false)}
        />
      )}

      {machineData.images?.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '16px',
            flexWrap: 'wrap',
          }}
        >
          {machineData.images.map((img, index) => {
            const src = urlFor(img)?.url();
            if (!src) return null;
            return (
              <Image
                key={index}
                src={src}
                alt={machineData.name}
                width={400}
                height={300}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}
