// app/brands/[brand]/page.tsx
export const revalidate = 60;

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
  images?: { asset: { _ref: string } }[];
  slug: { current: string };
  category: { slug: { current: string } };
  subcategory: { slug: { current: string } };
}

interface Brand {
  name: string;
  description?: string;
  website?: string;
  slug: string;
}

interface PageProps {
  params: {
    brand: string;
  };
}

const builder = imageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source).auto('format').url();

/* ------------------------------------
   FALLBACK SEO CONTENT (KEY BRANDS)
------------------------------------ */
const brandContentMap: Record<string, string> = {
  haas: `
<h2>Used Haas CNC Machines for Sale</h2>
<p>Haas CNC machines are among the most widely used machine tools in North America, known for their reliability, affordability, and ease of use.</p>

<h3>Popular Models</h3>
<p>VF Series mills, ST lathes, UMC 5-axis machines, and EC horizontal machining centers are widely used in production environments.</p>

<h3>Why Buy Used Haas</h3>
<p>Haas machines offer excellent value, strong parts availability, and widespread service support across the United States.</p>

<h3>What to Look For</h3>
<p>Check machine hours, spindle condition, and control version before purchasing.</p>
`,

  mazak: `
<h2>Used Mazak CNC Machines for Sale</h2>
<p>Mazak is a global leader in advanced CNC machining technology and multi-tasking equipment.</p>

<h3>Popular Models</h3>
<p>VCN machining centers, Quick Turn lathes, and Integrex multi-tasking machines.</p>

<h3>Why Buy Used Mazak</h3>
<p>High precision, strong durability, and advanced control systems.</p>
`,

  hurco: `
<h2>Used Hurco CNC Machines for Sale</h2>
<p>Hurco machines are known for user-friendly controls and fast programming.</p>
`,

  makino: `
<h2>Used Makino CNC Machines for Sale</h2>
<p>Makino delivers high-precision machining for aerospace and die/mold industries.</p>
`,

  doosan: `
<h2>Used DN Solutions (Doosan) CNC Machines for Sale</h2>
<p>Doosan (DN Solutions) offers reliable and cost-effective CNC machining solutions.</p>
`,

  okuma: `
<h2>Used Okuma CNC Machines for Sale</h2>
<p>Okuma machines are known for reliability, integrated controls, and long-term durability.</p>
`,
};

/* ------------------------------------
   SEO METADATA
------------------------------------ */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const brandName = params.brand.replace(/-/g, ' ');

  const formattedBrand =
    brandName.charAt(0).toUpperCase() + brandName.slice(1);

  return {
    title: `Used ${formattedBrand} CNC Machines for Sale | Concord Machine Tools`,
    description: `Browse used ${formattedBrand} CNC machines including machining centers and lathes. View inventory, pricing, and request a quote.`,
    alternates: {
      canonical: `/brands/${params.brand}`,
    },
    openGraph: {
      title: `Used ${formattedBrand} CNC Machines`,
      description: `View our current inventory of used ${formattedBrand} machines.`,
      type: 'website',
    },
  };
}

/* ------------------------------------
   PAGE COMPONENT
------------------------------------ */
export default async function BrandPage({ params }: PageProps) {
  const brandSlug = params.brand;

  const brand: Brand | null = await client.fetch(
    `*[_type == "brand" && slug.current == $slug][0]{
      name,
      description,
      website,
      slug
    }`,
    { slug: brandSlug }
  );

  const brandName = brand?.name || brandSlug.replace(/-/g, ' ');

  const machines: Machine[] = await client.fetch(
    `*[
      _type == "machine" &&
      !(_id in path("drafts.**")) &&
      lower(brand) == lower($brand)
    ]{
      _id,
      name,
      brand,
      yearOfMfg,
      stockNumber,
      images[] { asset-> },
      slug,
      category->{ slug },
      subcategory->{ slug }
    } | order(yearOfMfg desc, name asc)`,
    { brand: brandName }
  );

  const fallbackContent = brandContentMap[brandSlug.toLowerCase()];
  const content = brand?.description || fallbackContent;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Are ${brandName} CNC machines reliable?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${brandName} machines are widely used in manufacturing and are known for reliability and long service life.`,
        },
      },
      {
        '@type': 'Question',
        name: `How much does a used ${brandName} machine cost?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Pricing varies depending on model, year, and condition. Contact us for current inventory and pricing.`,
        },
      },
    ],
  };

  const formattedBrand =
    brandName.charAt(0).toUpperCase() + brandName.slice(1);

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">

      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* HEADER */}
      <h1 className="text-3xl font-semibold mb-2">
        Used {formattedBrand} CNC Machines for Sale
      </h1>

      {/* Official Website Link */}
      {brand?.website && (
        <a
          href={brand.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline font-medium block mb-6"
        >
          Visit official {formattedBrand} website →
        </a>
      )}

      {/* =========================
          MACHINES FIRST (IMPORTANT)
      ========================= */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {machines.map((machine) => {
          const imageUrl = machine.images?.[0]
            ? urlFor(machine.images[0])
            : '/placeholder.jpg';

          return (
            <Link
              key={machine._id}
              href={`/inventory/${machine.category.slug.current}/${machine.subcategory.slug.current}/${machine.slug.current}`}
              className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="w-full h-48">
                <img
                  src={imageUrl}
                  alt={`${machine.name} for sale`}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4 bg-white">
                <h2 className="text-lg font-medium mb-1">{machine.name}</h2>
                <p className="text-sm text-gray-600">
                  {machine.yearOfMfg && <>Year: {machine.yearOfMfg} &nbsp;|&nbsp;</>}
                  Stock #: {machine.stockNumber}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* =========================
          SEO CONTENT BELOW GRID
      ========================= */}
      {content && (
        <section className="max-w-4xl">
          <div
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </section>
      )}

    </main>
  );
}
