import Link from "next/link";
import { client } from "@/lib/sanityClient";

interface Machine {
  _id: string;
  name: string;
  slug: { current: string };
}

interface SubcategoryPageProps {
  params: { category: string; subcategory: string };
}

// Pre-generate all subcategory paths for SSG
export async function generateStaticParams() {
  const subcategories: { slug: { current: string }; category: { slug: { current: string } } }[] =
    await client.fetch(`
      *[_type=="subcategory"]{
        slug,
        category->{slug}
      }
    `);

  return subcategories.map((sub) => ({
    category: sub.category.slug.current,
    subcategory: sub.slug.current,
  }));
}

// Fetch machines for this subcategory
async function getMachines(categorySlug: string, subcategorySlug: string): Promise<Machine[]> {
  return client.fetch(
    `
    *[_type=="machine" && references(*[_type=="subcategory" && slug.current==$subcategorySlug]._id)]{
      _id,
      name,
      slug
    } | order(name asc)
    `,
    { subcategorySlug }
  );
}

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  const { category, subcategory } = params;
  const machines = await getMachines(category, subcategory);

  if (!machines || machines.length === 0) {
    return <p>No machines found in this subcategory.</p>;
  }

  return (
    <main style={{ padding: "24px" }}>
      <h1>
        Machines in {subcategory.replace(/-/g, " ")} ({category.replace(/-/g, " ")})
      </h1>

      <ul style={{ marginTop: "16px" }}>
        {machines.map((machine) => (
          <li key={machine._id} style={{ marginBottom: "12px" }}>
            <Link href={`/inventory/${category}/${subcategory}/${machine.slug.current}`}>
              {machine.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
