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

  return (
    <main style={{ padding: '2rem', fontFamily: 'Inter, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>{machineData.name}</h1>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <p><strong>Stock#:</strong> {machineData.stockNumber}</p>
        {machineData.yearOfMfg && <p><strong>Year of Mfg:</strong> {machineData.yearOfMfg}</p>}
      </div>

      {machineData.specifications && (
        <div style={{ marginBottom: '1.5rem', backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '6px' }}>
          <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Specifications:</strong>
          <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{machineData.specifications}</pre>
        </div>
      )}

      <RequestQuoteButton stockNumber={machineData.stockNumber} />

      <MachineImages images={machineData.images || []} alt={machineData.name} />
    </main>
  );
}
