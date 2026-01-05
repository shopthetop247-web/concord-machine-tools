import Link from "next/link";
import { client } from "@/lib/sanityClient";

interface Subcategory {
  _id: string;
  name: string;
  slug: { current: string };
}

interface CategoryPageProps {
  params: { category: string };
}

// Pre-generate all category paths
export async function generateStaticParams() {
  const categories: { slug: { current: string } }[] = await client.fetch(`
    *[_type=="category" && defined(slug.current)]{
      slug
    }
  `);

  return categories.map((cat) => ({
    category: cat.slug.current,
  }));
}

// Fetch subcategories for this category
async function getSubcategories(categorySlug: string): Promise<Subcategory[]> {
  return client.fetch(
    `
    *[_type=="subcategory" && references(*[_type=="category" && slug.current==$categorySlug]._id)]{
      _id,
      name,
      slug
    } | order(name asc)
    `,
    { categorySlug }
  );
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params;
  const subcategories = await getSubcategories(category);

  if (!subcategories || subcategories.length === 0) {
    return <p>No subcategories found for this category.</p>;
  }

  return (
    <main style={{ padding: "24px" }}>
      <h1 style={{ marginBottom: "24px" }}>
        Subcategories in {category.replace(/-/g, " ")}
      </h1>

      <ul style={{ listStyle: "disc", paddingLeft: "20px" }}>
        {subcategories.map((sub) => (
          <li key={sub._id} style={{ marginBottom: "12px" }}>
            <Link
              href={`/inventory/${category}/${sub.slug.current}`}
              style={{ fontSize: "18px", fontWeight: "bold" }}
            >
              {sub.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
