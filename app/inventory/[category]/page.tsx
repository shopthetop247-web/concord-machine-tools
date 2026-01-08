// app/inventory/[category]/page.tsx
export const revalidate = 60;

import { client } from '@/lib/sanityClient';
import Link from 'next/link';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Subcategory {
  _id: string;
  name: string;
  slug: { current: string };
}

interface Category {
  name: string;
  slug: { current: string };
}

interface PageProps {
  params: {
    category: string;
  };
}

/* ------------------------------------
   SEO METADATA
------------------------------------ */
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const categoryName = params.category.replace(/-/g, ' ');

  return {
    title: `${categoryName} for Sale | Used Industrial Machinery`,
    description: `Browse available ${categoryName} including CNC and industrial machines. View subcategories, specifications, and request a quote.`,
    alternates: {
      canonical: `/inventory/${params.category}`,
    },
    openGraph: {
      title: `${categoryName} for Sale`,
      description: `View our current inventory of ${categoryName}.`,
      type: 'website',
    },
  };
}

/* ------------------------------------
   PAGE
------------------------------------ */
export default async function CategoryPage({ params }: PageProps) {
  const { category } = params;

  const categoryData: Category | null = await client.fetch(
    `*[_type == "category" && slug.current == $slug][0]{
      name,
      slug
    }`,
    { slug: category }
  );

  if (!categoryData) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold mb-4">Category Not Found</h1>
        <p className="text-gray-700">
          The requested category does not exist.
        </p>
      </main>
    );
  }

  const subcategories: Subcategory[] = await client.fetch(
    `*[_type == "subcategory" && parentCategory->slug.current == $slug] | order(name asc) {
      _id,
      name,
      slug
    }`,
    { slug: category }
  );

  /* ------------------------------------
     STRUCTURED DATA (JSON-LD)
  ------------------------------------ */
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${categoryData.name} Subcategories`,
    itemListElement: subcategories.map((sub, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: sub.name,
      url: `https://www.concordmachinetools.com/inventory/${category}/${sub.slug.current}`,
    })),
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Title */}
      <h1 className="text-3xl font-semibold mb-4">
        {categoryData.name}
      </h1>

      {/* Intro */}
      <p className="text-gray-700 mb-8 max-w-3xl">
        Browse our available {categoryData.name.toLowerCase()}.
        Select a subcategory below to view current machines in stock.
      </p>

      {/* Subcategories */}
      {subcategories.length === 0 ? (
        <p className="text-gray-600">
          No subcategories found for this category.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {subcategories.map((sub) => (
            <Link
              key={sub._id}
              href={`/inventory/${category}/${sub.slug.current}`}
              className="block border rounded-lg p-5 bg-white hover:shadow-md transition-shadow"
            >
              <h2 className="text-lg font-medium text-slate-900 mb-1">
                {sub.name}
              </h2>
              <p className="text-sm text-gray-600">
                View available machines
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

