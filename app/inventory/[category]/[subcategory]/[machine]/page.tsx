import { client } from '@/lib/sanityClient';
import RequestQuoteButton from '@/components/RequestQuoteButton';
import MachineImages from '@/components/MachineImages';
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
    return <p style={{ padding: '24px' }}>Machine not found</p>;
  }

  const imageUrls =
    machineData.images?.map((img) => urlFor(img)) ?? [];

  return (
    <main
      style={{
        padding: '32px 24px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont',
      }}
    >
      {/* ----- Chevron Breadcrumbs ----- */}
      <nav style={{ marginBottom: '24px', fontSize: '0.9rem', color: '#6b7280' }}>
        <Link href="/inventory" style={{ color: '#3b82f6', textDecoration: 'none' }}>Inventory</Link>
        <span style={{ margin: '0 6px' }}>›</span>
        <Link
          href={`/inventory/${params.category}`}
          style={{ color: '#3b82f6', textDecoration: 'none' }}
        >
          {params.category.replace(/-/g, ' ')}
        </Link>
        <span style={{ margin: '0 6px' }}>›</span>
        <Link
          href={`/inventory/${params.category}/${params.subcategory}`}
          style={{ color: '#3b82f6', textDecoration: 'none' }}
        >
          {params.subcategory.replace(/-/g, ' ')}
        </Link>
        <span style={{ margin: '0 6px', color: '#374151' }}>›</span>
        <span style={{ color: '#111827', fontWeight: 500 }}>{machineData.name}</span>
      </nav>

      {/* ----- Machine Title ----- */}
      <h1
        style={{
          fontSize: '2.2rem',
          fontWeight: 600,
          marginBottom: '8px',
        }}
      >
        {machineData.name}
      </h1>

      {/* ----- Year & Stock# ----- */}
      <div style={{ color: '#374151', marginBottom: '24px' }}>
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
        <section style={{ marginTop: '32px' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Specifications</h2>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              background: '#f9fafb',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '0.95rem',
            }}
          >
            {machineData.specifications}
          </pre>
        </section>
      )}

      {/* ----- Request Quote Button ----- */}
      <section style={{ marginTop: '32px' }}>
        <RequestQuoteButton stockNumber={machineData.stockNumber} />
      </section>
    </main>
  );
}

