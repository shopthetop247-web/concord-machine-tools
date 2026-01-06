import { client } from '@/lib/sanityClient';
import RequestQuoteButton from '@/components/RequestQuoteButton';
import MachineImages from '@/components/MachineImages';

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
    <main
      style={{
        padding: '24px',
        maxWidth: '1000px',
        margin: '0 auto',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>{machineData.name}</h1>

      {machineData.yearOfMfg && (
        <p style={{ marginBottom: '8px' }}>
          <strong>Year of Mfg:</strong> {machineData.yearOfMfg}
        </p>
      )}

      {machineData.specifications && (
        <div style={{ marginBottom: '12px' }}>
          <strong>Specifications:</strong>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              marginTop: '4px',
              padding: '8px',
              backgroundColor: '#f5f5f5',
              borderRadius: '6px',
            }}
          >
            {machineData.specifications}
          </pre>
        </div>
      )}

      <p style={{ marginBottom: '12px' }}>
        <strong>Stock#:</strong> {machineData.stockNumber}
      </p>

      <div style={{ marginBottom: '24px' }}>
        <RequestQuoteButton stockNumber={machineData.stockNumber} />
      </div>

      {machineData.images && machineData.images.length > 0 && (
        <MachineImages images={machineData.images} />
      )}
    </main>
  );
}
