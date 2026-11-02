// app/inventory/page.tsx
export const revalidate = 30;

import { client } from '@/lib/sanityClient';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source);

export const metadata: Metadata = {
  title: 'Used CNC Machines for Sale | CNC Mills, Lathes & Machinery',
  description:
    'Browse used CNC machines for sale at Concord Machine Tools. Shop used CNC mills, lathes, machining centers, fabrication equipment and industrial machinery from leading manufacturers.',
  keywords: [
    'used CNC machines for sale',
    'used CNC machinery',
    'used CNC machine inventory',
    'used CNC mills for sale',
    'used CNC lathes for sale',
    'used CNC machining centers',
    'used horizontal machining centers',
    'used vertical machining centers',
    'used CNC turning centers',
    'used industrial machinery for sale',
    'used metalworking equipment',
    'used fabrication equipment',
    'used stamping equipment',
    'used Haas CNC machines',
    'used Mazak CNC machines',
    'used Okuma CNC machines',
    'used Doosan CNC machines',
    'used Hurco CNC machines',
    'Concord Machine Tools',
  ],
  alternates: {
    canonical: 'https://www.concordmt.com/inventory',
  },
};

interface Category {
  _id: string;
  name: string;
  slug: { current: string };
}

interface Subcategory {
  _id: string;
  name: string;
  slug: { current: string };
  parentCategory: { _ref: string };
}

interface Machine {
  _id: string;
  name: string;
  slug: { current: string };
  yearOfMfg?: number;
  thumbnail?: {
    asset?: any;
    alt?: string;
  };
  category?: {
    slug?: { current: string };
  };
  subcategory?: {
    slug?: { current: string };
  };
}

