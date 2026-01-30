// app/inventory/page.tsx
export const revalidate = 60;

import { client } from '@/lib/sanityClient';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Used CNC Machines Inventory | CNC Mills, Lathes & Industrial Equipment',
  description:
    'Browse our current inventory of used CNC machines for sale, including CNC mills, lathes, machining centers, and metalworking equipment from trusted brands. Inventory updated frequently.',
  keywords: [
    'used CNC machines inventory',
    'used CNC machines for sale',
    'CNC mills for sale',
    'used CNC lathes',
    'used machining centers',
    'industrial machinery inventory',
    'metalworking equipment for sale',
    'used Haas CNC machines',
    'used Mazak CNC machines',
    'used Okuma CNC machines',
    'Concord Machine Tools',
  ],
  alternates: {
    canonical: 'https://www.concordmt.com/inventory',
  },
};

interface Category {
  _id: string;
  name: string;
  slug: { current: string };
}

interface Subcategory {
  _id: string;
  name: string;
  slug: { current: string };
  parentCategory: { _ref: string };
}

export default async function InventoryPage() {
  // Fetch all categories
  const categories: Category[] = await client.fetch(`
    *[_type == "category"]{
      _id,
      name,
      slug
    }
  `);

  // Fetch all subcategories
  const subcategories: Subcategory[] = await client.fetch(`
    *[_type == "subcategory"]{
      _id,
      name,
      slug,
      parentCategory
    }
  `);

  interface Machine {
  _id: string;
  title: string;
  slug: { current: string };
  _createdAt: string;
}

const recentMachines: Machine[] = await client.fetch(`
  *[_type == "machine"] | order(_createdAt desc)[0...6]{
    _id,
    title,
    slug,
    _createdAt
  }
`);


  // Create a map from category ID → subcategories
  const subcategoriesByCategory: Record<string, Subcategory[]> = {};
  subcategories.forEach((subcat) => {
    const parentId = subcat.parentCategory._ref;
    if (!subcategoriesByCategory[parentId]) {
      subcategoriesByCategory[parentId] = [];
    }
    subcategoriesByCategory[parentId].push(subcat);
  });

  // Determine column order
  const columnOrder = [
    'CNC Machinery',
    'Fabricating & Stamping',
    'Manual Machinery',
  ];

  const sortedCategories = columnOrder
    .map((name) => categories.find((c) => c.name === name))
    .filter(Boolean) as Category[];

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold mb-6">Used Machines & Industrial Equipment Inventory</h1>

      {/* SEO Intro Copy */}
      <div className="max-w-4xl mb-10 text-slate-700 leading-relaxed space-y-4">
        <p>
          Browse our current inventory of used CNC machines for sale, including CNC
          machining centers, lathes, mills, turning centers, and metalworking equipment.
          Concord Machine Tools offers a continually changing selection of quality
          pre-owned industrial machinery sourced from shops across the United States.
        </p>

        <p>
          Our used CNC inventory is updated frequently as machines are bought and sold,
          so availability can change daily. You’ll find equipment from leading
          manufacturers such as Haas, Mazak, Okuma, Doosan, Hurco, and other trusted
          brands—ranging from single machines to complete shop packages.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {sortedCategories.map((cat) => (
          <div key={cat._id}>
            <h2 className="text-xl font-semibold mb-4">{cat.name}</h2>
            <ul className="space-y-2">
              {subcategoriesByCategory[cat._id]?.map((sub) => (
                <li key={sub._id}>
                  <Link
                    href={`/inventory/${cat.slug.current}/${sub.slug.current}`}
                    className="text-blue-500 hover:text-blue-400"
                  >
                    {sub.name}
                  </Link>
                </li>
              )) ?? <li className="text-gray-500 italic">No subcategories</li>}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
  {recentMachines.length > 0 && (
  <section className="mt-16">
    <h2 className="text-2xl font-semibold mb-6">
      Recently Added CNC Machines
    </h2>

    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recentMachines.map((machine) => (
        <li
          key={machine._id}
          className="border rounded-md p-4 hover:shadow-md transition"
        >
          <Link
            href={`/machines/${machine.slug.current}`}
            className="text-blue-600 hover:underline font-medium"
          >
            {machine.title}
          </Link>

          <p className="text-sm text-gray-500 mt-1">
            Newly listed
          </p>
        </li>
      ))}
    </ul>
  </section>
)}

}
