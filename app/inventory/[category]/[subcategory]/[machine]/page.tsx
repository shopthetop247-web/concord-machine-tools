'use client';

import React, { useState } from 'react';
import { client } from '@/lib/sanityClient';
import MachineImages from '@/components/MachineImages';
import RequestQuoteModal from '@/components/RequestQuoteModal';
import imageUrlBuilder from '@sanity/image-url';
import Link from 'next/link';

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

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source).auto('format').url();
}

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

  const imageUrls = machineData.images?.map((img) => urlFor(img)) ?? [];

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="p-8 max-w-[1200px] mx-auto font-sans">
      {/* ----- Chevron Breadcrumbs ----- */}
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
        <span className="text-gray-900 font-medium">{machineData.name}</span>
      </nav>

      {/* ----- Machine Title ----- */}
      <h1 className="text-3xl font-semibold mb-2">{machineData.name}</h1>

      {/* ----- Year & Stock# ----- */}
      <div className="text-gray-700 mb-6">
        {machineData.yearOfMfg && (
          <span>
            <strong>Year:</strong> {machineData.yearOfMfg} &nbsp;|&nbsp;
          </span>
        )}
        <strong>Stock #:</strong> {machineData.stockNumber}
      </div>

      {/* ----- Machine Images ----- */}
      {imageUrls.length > 0 && <MachineImages images={imageUrls} />}

      {/* ----- Specifications ----- */}
      {machineData.specifications && (
        <section className="mt-8">
          <h2 className="text-lg font-medium mb-2">Specifications</h2>
          <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded border border-gray-200 text-sm">
            {machineData.specifications}
          </pre>
        </section>
      )}

      {/* ----- Request Quote Button & Modal ----- */}
      <section className="mt-8">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brandBlue text-white font-semibold px-6 py-3 rounded shadow-md hover:bg-blue-400 hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
        >
          Request Quote
        </button>

        {isModalOpen && (
          <RequestQuoteModal
            stockNumber={machineData.stockNumber}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </section>
    </main>
  );
}

