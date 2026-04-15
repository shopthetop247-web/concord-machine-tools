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
<p>Haas CNC machines are among the most widely used machine tools in North America, known for their reliability, affordability, and ease of use. Whether you are expanding your shop or replacing older equipment, used Haas machines provide excellent value.</p>

<h3>Popular Haas Models</h3>
<p>The Haas VF Series vertical machining centers—such as the VF-2 and VF-3—are industry staples. Haas ST Series CNC lathes are also highly sought after for turning applications, while UMC 5-axis machines offer advanced multi-axis capabilities. EC Series horizontal machining centers provide high-volume production efficiency.</p>

<h3>Why Buy Used Haas Machines</h3>
<p>Used Haas machines are popular due to their lower cost, wide availability, and strong support network. Replacement parts and service are easy to obtain, making Haas an excellent choice for both small shops and large manufacturers.</p>

<h3>What to Look For</h3>
<p>When buying a used Haas CNC, consider machine hours, maintenance history, and control version. Proper inspection ensures long-term performance and reliability.</p>
`,

  mazak: `
<h2>Used Mazak CNC Machines for Sale</h2>
<p>Mazak is a global leader in advanced CNC technology, known for innovation and high-performance machining solutions. Used Mazak machines are ideal for shops requiring precision and productivity.</p>

<h3>Popular Mazak Models</h3>
<p>Mazak VCN vertical machining centers and Quick Turn lathes are widely used across industries. Integrex multi-tasking machines combine milling and turning for maximum efficiency.</p>

<h3>Why Buy Used Mazak</h3>
<p>Used Mazak equipment offers premium capabilities at a reduced cost. These machines are known for durability, advanced controls, and long service life.</p>

<h3>What to Look For</h3>
<p>Evaluate control systems, spindle condition, and service records when purchasing used Mazak machines.</p>
`,

  hurco: `
<h2>Used Hurco CNC Machines for Sale</h2>
<p>Hurco CNC machines are known for their user-friendly controls and strong machining performance. They are a popular choice for job shops and prototype work.</p>

<h3>Popular Hurco Models</h3>
<p>Hurco VMX vertical machining centers and TMX lathes are widely used for their flexibility and ease of programming.</p>

<h3>Why Buy Used Hurco</h3>
<p>Hurco machines offer fast setup times and intuitive controls, making them ideal for low-volume, high-mix production environments.</p>

<h3>What to Look For</h3>
<p>Check control condition, axis movement, and maintenance history when buying used Hurco equipment.</p>
`,

  makino: `
<h2>Used Makino CNC Machines for Sale</h2>
<p>Makino machines are known for precision, rigidity, and high-speed machining capabilities. They are widely used in aerospace, automotive, and die/mold industries.</p>

<h3>Popular Makino Models</h3>
<p>Makino PS and V series vertical machining centers and a-series horizontals are common in high-performance environments.</p>

<h3>Why Buy Used Makino</h3>
<p>Used Makino machines deliver exceptional accuracy and durability, making them a top choice for demanding applications.</p>

<h3>What to Look For</h3>
<p>Inspect spindle hours, accuracy, and machine calibration when evaluating used Makino equipment.</p>
`,

  doosan: `
<h2>Used DN Solutions (Doosan) CNC Machines for Sale</h2>
<p>DN Solutions, formerly Doosan Machine Tools, produces reliable and cost-effective CNC machines used worldwide.</p>

<h3>Popular Models</h3>
<p>Doosan Puma lathes and DNM vertical machining centers are widely used in production environments.</p>

<h3>Why Buy Used Doosan</h3>
<p>These machines offer strong performance and value, making them a popular choice for many manufacturers.</p>

<h3>What to Look For</h3>
<p>Review maintenance history, spindle condition, and tooling compatibility before purchasing.</p>
`,

  okuma: `
<h2>Used Okuma CNC Machines for Sale</h2>
<p>Okuma is known for high-quality CNC machines with integrated controls and exceptional reliability.</p>

<h3>Popular Okuma Models</h3>
<p>Okuma LB lathes and MB vertical machining centers are widely used across industries.</p>

<h3>Why Buy Used Okuma</h3>
<p>Okuma machines offer long-term durability and precision, making them a strong investment.</p>

<h3>What to Look For</h3>
<p>Evaluate control systems, spindle performance, and maintenance records when buying used Okuma machines.</p>
`,
};

/* ------------------------------------
   SEO METADATA
------------------------------------ */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const brandName = params.brand.replace(/-/g, ' ');
  return {
    title: `Used ${brandName} CNC Machines for Sale | Concord Machine Tools`,
    description: `Browse used ${brandName} CNC machines including machining centers and lathes. View inventory, pricing, and request a quote.`,
    alternates: {
      canonical: `/brands/${params.brand}`,
    },
    openGraph: {
      title: `Used ${brandName} CNC Machines`,
      description: `View our current inventory of used ${brandName} machines.`,
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

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <h1 className="text-3xl font-semibold mb-4">
        Used {brandName} CNC Machines for Sale
      </h1>

      {content && (
        <section className="mb-10 max-w-4xl">
          <div
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </section>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
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
    </main>
  );
}
