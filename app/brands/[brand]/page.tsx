export const revalidate = 60;

import { client } from '@/lib/sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import Link from 'next/link';
import { Metadata } from 'next';

interface Machine {
  _id: string;
  name: string;
  model?: string;
  brand?: string;
  yearOfMfg?: number;
  stockNumber: string;
  images?: any[];
  slug: { current: string };
  category: { slug: { current: string } };
  subcategory: { slug: { current: string } };
}

interface BrandSEO {
  productType: string;
  description: string;
  introduction: string;
}

const BASE_URL = 'https://www.concordmt.com';

const builder = imageUrlBuilder(client);

const urlFor = (source: any) =>
  builder.image(source).auto('format').url();

/* ------------------------------------
   SLUG NORMALIZATION
------------------------------------ */

const slugify = (str: string) =>
  str
    ?.toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/* ------------------------------------
   BRAND-SPECIFIC SEO CONFIGURATION
------------------------------------ */

const brandSEOConfig: Record<string, BrandSEO> = {

  /* CNC MACHINE MANUFACTURERS */

  haas: {
    productType: 'CNC Machines',
    description:
      'Browse used Haas CNC machines for sale, including VF vertical machining centers, ST CNC lathes, and UMC 5-axis machines. Buy, sell, or source used Haas equipment with Concord Machine Tools.',
    introduction:
      'Browse available used Haas CNC machines, including vertical machining centers, CNC lathes, and other manufacturing equipment.',
  },

  mazak: {
    productType: 'CNC Machines',
    description:
      'Browse used Mazak CNC machines for sale, including Quick Turn lathes, VCN vertical machining centers, HCN horizontal machining centers, and Integrex multi-tasking machines. Contact Concord Machine Tools to buy, sell, or source used Mazak equipment.',
    introduction:
      'Browse available used Mazak CNC machines, including Quick Turn lathes, VCN vertical machining centers, HCN horizontal machining centers, and Integrex multi-tasking machines.',
  },

  hurco: {
    productType: 'CNC Machines',
    description:
      'Browse used Hurco CNC machines for sale, including vertical machining centers, CNC mills, and turning centers. Contact Concord Machine Tools to buy, sell, or source used Hurco machinery.',
    introduction:
      'Browse available used Hurco CNC machines, including vertical machining centers, CNC mills, and turning centers.',
  },

  makino: {
    productType: 'CNC Machines',
    description:
      'Browse used Makino CNC machines for sale, including vertical and horizontal machining centers and high-precision machining equipment. Contact Concord Machine Tools to buy, sell, or source used Makino machinery.',
    introduction:
      'Browse available used Makino CNC machines, including vertical and horizontal machining centers and precision manufacturing equipment.',
  },

  doosan: {
    productType: 'CNC Machines',
    description:
      'Browse used Doosan and DN Solutions CNC machines for sale, including CNC lathes, turning centers, and machining centers. Contact Concord Machine Tools to buy, sell, or source used equipment.',
    introduction:
      'Browse available used Doosan and DN Solutions CNC machines, including turning centers, CNC lathes, and machining centers.',
  },

  okuma: {
    productType: 'CNC Machines',
    description:
      'Browse used Okuma CNC machines for sale, including CNC lathes, vertical machining centers, and horizontal machining centers. Contact Concord Machine Tools to buy, sell, or source used Okuma machinery.',
    introduction:
      'Browse available used Okuma CNC machines, including CNC lathes, vertical machining centers, and horizontal machining centers.',
  },

  milltronics: {
    productType: 'CNC Machines',
    description:
      'Browse used Milltronics CNC machines for sale, including vertical machining centers, CNC bed mills, and turning centers. Contact Concord Machine Tools to buy, sell, or source used Milltronics equipment.',
    introduction:
      'Browse used Milltronics CNC machining centers, milling machines, and turning equipment for manufacturing and job shop applications.',
  },

  'yama-seiki': {
    productType: 'CNC Machines',
    description:
      'Browse used Yama Seiki CNC machines for sale, including vertical machining centers, horizontal machining centers, and CNC turning equipment. Contact Concord Machine Tools to buy, sell, or source used Yama Seiki machinery.',
    introduction:
      'Explore available used Yama Seiki CNC machining centers and turning equipment for industrial manufacturing applications.',
  },

  toyoda: {
    productType: 'CNC Machines',
    description:
      'Browse used Toyoda CNC machines for sale, including horizontal machining centers, vertical machining centers, and precision machining equipment. Contact Concord Machine Tools to buy, sell, or source used Toyoda machinery.',
    introduction:
      'Browse used Toyoda CNC machining centers and industrial machine tools, including horizontal and vertical machining equipment.',
  },

  fidia: {
    productType: 'CNC Machining Centers',
    description:
      'Browse used Fidia CNC machining centers and high-speed milling machines for sale. Contact Concord Machine Tools to buy, sell, or source used Fidia equipment for precision manufacturing applications.',
    introduction:
      'Explore used Fidia CNC machining centers and high-speed milling equipment designed for precision machining and complex manufacturing applications.',
  },

  /* MANUAL MACHINERY AND GRINDING */

  devlieg: {
    productType: 'Machinery',
    description:
      'Browse used DeVlieg machine tools and industrial machinery for sale. Contact Concord Machine Tools to buy, sell, or source DeVlieg equipment.',
    introduction:
      'Explore used DeVlieg machinery and machine tools. Contact Concord Machine Tools for available equipment or assistance locating specific DeVlieg models.',
  },

  bridgeport: {
    productType: 'Milling Machines',
    description:
      'Browse used Bridgeport milling machines for sale, including manual and CNC milling equipment. Contact Concord Machine Tools to buy, sell, or source Bridgeport machinery.',
    introduction:
      'Browse used Bridgeport milling machines, including manual mills and CNC-equipped models.',
  },

  moore: {
    productType: 'Jig Grinders',
    description:
      'Browse used Moore jig grinders and precision grinding equipment for sale. Contact Concord Machine Tools to buy, sell, or source Moore machinery.',
    introduction:
      'Explore used Moore jig grinders and precision machine tools for demanding manufacturing and toolroom applications.',
  },

  acer: {
    productType: 'Surface Grinders',
    description:
      'Browse used Acer surface grinders and industrial grinding machines for sale. Contact Concord Machine Tools to buy, sell, or source Acer grinding equipment.',
    introduction:
      'Browse used Acer surface grinders and precision grinding equipment for machine shops and industrial manufacturing facilities.',
  },

  'giddings-lewis': {
    productType: 'Machine Tools',
    description:
      'Browse used Giddings & Lewis machine tools for sale, including horizontal boring mills, floor-type boring mills, and large-capacity machining equipment. Contact Concord Machine Tools to buy, sell, or source Giddings & Lewis machinery.',
    introduction:
      'Explore used Giddings & Lewis machine tools, including horizontal boring mills and large-capacity industrial machining equipment.',
  },

  'giddings-and-lewis': {
    productType: 'Machine Tools',
    description:
      'Browse used Giddings & Lewis machine tools for sale, including horizontal boring mills, floor-type boring mills, and large-capacity machining equipment. Contact Concord Machine Tools to buy, sell, or source Giddings & Lewis machinery.',
    introduction:
      'Explore used Giddings & Lewis machine tools, including horizontal boring mills and large-capacity industrial machining equipment.',
  },

  /* SPECIALIZED INDUSTRIAL EQUIPMENT */

  'hyd-mech': {
    productType: 'Bandsaws',
    description:
      'Browse used Hyd-Mech bandsaws for sale, including industrial metal-cutting saws. Contact Concord Machine Tools to buy, sell, or source Hyd-Mech equipment.',
    introduction:
      'Browse used Hyd-Mech metal-cutting bandsaws and industrial sawing equipment.',
  },

  wenzel: {
    productType: 'Coordinate Measuring Machines',
    description:
      'Browse used Wenzel coordinate measuring machines (CMMs) for sale, including precision inspection and dimensional measurement equipment. Contact Concord Machine Tools to buy, sell, or source used Wenzel CMMs.',
    introduction:
      'Explore used Wenzel coordinate measuring machines and precision CMM inspection equipment for industrial quality control and dimensional measurement applications.',
  },

  komo: {
    productType: 'CNC Routers',
    description:
      'Browse used Komo CNC routers for sale, including industrial CNC routing and machining centers for production applications. Contact Concord Machine Tools to buy, sell, or source used Komo equipment.',
    introduction:
      'Browse used Komo CNC routers and industrial routing equipment for manufacturing and production applications.',
  },

  laguna: {
    productType: 'Plasma Cutters',
    description:
      'Browse used Laguna plasma cutters for sale, including industrial CNC plasma cutting systems. Contact Concord Machine Tools to buy, sell, or source used Laguna plasma equipment.',
    introduction:
      'Explore used Laguna CNC plasma cutters and industrial metal cutting equipment for fabrication and manufacturing applications.',
  },

  smart: {
    productType: 'CNC Machining Centers',
    description:
      'Browse used Smart CNC machining centers for sale, including industrial CNC milling and machining equipment. Contact Concord Machine Tools to buy, sell, or source used Smart machinery.',
    introduction:
      'Browse used Smart CNC machining centers and industrial milling equipment for manufacturing and production applications.',
  },
};

