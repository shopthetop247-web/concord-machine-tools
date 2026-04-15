import { client } from '@/lib/sanityClient';
import { Metadata } from 'next';
import Link from 'next/link';

interface PageProps {
  params: {
    brand: string;
    model: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const modelName = params.model.replace(/-/g, ' ');
  const brandName = params.brand.replace(/-/g, ' ');

  return {
    title: `Used ${brandName} ${modelName} CNC Machines for Sale | Concord Machine Tools`,
    description: `Browse used ${brandName} ${modelName} CNC machines for sale. View specifications, applications, and available inventory.`,
  };
}

export default async function ModelPage({ params }: PageProps) {
  const { brand, model } = params;

  const modelData = await client.fetch(
    `*[_type == "model" && slug.current == $model && brand->slug.current == $brand][0]{
      title,
      description,
      brand->{
        name,
        slug
      }
    }`,
    {
      brand,
      model,
    }
  );

  const brandName = modelData?.brand?.name || brand.replace(/-/g, ' ');
  const modelName = modelData?.title || model.replace(/-/g, ' ');

  const content = modelData?.description;

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">

      {/* HEADER */}
      <h1 className="text-3xl font-semibold mb-4">
        Used {brandName} {modelName} CNC Machines for Sale
      </h1>

      {/* SEO CONTENT */}
      {content && (
        <section className="max-w-4xl mb-10">
          <div
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </section>
      )}

      {/* OPTIONAL CTA */}
      <div className="mt-10 p-6 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">
          Looking for a {modelName}?
        </h3>
        <p className="text-gray-600 mb-4">
          We frequently stock used {brandName} {modelName} machines. Contact us for current availability.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-black text-white px-4 py-2 rounded"
        >
          Request Availability
        </Link>
      </div>

    </main>
  );
}
