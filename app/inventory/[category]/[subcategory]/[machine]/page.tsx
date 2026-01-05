import Link from "next/link";
import { client } from "@/lib/sanityClient";

interface Subcategory {
  _id: string;
  name: string;
  slug: { current: string };
}

interface CategoryPageProps {
  params: { category: string }; // slug of the category
}

async function getSubcategories(categorySlug: string): Promise<Subcategory[]> {
  return client.fetch(`
    *[_type == "subcategory" && references(*[_type=="category" && slug.current == $slug]._id)] | order(name asc) {
      _id,
      name,
      slug
    }
  `, { slug: categorySlug });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params;
  const subcategories = await getSubcategories(category);

  if (subcategories.length === 0) {
    return <p>No subcategories found for this category.</p>;
  }

  return (
    <main>
      <h1>Subcategories</h1>
      <ul>
        {subcategories.map((subcat) => (
          <li key={subcat._id}>
            <Link href={`/inventory/${category}/${subcat.slug.current}`}>
              {subcat.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
