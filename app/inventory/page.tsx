import { client } from '@/lib/sanityClient';
import Link from 'next/link';

interface Subcategory {
  title: string;
  slug: string;
}

interface Category {
  title: string;
  slug: string;
  subcategories: Subcategory[];
}

// Define the column order
const categoryOrder = ['CNC Machinery', 'Fabricating & Stamping', 'Manual Machinery'];

export default async function InventoryPage() {
  // Fetch distinct categories and their subcategories from machine documents
  const rawData: { category: string; subcategory: string; subcategorySlug: string }[] = await client.fetch(
    `*[_type == "machine" && defined(category) && defined(subcategory)]{
      "category": category,
      "subcategory": subcategory,
      "subcategorySlug": subcategorySlug.current
    }`
  );

  // Group by category
  const categoriesMap = new Map<string, Category>();
  rawData.forEach((item) => {
    if (!categoriesMap.has(item.category)) {
      categoriesMap.set(item.category, { title: item.category, slug: item.category.toLowerCase().replace(/\s+/g, '-'), subcategories: [] });
    }
    const cat = categoriesMap.get(item.category)!;
    // Add subcategory if not already present
    if (!cat.subcategories.some((sub) => sub.title === item.subcategory)) {
      cat.subcategories.push({ title: item.subcategory, slug: item.subcategorySlug });
    }
  });

  // Convert to array and reorder
  const categories = Array.from(categoriesMap.values()).sort(
    (a, b) => categoryOrder.indexOf(a.title) - categoryOrder.indexOf(b.title)
  );

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Inventory</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div key={cat.title}>
            <h2 className="text-2xl font-semibold mb-4">{cat.title}</h2>
            {cat.subcategories.length > 0 ? (
              <ul className="space-y-2">
                {cat.subcategories.map((sub) => (
                  <li key={sub.slug}>
                    <Link
                      href={`/inventory/${cat.slug}/${sub.slug}`}
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