export default async function InventoryPage() {
  const categories: Category[] = await client.fetch(`
    *[_type == "category"]{
      _id,
      name,
      slug
    }
  `);

  const subcategories: Subcategory[] = await client.fetch(`
    *[_type == "subcategory"]{
      _id,
      name,
      slug,
      parentCategory
    }
  `);

  const recentMachines: Machine[] = await client.fetch(`
    *[_type == "machine"] | order(_createdAt desc)[0...6]{
      _id,
      name,
      slug,
      yearOfMfg,
      "thumbnail": images[0]{
        asset,
        alt
      },
      category->{
        slug
      },
      subcategory->{
        slug
      }
    }
  `);

  const subcategoriesByCategory: Record<string, Subcategory[]> = {};
  subcategories.forEach((subcat) => {
    const parentId = subcat.parentCategory._ref;
    if (!subcategoriesByCategory[parentId]) {
      subcategoriesByCategory[parentId] = [];
    }
    subcategoriesByCategory[parentId].push(subcat);
  });

  const columnOrder = [
    'CNC Machinery',
    'Fabricating & Stamping',
    'Manual Machinery',
  ];

  const sortedCategories = columnOrder
    .map((name) => categories.find((c) => c.name === name))
    .filter(Boolean) as Category[];

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">

      <h1 className="text-3xl font-semibold mb-6">
        Used CNC Machines & Industrial Equipment for Sale
      </h1>

      {/* SEO Introduction */}
      <div className="max-w-4xl mb-12 text-slate-700 leading-relaxed space-y-4">

        <p>
          Welcome to the used machinery inventory at Concord Machine Tools, a
          U.S. dealer specializing in quality used CNC machines, metalworking
          machinery, and industrial manufacturing equipment. We offer a
          continually changing selection of used CNC machines for sale,
          including CNC vertical machining centers, horizontal machining
          centers, CNC lathes, turning centers, milling machines, and a wide
          variety of additional manufacturing equipment. Whether you are
          looking to purchase a single machine, expand your existing production
          capabilities, or equip an entire manufacturing facility, our
          inventory provides access to pre-owned machinery from established
          manufacturers.
        </p>

        <p>
          Our used machinery inventory is updated frequently as equipment is
          purchased, sold, and sourced through our nationwide network of
          manufacturing contacts. We regularly handle machines from respected
          manufacturers such as Haas, Mazak, Okuma, Doosan, Hurco, DMG MORI,
          Makino, Mori Seiki, and many others. Inventory availability changes
          regularly, so we encourage buyers to check back often or contact our
          team if you are searching for a particular machine, manufacturer, or
          model.
        </p>

      </div>

      {/* Inventory Categories */}
      <div className="grid md:grid-cols-3 gap-8">

        {sortedCategories.map((cat) => (
          <div key={cat._id}>
            <h2 className="text-xl font-semibold mb-4">{cat.name}</h2>

            <ul className="space-y-2">
              {subcategoriesByCategory[cat._id]?.map((sub) => (
                <li key={sub._id}>
                  <Link
                    href={`/inventory/${cat.slug.current}/${sub.slug.current}`}
                    className="text-blue-500 hover:text-blue-400"
                  >
                    {sub.name}
                  </Link>
                </li>
              )) ?? (
                <li className="text-gray-500 italic">No subcategories</li>
              )}
            </ul>
          </div>
        ))}

      </div>

      {/* Recently Added Machines */}
      {recentMachines.length > 0 && (
        <section className="mt-16">

          <h2 className="text-2xl font-semibold mb-6">
            Recently Added Machines
          </h2>

          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {recentMachines.map((machine) => (
              <li
                key={machine._id}
                className="border rounded-md overflow-hidden hover:shadow-md transition"
              >

                {machine.thumbnail?.asset ? (
                  <Image
                    src={urlFor(machine.thumbnail.asset).width(600).height(400).url()}
                    alt={
                      machine.thumbnail.alt ||
                      `${machine.name} machine for sale`
                    }
                    width={600}
                    height={400}
                    className="object-cover w-full h-48"
                  />
                ) : (
                  <div className="h-48 bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                    No image available
                  </div>
                )}

                <div className="p-4">

                  <Link
                    href={`/inventory/${machine.category?.slug?.current}/${machine.subcategory?.slug?.current}/${machine.slug.current}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {machine.yearOfMfg ? `${machine.yearOfMfg} - ` : ''}{machine.name}
                  </Link>

                  <p className="text-sm text-gray-500 mt-1">
                    New listing
                  </p>

                </div>
              </li>
            ))}

          </ul>

        </section>
      )}

      {/* CNC Machinery SEO Content */}
      <section className="mt-16 max-w-4xl text-slate-700 leading-relaxed space-y-5">

        <h2 className="text-2xl font-semibold text-slate-900">
          Used CNC Machinery for Manufacturing and Production
        </h2>

        <p>
          CNC machinery is an essential part of modern manufacturing, providing
          the precision, repeatability, and production capabilities required
          across a wide range of industries. Concord Machine Tools specializes
          in used CNC machinery from leading manufacturers, helping businesses
          find equipment that meets their machining requirements and production
          goals. Our inventory includes a variety of CNC machine tools designed
          for milling, turning, drilling, boring, and complex multi-axis
          machining applications.
        </p>

        <p>
          Buyers searching for used CNC vertical machining centers, horizontal
          machining centers, CNC turning centers, and CNC lathes will find a
          range of equipment suited to different manufacturing environments.
          We also handle CNC grinders, boring mills, gantry mills, five-axis
          machining centers, and other specialized machine tools. Whether you
          need a compact CNC mill for general machining or a large production
          machine for demanding industrial applications, we can help you
          identify available equipment and explore additional sourcing
          opportunities.
        </p>

        <p>
          Our inventory frequently includes equipment manufactured by Haas,
          Mazak, Okuma, Doosan, Hurco, DMG MORI, Makino, Mori Seiki, and other
          recognized CNC machine tool builders. Each machine listing provides
          available details, specifications, photographs, and equipment
          information to help prospective buyers evaluate their options.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900">
          Used Fabricating, Stamping & Industrial Equipment
        </h2>

        <p>
          In addition to CNC machine tools, Concord Machine Tools offers used
          metal fabrication and stamping equipment for manufacturers and
          industrial operations. This category includes machinery used in
          cutting, forming, punching, bending, and processing metal materials.
          Depending on current availability, equipment may include hydraulic
          press brakes, shears, laser cutting machines, plasma cutting systems,
          stamping presses, ironworkers, saws, and other fabrication machinery.
        </p>

        <p>
          Purchasing quality pre-owned fabrication equipment can provide
          manufacturers with an opportunity to expand production capabilities
          while managing capital equipment costs. We work with buyers seeking
          individual machines as well as companies looking for multiple pieces
          of equipment to support larger manufacturing projects.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900">
          Used Manual Metalworking Machinery
        </h2>

        <p>
          Our inventory also includes used manual metalworking machinery for
          machine shops, toolrooms, maintenance departments, and manufacturing
          facilities. Depending on availability, manual equipment may include
          vertical and horizontal milling machines, engine lathes, surface
          grinders, cylindrical grinders, boring mills, drill presses, and
          other conventional machine tools. These machines continue to serve
          important roles in repair work, tooling, prototyping, secondary
          operations, and general machining applications.
        </p>

        <p>
          Whether you are outfitting a new machine shop, replacing older
          equipment, or adding specialized capabilities to an existing
          operation, our team can help you locate suitable used manual
          machinery from established equipment manufacturers.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900">
          Quality Used Machinery from Leading Manufacturers
        </h2>

        <p>
          Concord Machine Tools works with a broad range of machine tool
          manufacturers and industrial equipment builders. Our inventory
          regularly features equipment from well-known brands including Haas,
          Mazak, Okuma, Doosan, Hurco, DMG MORI, Makino, Mori Seiki, Amada,
          Mitsubishi, and other respected manufacturers. From CNC machining
          centers and turning equipment to fabrication machinery and
          conventional machine tools, we help connect buyers with quality
          pre-owned industrial equipment.
        </p>

        <p>
          If you do not see the particular brand or model you need in our
          current inventory, contact us. We can discuss your equipment
          requirements and explore sourcing opportunities through our
          industry network. Our goal is to help manufacturers find the right
          machinery for their applications, even when the exact equipment is
          not currently listed for sale.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900">
          Why Buy Used Machinery from Concord Machine Tools?
        </h2>

        <p>
          Located in Michigan, Concord Machine Tools serves manufacturers,
          machine shops, and industrial businesses throughout the United
          States and internationally. We understand the used machinery
          marketplace and the importance of matching equipment capabilities,
          condition, and value with each buyer's requirements. Our experience
          buying, selling, sourcing, and evaluating used industrial machinery
          allows us to assist customers throughout the equipment purchasing
          process.
        </p>

        <p>
          Whether you are purchasing one CNC machine or sourcing equipment for
          a larger manufacturing operation, we provide knowledgeable assistance
          and straightforward communication. We can help with equipment
          information, machine specifications, purchasing inquiries, and
          locating machinery that meets your needs.
        </p>

        <p>
          Are you looking to sell surplus equipment instead? Visit our{' '}
          <Link
            href="/sell"
            className="text-blue-600 hover:underline"
          >
            Sell Your Machine
          </Link>{' '}
          page to learn how Concord Machine Tools purchases used CNC machines
          and industrial machinery. You can also explore our{' '}
          <Link
            href="/consulting"
            className="text-blue-600 hover:underline"
          >
            Machinery Consulting
          </Link>{' '}
          services for assistance evaluating equipment, determining whether
          machinery should be sold or retained, and planning equipment
          transactions.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900">
          Frequently Asked Questions About Buying Used CNC Machines
        </h2>

        <h3 className="text-lg font-semibold text-slate-900">
          What types of used CNC machines does Concord Machine Tools sell?
        </h3>

        <p>
          We offer a changing inventory of used CNC vertical machining centers,
          horizontal machining centers, CNC lathes, turning centers, milling
          machines, grinders, boring mills, and other CNC manufacturing
          equipment. Availability varies as machines are purchased and sold.
        </p>

        <h3 className="text-lg font-semibold text-slate-900">
          What manufacturers of used CNC machinery do you carry?
        </h3>

        <p>
          Our inventory frequently includes machines from manufacturers such
          as Haas, Mazak, Okuma, Doosan, Hurco, DMG MORI, Makino, and Mori
          Seiki, along with many other machine tool builders. Available
          manufacturers and models change regularly.
        </p>

        <h3 className="text-lg font-semibold text-slate-900">
          Can Concord Machine Tools help locate a machine that is not listed?
        </h3>

        <p>
          Yes. If you are searching for a specific machine, manufacturer, or
          model that is not currently listed, contact our team. We can discuss
          your requirements and explore sourcing opportunities through our
          industry network.
        </p>

        <h3 className="text-lg font-semibold text-slate-900">
          Does Concord Machine Tools purchase used CNC machines?
        </h3>

        <p>
          Yes. We purchase individual used CNC machines, industrial equipment,
          multiple machines, and larger surplus machinery inventories from
          manufacturing facilities. Visit our{' '}
          <Link
            href="/sell"
            className="text-blue-600 hover:underline"
          >
            Sell Your Machine
          </Link>{' '}
          page to learn more about submitting your equipment for evaluation.
        </p>

      </section>

    </main>
  );
}
