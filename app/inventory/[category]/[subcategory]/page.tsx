"use client"; // Optional, only needed if you use hooks

import Link from "next/link";
import { client } from "@/lib/sanityClient";

interface Subcategory {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
}

interface CategoryPageProps {
  params: { category: string };
}

// Optional: generate static paths so Next.js pre-renders each category
export async function generateStaticParams() {
  const categories: { slug: { current: string } }[] = await client.fetch(`
    *[_type == "category"]{
      slug
    }
  `);

  return categories.map((cat) => ({
    category: cat.slug.current,
  }));
}

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
      <h1>Subcategories in {category.replace(/-/g, " ")}</h1>
      <ul style={{ marginTop: "16px" }}>
        {subcategories.map((subcat) => (
          <li key={subcat._id} style={{ marginBottom: "12px" }}>
            <Link href={`/inventory/${category}/${subcat.slug.current}`}>
              {subcat.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
