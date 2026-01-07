import { client } from '@/lib/sanityClient';
import Link from 'next/link';

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  subcategories?: { title: string; slug: { current: string } }[];
}

// Optional: reorder main categories for desired column layout
const categoryOrder = ['CNC Machinery', 'Fabricating & Stamping', 'Manual Machinery'];

export default async function InventoryPage() {
  // Fetch main categories and their subcategories from Sanity
  const categories: Category[] = await client.fetch(
    `*[_type == "category" && defined(title)]{
      _id,
      title,
      slug,
      "subcategories": subcategories[]->{title, slug}
    }`
  );

  // Reorder categories based on preferred layout
  const orderedCategories = categoryOrder
    .map((title) => categories.find((cat) => cat.title === title))
    .filter(Boolean) as Category[];

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Inventory</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {orderedCategories.map((cat) => (
          <div key={cat._id}>
            <h2 className="text-2xl font-semibold mb-4">{cat.title}</h2>
            {cat.subcategories && cat.subcategories.length > 0 ? (
              <ul className="space-y-2">
                {cat.subcategories.map((sub) => (
                  <li key={sub.slug.current}>
                    <Link
                      href={`/inventory/${cat.slug.current}/${sub.slug.current}`}
                      className="text-blue-600 hover:text-blue-400"
                    >
                      {sub.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No subcategories available.</p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
