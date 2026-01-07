import { client } from '@/lib/sanityClient';
import Link from 'next/link';

interface Subcategory {
  _id: string;
  name: string;
  slug: { current: string };
}

interface Category {
  _id: string;
  name: string;
  slug: { current: string };
  subcategories: Subcategory[];
}

export default async function InventoryPage() {
  // Fetch categories with their subcategories
  const categories: Category[] = await client.fetch(`
    *[_type == "category" && !defined(parent)]{
      _id,
      name,
      "slug": slug,
      "subcategories": *[_type == "category" && parent._ref == ^._id]{
        _id,
        name,
        "slug": slug
      }
    }
  `);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-12 text-center">
        Inventory Categories
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {categories.map((category) => (
          <div key={category._id}>
            <h2 className="text-2xl font-semibold mb-4">{category.name}</h2>
            {category.subcategories.length > 0 ? (
              <ul className="space-y-2">
                {category.subcategories.map((subcat) => (
                  <li key={subcat._id}>
                    <Link
                      href={`/inventory/${category.slug.current}/${subcat.slug.current}`}
                      className="text-blue-500 hover:text-blue-400 transition-colors duration-200"
                    >
                      {subcat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No subcategories</p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

