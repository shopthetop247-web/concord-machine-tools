export const dynamic = 'force-dynamic';

import { client } from '@/lib/sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import Link from 'next/link';
import { Metadata } from 'next';

interface Machine {
  _id: string;
  name: string;
  brand?: string;
  yearOfMfg?: number;
  stockNumber: string;
  images?: any[];
  slug: { current: string };
}

interface PageProps {
  params: {
    category: string;
    subcategory: string;
  };
  searchParams: {
    brand?: string;
    year?: string;
  };
}

const builder = imageUrlBuilder(client);
const urlFor = (source: any) =>
  builder.image(source).auto('format').url();

/* ------------------------------------
   SEO METADATA
------------------------------------ */
export async function generateMetadata(
  { params, searchParams }: PageProps
): Promise<Metadata> {
  const subcategoryName = params.subcategory.replace(/-/g, ' ');
  const filters = [];

  if (searchParams.brand) filters.push(searchParams.brand);
  if (searchParams.year) filters.push(searchParams.year);

  const filterText = filters.length ? ` – ${filters.join(', ')}` : '';

  return {
    title: `${subcategoryName}${filterText} for Sale | Used Industrial Machinery`,
    description: `Browse ${subcategoryName} machines${filterText}. View photos, specifications, and request a quote.`,
    alternates: {
      canonical: `/inventory/${params.category}/${params.subcategory}`,
    },
  };
}

/* ------------------------------------
   PAGE
------------------------------------ */
export default async function SubcategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { category, subcategory } = params;
  const { brand, year } = searchParams;

  const machines: Machine[] = await client.fetch(
    `*[_type == "machine"
      && subcategory._ref in *[_type=="subcategory" && slug.current == $subcategorySlug]._id
      && (!defined($brand) || brand == $brand)
      && (!defined($year) || yearOfMfg == $year)
    ]
    | order(yearOfMfg desc, brand asc){
      _id,
      name,
      brand,
      yearOfMfg,
      stockNumber,
      images,
      slug
    }`,
    {
      subcategorySlug: subcategory,
      brand,
      year: year ? Number(year) : undefined,
    }
  );

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold mb-6 capitalize">
        {subcategory.replace(/-/g, ' ')}
      </h1>

      {/* FILTER BAR */}
      <form className="flex flex-wrap gap-4 mb-8">
        <select
          name="brand"
          defaultValue={brand || ''}
          className="border rounded px-3 py-2"
        >
          <option value="">All Brands</option>
          {[...new Set(machines.map(m => m.brand).filter(Boolean))].map(
            (b) => (
              <option key={b} value={b!}>
                {b}
              </option>
            )
          )}
        </select>

        <select
          name="year"
          defaultValue={year || ''}
          className="border rounded px-3 py-2"
        >
          <option value="">All Years</option>
          {[...new Set(machines.map(m => m.yearOfMfg).filter(Boolean))]
            .sort((a, b) => b! - a!)
            .map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
        </select>

        <button
          type="submit"
          className="bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800"
        >
          Apply Filters
        </button>
      </form>

      {/* GRID */}
      {machines.length === 0 ? (
        <p>No machines found for the selected filters.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {machines.map((machine) => {
            const imageUrl = machine.images?.[0]
              ? urlFor(machine.images[0])
              : '/placeholder.jpg';

            return (
              <Link
                key={machine._id}
                href={`/inventory/${category}/${subcategory}/${machine.slug.current}`}
                className="block border rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <div className="w-full h-48">
                  <img
                    src={imageUrl}
                    alt={`${machine.name} for sale`}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-medium">
                    {machine.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {machine.yearOfMfg && <>Year: {machine.yearOfMfg} | </>}
                    Stock #: {machine.stockNumber}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
