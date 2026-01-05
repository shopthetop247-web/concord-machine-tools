"use client"; // Required if this component (or its children) uses React hooks

import { client } from "@/lib/sanityClient";
import RequestQuoteModal from "@/components/RequestQuoteModal";
import Image from "next/image";
import { PortableText } from "@portabletext/react";

interface Machine {
  _id: string;
  name: string;
  specifications?: any; // Portable Text content
  yearOfMfg?: string;
  stockNumber: string;
  images?: { asset: { url: string }; alt?: string }[];
}

interface MachinePageProps {
  params: { category: string; subcategory: string; machine: string };
}

async function getMachine(categorySlug: string, subcategorySlug: string, machineSlug: string): Promise<Machine | null> {
  const query = `
    *[_type == "machine" 
      && slug.current == $machineSlug
      && references(*[_type=="subcategory" && slug.current==$subcategorySlug]._id)
      && references(*[_type=="category" && slug.current==$categorySlug]._id)
    ][0]{
      _id,
      name,
      specifications,
      yearOfMfg,
      stockNumber,
      images[]{ asset->{ url }, alt }
    }
  `;

  return client.fetch(query, { categorySlug, subcategorySlug, machineSlug });
}

export default async function MachinePage({ params }: MachinePageProps) {
  const { category, subcategory, machine } = params;
  const machineData = await getMachine(category, subcategory, machine);

  if (!machineData) {
    return <p>Machine not found.</p>;
  }

  return (
    <main style={{ padding: "24px" }}>
      <h1>{machineData.name}</h1>
      <p><strong>Year of Mfg.:</strong> {machineData.yearOfMfg || "N/A"}</p>
      <p><strong>Stock #:</strong> {machineData.stockNumber}</p>

      {machineData.images && machineData.images.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "16px" }}>
          {machineData.images.map((img, index) => (
            <Image
              key={index}
              src={img.asset.url}
              alt={img.alt || machineData.name}
              width={400}
              height={300}
              style={{ objectFit: "cover" }}
            />
          ))}
        </div>
      )}

      {machineData.specifications && (
        <section style={{ marginTop: "24px" }}>
          <h2>Specifications</h2>
          <PortableText value={machineData.specifications} />
        </section>
      )}

      <section style={{ marginTop: "32px" }}>
        <RequestQuoteModal stockNumber={machineData.stockNumber} />
      </section>
    </main>
  );
}
