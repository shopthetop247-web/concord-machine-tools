'use client';

import React, { useState, useEffect } from 'react';
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

export default function MachinePage({ params }: PageProps) {
  const { machine } = params;

  const [machineData, setMachineData] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Fetch machine data on client-side
  useEffect(() => {
    const fetchMachine = async () => {
      try {
        const query = `*[_type == "machine" && slug.current == $slug][0]{
          _id,
          name,
          yearOfMfg,
          specifications,
          images,
          stockNumber
        }`;
        const data: Machine = await client.fetch(query, { slug: machine });
        setMachineData(data);
      } catch (error) {
        console.error('Error fetching machine:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMachine();
  }, [machine]);

  if (loading) return <p>Loading machine...</p>;
  if (!machineData) return <p>Machine not found</p>;

  return (
    <main style={{ padding: '24px' }}>
      <h1>{machineData.name}</h1>

      {machineData.yearOfMfg && (
        <p>
          <strong>Year of Mfg:</strong> {machineData.yearOfMfg}
        </p>
      )}

      {machineData.specifications && (
        <p>
          <strong>Specifications:</strong> {machineData.specifications}
        </p>
      )}

      <button
        style={{ marginTop: '24px', padding: '12px 24px', fontSize: '16px' }}
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

      {machineData.images && machineData.images.length > 0 && (
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
          {machineData.images.map((img, index) => (
            <div key={index} style={{ width: '400px', height: '300px', position: 'relative' }}>
              <Image
                src={urlFor(img).url()}
                alt={machineData.name}
                fill
                style={{ objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
