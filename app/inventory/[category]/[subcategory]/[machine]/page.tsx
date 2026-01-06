'use client'; // Needed for React state/hooks (RequestQuoteModal)

import React from 'react';
import { client } from '@/lib/sanityClient';
import { PortableText } from '@portabletext/react';
import RequestQuoteModal from '@/components/RequestQuoteModal';

interface MachinePageProps {
  params: {
    category: string;
    subcategory: string;
    machine: string;
  };
}

interface Machine {
  _id: string;
  name: string;
  slug: { current: string };
  specifications?: any; // PortableText content
  yearOfMfg?: string;
  stockNumber?: string;
  images?: { asset: { _ref: string } }[];
}

async function getMachine(slug: string): Promise<Machine | null> {
  const query = `
    *[_type == "machine" && slug.current == $slug][0]{
      _id,
      name,
      slug,
      specifications,
      yearOfMfg,
      stockNumber,
      images
    }
  `;
  return client.fetch(query, { slug });
}

export default async function MachinePage({ params }: MachinePageProps) {
  const { machine } = params;
  const machineData = await getMachine(machine);

  if (!machineData) {
    return <p>Machine not found.</p>;
  }

  return (
    <main style={{ padding: '24px' }}>
      <h1>{machineData.name}</h1>

      {machineData.yearOfMfg && <p><strong>Year of Mfg:</strong> {machineData.yearOfMfg}</p>}
      {machineData.stockNumber && <p><strong>Stock #:</strong> {machineData.stockNumber}</p>}

      {machineData.specifications && (
        <div>
          <h2>Specifications</h2>
          <PortableText value={machineData.specifications} />
        </div>
      )}

      {machineData.images && machineData.images.length > 0 && (
        <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
          {machineData.images.map((img, index) => {
            const url = `https://cdn.sanity.io/images/YOUR_PROJECT_ID/YOUR_DATASET/${img.asset._ref.split('-')[1]}.${img.asset._ref.split('-')[2]}`;
            return <img key={index} src={url} alt={machineData.name} style={{ maxWidth: '300px', borderRadius: '8px' }} />;
          })}
        </div>
      )}

      {machineData.stockNumber && (
        <div style={{ marginTop: '24px' }}>
          <RequestQuoteModal stockNumber={machineData.stockNumber} />
        </div>
      )}
    </main>
  );
}
