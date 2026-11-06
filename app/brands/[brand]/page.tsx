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

  shibaura: {
    productType: 'CNC Machines',
    description:
      'Browse used Shibaura CNC machines for sale, including precision machining centers and industrial CNC equipment. Contact Concord Machine Tools to buy, sell, or source used Shibaura machinery.',
    introduction:
      'Explore used Shibaura CNC machine tools and precision manufacturing equipment for industrial production applications.',
  },

  grob: {
    productType: 'CNC Machining Centers',
    description:
      'Browse used GROB CNC machining centers for sale, including horizontal machining centers and advanced multi-axis machining equipment. Contact Concord Machine Tools to buy, sell, or source used GROB machinery.',
    introduction:
      'Explore used GROB CNC machining centers, including advanced horizontal and multi-axis machining equipment for precision manufacturing.',
  },

  mitsubishi: {
    productType: 'CNC Machines',
    description:
      'Browse used Mitsubishi CNC machines and industrial machine tools for sale. Contact Concord Machine Tools to buy, sell, or source used Mitsubishi manufacturing equipment.',
    introduction:
      'Explore used Mitsubishi CNC equipment and industrial machine tools. Contact Concord Machine Tools for available machinery or assistance locating specific equipment.',
  },

  fanuc: {
    productType: 'CNC Machines & Automation',
    description:
      'Browse used FANUC CNC equipment and industrial automation machinery for sale. Contact Concord Machine Tools to buy, sell, or source used FANUC manufacturing equipment.',
    introduction:
      'Explore used FANUC CNC equipment and industrial automation solutions for manufacturing applications.',
  },

  fadal: {
    productType: 'CNC Machines',
    description:
      'Browse used Fadal CNC machines for sale, including vertical machining centers and CNC milling equipment. Contact Concord Machine Tools to buy, sell, or source used Fadal machinery.',
    introduction:
      'Explore used Fadal CNC vertical machining centers and milling equipment for machine shops and industrial manufacturing facilities.',
  },

  visionwide: {
    productType: 'CNC Machining Centers',
    description:
      'Browse used Vision Wide CNC machining centers for sale, including double-column bridge mills and gantry machining centers. Contact Concord Machine Tools to buy, sell, or source used Vision Wide equipment.',
    introduction:
      'Explore used Vision Wide CNC machining centers, including large-capacity double-column and gantry milling machines for heavy-duty manufacturing applications.',
  },

  parpas: {
    productType: 'CNC Machining Centers',
    description:
      'Browse used Parpas CNC machining centers for sale, including large-capacity milling and precision machining equipment. Contact Concord Machine Tools to buy, sell, or source used Parpas machinery.',
    introduction:
      'Explore used Parpas CNC machining centers and large-format milling equipment for demanding industrial manufacturing applications.',
  },

  okk: {
    productType: 'CNC Machining Centers',
    description:
      'Browse used OKK CNC machining centers for sale, including vertical and horizontal machining equipment. Contact Concord Machine Tools to buy, sell, or source used OKK machinery.',
    introduction:
      'Explore used OKK CNC machining centers and precision milling equipment for industrial manufacturing and production applications.',
  },

  tsugami: {
    productType: 'CNC Lathes',
    description:
      'Browse used Tsugami CNC lathes and precision turning machines for sale. Contact Concord Machine Tools to buy, sell, or source used Tsugami equipment for precision manufacturing.',
    introduction:
      'Explore used Tsugami CNC lathes and precision turning equipment for high-accuracy production and manufacturing applications.',
  },

  eurotech: {
    productType: 'CNC Lathes',
    description:
      'Browse used Eurotech CNC lathes and turning centers for sale. Contact Concord Machine Tools to buy, sell, or source used Eurotech turning equipment.',
    introduction:
      'Explore used Eurotech CNC lathes and turning centers for industrial production and precision machining applications.',
  },

  hardinge: {
    productType: 'Machine Tools',
    description:
      'Browse used Hardinge machine tools for sale, including precision turning machines, CNC lathes, and milling equipment. Contact Concord Machine Tools to buy, sell, or source used Hardinge machinery.',
    introduction:
      'Explore used Hardinge machine tools and precision manufacturing equipment, including turning and milling machinery.',
  },

  /* MILLING, GRINDING AND GENERAL MACHINE TOOLS */

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

  chevalier: {
    productType: 'Grinding & Machine Tools',
    description:
      'Browse used Chevalier grinding machines and machine tools for sale, including precision grinding equipment. Contact Concord Machine Tools to buy, sell, or source used Chevalier machinery.',
    introduction:
      'Explore used Chevalier grinding machines and precision machine tools for industrial manufacturing and toolroom applications.',
  },

  clausing: {
    productType: 'Machine Tools',
    description:
      'Browse used Clausing machine tools for sale, including metalworking and machining equipment. Contact Concord Machine Tools to buy, sell, or source used Clausing machinery.',
    introduction:
      'Explore used Clausing machine tools and metalworking equipment for machine shops and industrial manufacturing facilities.',
  },

  cincinnati: {
    productType: 'Machine Tools',
    description:
      'Browse used Cincinnati machine tools for sale, including industrial milling, machining, and metalworking equipment. Contact Concord Machine Tools to buy, sell, or source used Cincinnati machinery.',
    introduction:
      'Explore used Cincinnati machine tools and industrial metalworking equipment for manufacturing and production applications.',
  },

  jet: {
    productType: 'Metalworking Machinery',
    description:
      'Browse used JET metalworking machinery for sale, including shop equipment and industrial metalworking machines. Contact Concord Machine Tools to buy, sell, or source used JET equipment.',
    introduction:
      'Explore used JET metalworking machinery and shop equipment for industrial and manufacturing applications.',
  },

  knuth: {
    productType: 'Metalworking Machinery',
    description:
      'Browse used KNUTH metalworking machinery for sale, including industrial machine tools and manufacturing equipment. Contact Concord Machine Tools to buy, sell, or source used KNUTH machinery.',
    introduction:
      'Explore used KNUTH metalworking machinery and industrial machine tools for manufacturing and fabrication applications.',
  },

  'southwestern-industries': {
    productType: 'CNC Machines',
    description:
      'Browse used Southwestern Industries CNC machines for sale, including TRAK mills, CNC lathes, and ProtoTRAK-equipped machine tools. Contact Concord Machine Tools to buy, sell, or source used Southwestern Industries equipment.',
    introduction:
      'Explore used Southwestern Industries and TRAK CNC machines, including milling and turning equipment for machine shops and manufacturing facilities.',
  },

  /* METAL FABRICATING AND STAMPING EQUIPMENT */

  amada: {
    productType: 'Metal Fabricating Machinery',
    description:
      'Browse used Amada metal fabricating machinery for sale, including press brakes, laser cutting systems, shears, and punching equipment. Contact Concord Machine Tools to buy, sell, or source used Amada machinery.',
    introduction:
      'Explore used Amada metal fabrication equipment, including sheet metal processing and industrial fabrication machinery.',
  },

  wysong: {
    productType: 'Metal Fabricating Machinery',
    description:
      'Browse used Wysong metal fabricating machinery for sale, including shears and sheet metal processing equipment. Contact Concord Machine Tools to buy, sell, or source used Wysong machinery.',
    introduction:
      'Explore used Wysong metal fabricating machinery and sheet metal processing equipment for industrial fabrication applications.',
  },

  carell: {
    productType: 'Metal Forming Equipment',
    description:
      'Browse used Carell metal forming equipment for sale, including plate rolls, angle rolls, and industrial profile bending machinery. Contact Concord Machine Tools to buy, sell, or source used Carell equipment.',
    introduction:
      'Explore used Carell metal forming equipment, including plate and angle rolls for industrial fabrication and metalworking applications.',
  },

  bliss: {
    productType: 'Stamping Presses',
    description:
      'Browse used Bliss stamping presses for sale, including industrial metal stamping and press equipment. Contact Concord Machine Tools to buy, sell, or source used Bliss machinery.',
    introduction:
      'Explore used Bliss stamping presses and industrial metal forming equipment for manufacturing and production applications.',
  },

  'usi-clearing': {
    productType: 'Stamping Presses',
    description:
      'Browse used USI Clearing stamping presses and industrial metal forming equipment for sale. Contact Concord Machine Tools to buy, sell, or source used USI Clearing machinery.',
    introduction:
      'Explore used USI Clearing stamping presses and metal forming equipment for industrial manufacturing applications.',
  },

  danly: {
    productType: 'Stamping Presses',
    description:
      'Browse used Danly stamping presses and industrial press equipment for sale. Contact Concord Machine Tools to buy, sell, or source used Danly machinery.',
    introduction:
      'Explore used Danly stamping presses and industrial metal forming equipment for manufacturing and production applications.',
  },

  accurpress: {
    productType: 'Press Brakes',
    description:
      'Browse used Accurpress press brakes for sale, including hydraulic press brakes and industrial sheet metal bending equipment. Contact Concord Machine Tools to buy, sell, or source used Accurpress machinery.',
    introduction:
      'Explore used Accurpress press brakes and sheet metal bending equipment for industrial fabrication applications.',
  },

  mubea: {
    productType: 'Ironworkers & Punching Machines',
    description:
      'Browse used Mubea ironworkers and punching machines for sale, including industrial metalworking and fabrication equipment. Contact Concord Machine Tools to buy, sell, or source used Mubea machinery.',
    introduction:
      'Explore used Mubea ironworkers, punching machines, and metal fabrication equipment for industrial manufacturing applications.',
  },

  scotchman: {
    productType: 'Ironworkers & Bandsaws',
    description:
      'Browse used Scotchman ironworkers and metal-cutting bandsaws for sale. Contact Concord Machine Tools to buy, sell, or source used Scotchman metalworking equipment.',
    introduction:
      'Explore used Scotchman ironworkers, bandsaws, and industrial metalworking equipment for fabrication and production applications.',
  },

  piranha: {
    productType: 'Ironworkers',
    description:
      'Browse used Piranha ironworkers and metal fabrication equipment for sale. Contact Concord Machine Tools to buy, sell, or source used Piranha machinery.',
    introduction:
      'Explore used Piranha ironworkers and industrial metal fabrication equipment for punching, shearing, and fabrication applications.',
  },

  /* SAWING EQUIPMENT */

  'hyd-mech': {
    productType: 'Bandsaws',
    description:
      'Browse used Hyd-Mech bandsaws for sale, including industrial metal-cutting saws. Contact Concord Machine Tools to buy, sell, or source Hyd-Mech equipment.',
    introduction:
      'Browse used Hyd-Mech metal-cutting bandsaws and industrial sawing equipment.',
  },

  hem: {
    productType: 'Bandsaws',
    description:
      'Browse used HEM bandsaws for sale, including industrial metal-cutting and production sawing equipment. Contact Concord Machine Tools to buy, sell, or source used HEM machinery.',
    introduction:
      'Explore used HEM metal-cutting bandsaws and industrial sawing equipment for manufacturing and fabrication facilities.',
  },

  /* ROUTING AND PLASMA CUTTING */

  komo: {
    productType: 'CNC Routers',
    description:
      'Browse used Komo CNC routers for sale, including industrial CNC routing and machining centers for production applications. Contact Concord Machine Tools to buy, sell, or source used Komo equipment.',
    introduction:
      'Browse used Komo CNC routers and industrial routing equipment for manufacturing and production applications.',
  },

  multicam: {
    productType: 'CNC Routers',
    description:
      'Browse used MultiCam CNC routers for sale, including industrial CNC routing and cutting systems. Contact Concord Machine Tools to buy, sell, or source used MultiCam equipment.',
    introduction:
      'Explore used MultiCam CNC routers and industrial CNC cutting equipment for production and manufacturing applications.',
  },

  laguna: {
    productType: 'Plasma Cutters',
    description:
      'Browse used Laguna plasma cutters for sale, including industrial CNC plasma cutting systems. Contact Concord Machine Tools to buy, sell, or source used Laguna plasma equipment.',
    introduction:
      'Explore used Laguna CNC plasma cutters and industrial metal cutting equipment for fabrication and manufacturing applications.',
  },

  /* PLASTIC INJECTION MOLDING */

  arburg: {
    productType: 'Plastic Injection Molding Machines',
    description:
      'Browse used Arburg plastic injection molding machines for sale. Contact Concord Machine Tools to buy, sell, or source used Arburg injection molding equipment.',
    introduction:
      'Explore used Arburg plastic injection molding machines and industrial molding equipment for manufacturing applications.',
  },

  /* GENERAL MACHINERY AND SPECIALIZED EQUIPMENT */

  unitech: {
    productType: 'Machinery',
    description:
      'Explore used Unitech machinery and industrial equipment through Concord Machine Tools. Contact us for assistance locating specific Unitech equipment or discussing your machinery requirements.',
    introduction:
      'Explore Unitech machinery and industrial equipment. Contact Concord Machine Tools for assistance locating specific equipment or discussing your machinery requirements.',
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
