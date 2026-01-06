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
  const subcategories: {
    slug: { current: string };
    category?: { slug?: { current: string } };
  }[] = await client.fetch(`
    *[_type=="subcategory" && defined(category._ref) && defined(slug.current)]{
      slug,
      category->{slug}
    }
  `);

  // Filter out invalid subcategories
  return subcategories
    .filter((sub) => sub.slug?.current && sub.category?.slug?.current)
    .map((sub) => ({
      category: sub.category!.slug!.current,
      subcategory: sub.slug!.current,
    }));
}

// Fetch machines for this subcategory
async function getMachines(subcategorySlug: string): Promise<Machine[]> {
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
  if (!params || !params.subcategory) {
    return <p>Invalid subcategory</p>;
  }

  const machines = await getMachines(params.subcategory);

  return (
    <main style={{ padding: "24px" }}>
      <h1>
        Machines in {params.subcategory.replace(/-/g, " ")} ({params.category.replace(/-/g, " ")})
      </h1>

      {machines.length === 0 ? (
        <p>No machines found in this subcategory.</p>
      ) : (
        <ul style={{ marginTop: "16px" }}>
          {machines.map((machine) => (
            <li key={machine._id} style={{ marginBottom: "12px" }}>
              <Link href={`/inventory/${params.category}/${params.subcategory}/${machine.slug.current}`}>
                {machine.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
