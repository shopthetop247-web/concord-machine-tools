import Link from "next/link";
import { client } from "@/lib/sanityClient";

interface Category {
  _id: string;
  name: string; // <-- changed from title
  slug: {
    current: string;
  };
}

async function getCategories(): Promise<Category[]> {
  return client.fetch(`
    *[_type == "category"] | order(name asc) {  // <-- changed from title
      _id,
      name,   // <-- changed from title
      slug
    }
  `);
}

export default async function InventoryPage() {
  const categories = await getCategories();

  return (
    <main>
      <h1>Inventory</h1>

      {categories.length === 0 && (
        <p>No categories found. Please add categories in Sanity.</p>
      )}

      <ul style={{ marginTop: "24px" }}>
        {categories.map((category) => (
          <li key={category._id} style={{ marginBottom: "12px" }}>
            <Link
              href={`/inventory/${category.slug.current}`}
              style={{ fontSize: "18px", fontWeight: "bold" }}
            >
              {category.name} {/* <-- changed from title */}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

