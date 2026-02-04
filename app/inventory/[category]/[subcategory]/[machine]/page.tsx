export const revalidate = 60;

import { client } from '@/lib/sanityClient';
import MachineImages from '@/components/MachineImages';
import RequestQuoteSection from '@/components/RequestQuoteSection';
import imageUrlBuilder from '@sanity/image-url';
import Link from 'next/link';
import { Metadata } from 'next';

interface Machine {
  _id: string;
  name: string;
  brand?: string;
  yearOfMfg?: number;
  specifications?: string;
  description?: string;
  images?: { asset: { _ref: string } }[];
  stockNumber: string;
  slug?: { current: string };
  subcategory?: { _ref: string };
}

interface PageProps {
  params: {
    category: string;
    subcategory: string;
    machine: string;
  };
}

const builder = imageUrlBuilder(client);
const urlFor = (source: any) =>
  builder.image(source).auto('format').fit('max').url();

/* -----------------------------------
   SEO METADATA
----------------------------------- */
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const machine = await client.fetch(
    `*[_type == "machine" && slug.current == $slug][0]{
      name,
      brand,
      stockNumber,
      description
    }`,
    { slug: params.machine }
  );

  if (!machine) {
    return { title: 'Machine Not Found' };
  }

  return {
    title: `${machine.brand ?? ''} ${machine.name} for Sale`,
    description:
      machine.description ??
      `Used ${machine.name} for sale. Stock #${machine.stockNumber}.`,
  };
}

/* -----------------------------------
   PAGE
----------------------------------- */
export default async function MachinePage({ params }: PageProps) {
  const machine = await client.fetch<Machine>(
    `*[_type == "machine" && slug.current == $slug][0]{
      _id,
      name,
      brand,
      yearOfMfg,
      specifications,
      description,
      images[]{ asset-> },
      stockNumber,
      slug,
      subcategory
    }`,
    { slug: params.machine }
  );

  if (!machine) {
    return <p className="p-6">Machine not found</p>;
  }

  const images =
    machine.images
      ?.map((img) => {
        try {
          return urlFor(img);
        } catch {
          return null;
        }
      })
      .filter(Boolean) ?? [];

  /* -----------------------------------
     RELATED MACHINES
  ----------------------------------- */
  const relatedMachines =
    machine.subcategory?._ref
      ? await client.fetch(
          `*[_type == "machine" &&
            slug.current != $slug &&
            subcategory._ref == $subcategoryRef
          ]
          | order(
              (brand == $brand) desc,
              yearOfMfg desc
            )[0...4]{
            _id,
            name,
            yearOfMfg,
            slug
          }`,
          {
            slug: params.machine,
            subcategoryRef: machine.subcategory._ref,
            brand: machine.brand,
          }
        )
      : [];

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/inventory" className="text-blue-500 hover:underline">
          Inventory
        </Link>{' '}
        ›{' '}
        <Link
          href={`/inventory/${params.category}`}
          className="text-blue-500 hover:underline"
        >
          {params.category.replace(/-/g, ' ')}
        </Link>{' '}
        ›{' '}
        <Link
          href={`/inventory/${params.category}/${params.subcategory}`}
          className="text-blue-500 hover:underline"
        >
          {params.subcategory.replace(/-/g, ' ')}
        </Link>{' '}
        › <span>{machine.name}</span>
      </nav>

      <h1 className="text-3xl font-semibold mb-2">
        {machine.name}
      </h1>

      {/* Stock + Inline CTA */}
      <div className="flex items-center gap-4 mb-4">
        <p className="text-gray-700">
          <strong>Stock #:</strong> {machine.stockNumber}
        </p>

        <RequestQuoteSection
          stockNumber={machine.stockNumber}
          variant="inline"
        />
      </div>

      {machine.description && (
        <p className="mb-6 text-gray-800">
          {machine.description}
        </p>
      )}

      {images.length > 0 && <MachineImages images={images} />}

      {machine.specifications && (
        <section className="mt-8">
          <h2 className="font-medium mb-2">Specifications</h2>
          <pre className="bg-gray-50 p-4 border rounded text-sm">
            {machine.specifications}
          </pre>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="mt-10">
        <RequestQuoteSection stockNumber={machine.stockNumber} />
      </section>

      {/* Related Machines */}
      {relatedMachines.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">
            Related Machines
          </h2>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedMachines.map((m: any) => (
              <li key={m._id} className="border p-4 rounded">
                <Link
                  href={`/inventory/${params.category}/${params.subcategory}/${m.slug.current}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {m.name}
                </Link>
                {m.yearOfMfg && (
                  <p className="text-sm text-gray-600">
                    Year: {m.yearOfMfg}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
