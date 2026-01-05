import React from 'react';
import { groq } from 'next-sanity';
import { client } from '@/lib/sanityClient';
import RequestQuoteModal from '@/components/RequestQuoteModal';

interface MachinePageProps {
  params: {
    category: string;
    subcategory: string;
    machine: string;
  };
}

interface Machine {
  name: string;
  stockNumber: string;
  yearOfMfg: number;
  specifications: string;
  images: { asset: { url: string } }[];
}

export default async function MachinePage({ params }: MachinePageProps) {
  const { machine } = params;

  // Fetch machine from Sanity
  const query = groq`*[_type == "machine" && slug.current == $slug][0]{
    name,
    stockNumber,
    yearOfMfg,
    specifications,
    images[]{asset->{url}}
  }`;

  const machineData: Machine | null = await client.fetch(query, { slug: machine });

  if (!machineData) {
    return <p>Machine not found.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{machineData.name}</h1>
      <p className="mb-1"><strong>Stock #:</strong> {machineData.stockNumber}</p>
      <p className="mb-1"><strong>Year of Mfg.:</strong> {machineData.yearOfMfg}</p>
      <p className="mb-4"><strong>Specifications:</strong> {machineData.specifications}</p>

      {/* Images gallery */}
      {machineData.images?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {machineData.images.map((img, i) => (
            <img
              key={i}
              src={img.asset.url}
              alt={machineData.name}
              className="w-full h-auto rounded"
            />
          ))}
        </div>
      )}

      {/* Request Quote modal */}
      <RequestQuoteModal stockNumber={machineData.stockNumber} />
    </div>
  );
}
