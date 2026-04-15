import { client } from '@/lib/sanityClient';
import Link from 'next/link';
import { Metadata } from 'next';

interface PageProps {
  params: {
    brand: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const brandName = params.brand.replace(/-/g, ' ');

  return {
    title: `Used ${brandName} CNC Machine Models | Concord Machine Tools`,
    description: `Browse all available used ${brandName} CNC machine models including VF series, ST lathes, and more.`,
  };
}

export default async function BrandModelsPage({ params }: PageProps) {
  const brandSlug = params.brand;

  const machines = await client.fetch(
    `*[
      _type == "machine" &&
      lower(brand) == lower($brand)
    ]{
      name
    }`,
    { brand: brandSlug.replace(/-/g, ' ') }
  );

  // Extract model names (VF-2, ST-20, etc.)
  const modelsSet = new Set<string>();

  machines.forEach((m: any) => {
    const name = m.name || '';
    const match = name.match(/(VF-\d+|ST-\d+|UMC-\d+|EC-\d+|LB\d+|DNM\s?\d+|a\d+|i-\d+|QT-\d+)/i);
    if (match) {
      modelsSet.add(match[0].replace(/\s+/g, ''));
    }
  });

  const models = Array.from(modelsSet).sort();

  const brandName = brandSlug.replace(/-/g, ' ');

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">

      <h1 className="text-3xl font-semibold mb-6">
        Used {brandName} CNC Machine Models
      </h1>

      <p className="text-gray-600 mb-8 max-w-3xl">
        Browse available used {brandName} CNC machine models currently in inventory or recently sold.
      </p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {models.map((model) => {
          const slug = model.toLowerCase().replace(/\s+/g, '-');

          return (
            <Link
              key={model}
              href={`/models/${brandSlug}/${slug}`}
              className="border rounded-lg p-4 hover:shadow-md transition"
            >
              <h2 className="text-lg font-medium">{model}</h2>
              <p className="text-sm text-gray-500 mt-1">
                View available inventory & details
              </p>
            </Link>
          );
        })}
      </div>

    </main>
  );
}