/* ------------------------------------
   FALLBACK SEO CONTENT
------------------------------------ */

const brandContentMap: Record<string, string> = {
  haas: `<h2>Used Haas CNC Machines for Sale</h2><p>Browse available Haas CNC machines including vertical machining centers, lathes, and automation-ready systems.</p>`,

  mazak: `<h2>Used Mazak CNC Machines for Sale</h2><p>Explore Mazak multi-tasking machines, turning centers, and machining solutions.</p>`,

  hurco: `<h2>Used Hurco CNC Machines for Sale</h2><p>Hurco CNC machines known for conversational programming and ease of use.</p>`,

  makino: `<h2>Used Makino CNC Machines for Sale</h2><p>High-precision Makino machining centers for mold and aerospace applications.</p>`,

  doosan: `<h2>Used DN Solutions CNC Machines for Sale</h2><p>Reliable and cost-effective CNC turning and milling solutions.</p>`,

  okuma: `<h2>Used Okuma CNC Machines for Sale</h2><p>Durable and high-performance CNC machines with integrated control systems.</p>`,
};

/* ------------------------------------
   SEO METADATA
------------------------------------ */

export async function generateMetadata({
  params,
}: any): Promise<Metadata> {
  const brandSlug = params.brand;

  const brand = await client.fetch(
    `*[_type == "brand" && slug.current == $slug][0]{
      name
    }`,
    { slug: brandSlug }
  );

  const brandName =
    brand?.name ||
    brandSlug.replace(/-/g, ' ');

  const formattedBrand =
    brandName.charAt(0).toUpperCase() +
    brandName.slice(1);

  const seo =
    brandSEOConfig[brandSlug.toLowerCase()];

  const productType =
    seo?.productType || 'Machinery';

  const title =
    `Used ${formattedBrand} ${productType} for Sale | Concord Machine Tools`;

  const description =
    seo?.description ||
    `Browse used ${formattedBrand} machinery and machine tools for sale at Concord Machine Tools. Explore available equipment, locate specific models, or contact us to buy, sell, and source used machinery.`;

  const canonicalUrl =
    `${BASE_URL}/brands/${brandSlug}`;

  return {
    title,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Concord Machine Tools',
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

/* ------------------------------------
   BRAND PAGE
------------------------------------ */

export default async function BrandPage({
  params,
}: any) {
  const brandSlug = params.brand;

  /* ------------------------------------
     GET BRAND INFORMATION
  ------------------------------------ */

  const brand = await client.fetch(
    `*[_type == "brand" && slug.current == $slug][0]{
      name,
      description,
      website
    }`,
    { slug: brandSlug }
  );

  const brandName =
    brand?.name ||
    brandSlug.replace(/-/g, ' ');

  const formattedBrand =
    brandName.charAt(0).toUpperCase() +
    brandName.slice(1);

  const seo =
    brandSEOConfig[brandSlug.toLowerCase()];

  const productType =
    seo?.productType || 'Machinery';

  const introduction =
    seo?.introduction ||
    `Browse available used ${formattedBrand} machinery and machine tools. Explore current inventory or contact Concord Machine Tools for assistance locating specific equipment.`;

  const canonicalUrl =
    `${BASE_URL}/brands/${brandSlug}`;

  /* ------------------------------------
     GET BRAND MACHINES
     NEWEST MACHINES FIRST
  ------------------------------------ */

  const machines: Machine[] = await client.fetch(
    `*[
      _type == "machine" &&
      lower(brand) == lower($brand) &&
      defined(slug.current) &&
      defined(category->slug.current) &&
      defined(subcategory->slug.current)
    ] | order(yearOfMfg desc, _updatedAt desc) {
      _id,
      name,
      model,
      brand,
      yearOfMfg,
      stockNumber,
      images[]{asset->},
      slug,
      category->{slug},
      subcategory->{slug}
    }`,
    { brand: brandName }
  );

  /* ------------------------------------
     UNIQUE MODEL LIST
  ------------------------------------ */

  const modelSet = new Set<string>();

  machines.forEach((machine) => {
    if (machine.model) {
      modelSet.add(machine.model);
    }
  });

  const models = Array.from(modelSet).sort();

  /* ------------------------------------
     BRAND DESCRIPTION
  ------------------------------------ */

  const content =
    brand?.description ||
    brandContentMap[brandSlug.toLowerCase()];

  /* ------------------------------------
     STRUCTURED DATA URLS
  ------------------------------------ */

  const machineList = machines.map((machine, index) => {
    const machineUrl =
      `${BASE_URL}/inventory/${machine.category.slug.current}/${machine.subcategory.slug.current}/${machine.slug.current}`;

    return {
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: machine.name,
        url: machineUrl,
      },
    };
  });

  /* ------------------------------------
     COMBINED STRUCTURED DATA
  ------------------------------------ */

  const structuredData = {
    '@context': 'https://schema.org',

    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: `Used ${formattedBrand} ${productType} for Sale`,
        description:
          seo?.description ||
          `Browse used ${formattedBrand} machinery for sale at Concord Machine Tools.`,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${BASE_URL}/#website`,
          name: 'Concord Machine Tools',
          url: BASE_URL,
        },
        mainEntity: {
          '@id': `${canonicalUrl}#inventory`,
        },
      },

      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: BASE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Brands',
            item: `${BASE_URL}/brands`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: formattedBrand,
            item: canonicalUrl,
          },
        ],
      },

      {
        '@type': 'ItemList',
        '@id': `${canonicalUrl}#inventory`,
        name: `Available Used ${formattedBrand} ${productType}`,
        numberOfItems: machineList.length,
        itemListElement: machineList,
      },
    ],
  };

  /* ------------------------------------
     PAGE OUTPUT
  ------------------------------------ */

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">

      {/* STRUCTURED DATA */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(
            /</g,
            '\\u003c'
          ),
        }}
      />

      {/* HEADER */}

      <h1 className="text-3xl font-semibold mb-2">
        Used {formattedBrand} {productType} for Sale
      </h1>

      {/* OFFICIAL BRAND WEBSITE */}

      {brand?.website && (
        <a
          href={brand.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline block mb-6"
        >
          Visit official {formattedBrand} website →
        </a>
      )}

      {/* INTRODUCTION */}

      <p className="text-gray-600 mb-8 max-w-3xl">
        {introduction}
        {' '}Select a machine or model to explore specifications,
        photographs, and additional equipment details.
      </p>

      {/* MODEL LINKS */}

      {models.length > 0 && (
        <section className="mb-10">

          <h2 className="text-xl font-semibold mb-3">
            Browse {formattedBrand} Machines by Model
          </h2>

          <div className="flex flex-wrap gap-2">

            {models.map((model) => {
              const slug = slugify(model);

              if (!slug) return null;

              return (
                <Link
                  key={model}
                  href={`/models/${brandSlug}/${slug}`}
                  className="px-3 py-1 border rounded-full text-sm hover:bg-black hover:text-white transition"
                >
                  {model}
                </Link>
              );
            })}

          </div>
        </section>
      )}

      {/* MACHINE INVENTORY */}

      <h2 className="text-xl font-semibold mb-3">
        Available Used {formattedBrand} {productType}
      </h2>

      {machines.length > 0 ? (

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">

          {machines.map((machine) => {
            const imageUrl = machine.images?.[0]
              ? urlFor(machine.images[0])
              : '/placeholder.jpg';

            return (
              <Link
                key={machine._id}
                href={`/inventory/${machine.category.slug.current}/${machine.subcategory.slug.current}/${machine.slug.current}`}
                className="block border rounded-lg overflow-hidden hover:shadow-lg transition"
              >

                <img
                  src={imageUrl}
                  className="h-48 w-full object-cover"
                  alt={machine.name}
                />

                <div className="p-4">

                  <h3 className="font-medium">
                    {machine.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {machine.yearOfMfg || 'Year N/A'} |
                    {' '}Stock #: {machine.stockNumber}
                  </p>

                </div>

              </Link>
            );
          })}

        </div>

      ) : (

        <p className="text-gray-600 mb-12">
          We do not currently have used {formattedBrand} equipment
          listed in our inventory. Contact Concord Machine Tools
          if you are looking for a specific {formattedBrand} model
          or would like assistance sourcing equipment.
        </p>

      )}

      {/* SEO BRAND DESCRIPTION */}

      {content && (
        <section className="max-w-4xl prose text-gray-700">

          <div
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />

        </section>
      )}

    </main>
  );
}
