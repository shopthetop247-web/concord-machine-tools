import { client } from '@/lib/sanityClient';
import Image from 'next/image';
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

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
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

  const machineData: Machine | null = await client.fetch(query, { slug: machine });

  if (!machineData) {
    return <p>Machine not found</p>;
  }

  return (
    <main style={{ padding: '24px' }}>
      <h1>{machineData.name}</h1>

      {machineData.yearOfMfg && <p><strong>Year of Mfg:</strong> {machineData.yearOfMfg}</p>}
      {machineData.specifications && <p><strong>Specifications:</strong> {machineData.specifications}</p>}

      {machineData.images && machineData.images.length > 0 && (
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
          {machineData.images.map((img, index) => (
            <Image
              key={index}
              src={urlFor(img).url()}
              alt={machineData.name}
              width={400}
              height={300}
            />
          ))}
        </div>
      )}
    </main>
  );
}
