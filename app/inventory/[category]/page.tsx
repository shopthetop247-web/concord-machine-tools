import { client } from '@/lib/sanityClient';
import Link from 'next/link';

interface Subcategory {
  _id: string;
  name: string;
  slug: { current: string };
}

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Fetch subcategories for this category from Sanity
  const subcategories: Subcategory[] = await client.fetch(
    `*[_type == "subcategory" && category->slug.current == $category]{
      _id,
      name,
      slug
    }`,
    { category: params.category }
  );

  if (!subcategories || subcategories.length === 0) {
    return <p className="p-6">No subcategories found for this category.</p>;
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold mb-6">
        {params.category.replace(/-/g, ' ')}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {subcategories.map((subcat) => (
          <Link
            key={subcat._id}
            href={`/inventory/${params.category}/${subcat.slug.current}`}
            className="block p-6 bg-gray-50 rounded shadow hover:shadow-lg hover:bg-gray-100 transition"
          >
            <h2 className="text-xl font-medium">{subcat.name}</h2>
          </Link>
        ))}
      </div>
    </main>
  );
}
