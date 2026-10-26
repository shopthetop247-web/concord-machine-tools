// app/brands/page.tsx
export const revalidate = 60;

import { client } from '@/lib/sanityClient';
import Link from 'next/link';
import { Metadata } from 'next';

interface Brand {
  name: string;
  slug: string;
  count: number;
}

export const metadata: Metadata = {
  title: 'Used Machine Brands & Manufacturers | Concord Machine Tools',
  description:
    'Browse used machine brands and industrial equipment manufacturers at Concord Machine Tools. Find used CNC mills, lathes, machining centers, and more.',
};

/* ------------------------------------
   PAGE COMPONENT
------------------------------------ */
export default async function BrandsPage() {
  // Fetch distinct brands and count of machines per brand
  const brands: Brand[] = await client.fetch(
    `*[_type == "machine" && defined(brand)]
      {
        "name": brand,
      }`
  );

  // Count machines per brand
  const brandMap: Record<string, number> = {};

  brands.forEach((b) => {
    const key = b.name;

    if (key) {
      brandMap[key] = (brandMap[key] || 0) + 1;
    }
  });

  // Build unique brand array with slugs
  const uniqueBrands: Brand[] = Object.keys(brandMap)
    .sort()
    .map((name) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      count: brandMap[name],
    }));

  if (!uniqueBrands.length) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold mb-4">Brands</h1>

        <p className="text-gray-700 mb-6">
          Explore used machine brands and industrial equipment manufacturers
          at Concord Machine Tools. We specialize in used metalworking machinery,
          including CNC machining centers, CNC lathes, fabrication equipment,
          and other industrial machine tools.
        </p>

        <p className="text-gray-700">
          No brands are currently listed. Please check our{' '}
          <Link
            href="/inventory"
            className="text-blue-700 underline hover:text-blue-900"
          >
            used machinery inventory
          </Link>{' '}
          or contact Concord Machine Tools for assistance locating a particular
          machine.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      {/* Page heading and introduction */}
      <header className="mb-8">
        <h1 className="text-3xl font-semibold mb-4">Used CNC Machine Brands</h1>

        <p className="text-gray-700 leading-relaxed mb-3">
          Explore used CNC machines and industrial metalworking equipment by
          manufacturer at Concord Machine Tools. We offer a continually changing
          selection of pre-owned machinery from recognized machine tool builders,
          including Haas, Mazak, Okuma, Doosan, Hurco, Makino, Fadal, and many
          other manufacturers.
        </p>

        <p className="text-gray-700 leading-relaxed">
          Whether you are searching for a used CNC machining center, CNC lathe,
          horizontal boring mill, grinder, fabrication machine, or other
          industrial equipment, browsing by brand makes it easier to find
          machines that match your manufacturing requirements. Select a
          manufacturer below to explore its brand page, review available
          information, and find machines currently offered for sale.
        </p>
      </header>

      {/* Dynamic brand directory */}
      <section aria-label="Browse machinery brands">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {uniqueBrands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/brands/${brand.slug}`}
              className="block border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white text-center"
            >
              <h2 className="text-lg font-medium mb-1 capitalize">
                {brand.name}
              </h2>

              <p className="text-sm text-gray-600">
                {brand.count} {brand.count === 1 ? 'machine' : 'machines'}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* SEO content below the brand directory */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-3">
            Browse Used CNC Machines and Metalworking Equipment by Brand
          </h2>

          <p className="text-gray-700 leading-relaxed mb-3">
            Concord Machine Tools helps manufacturers, machine shops, and
            industrial businesses locate quality used CNC machinery and
            metalworking equipment from established machine tool manufacturers.
            Our inventory changes as machines are purchased and sold, providing
            buyers with opportunities to find equipment suited to their
            production needs, available floor space, and capital budgets.
          </p>

          <p className="text-gray-700 leading-relaxed">
            Our listed manufacturers represent a variety of machine tool
            categories, including CNC vertical machining centers, horizontal
            machining centers, CNC lathes, turning centers, multi-axis machining
            centers, boring mills, grinding machines, and other precision
            manufacturing equipment. We also handle manual machine tools, metal
            fabrication machinery, stamping equipment, and specialized
            industrial machines.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">
            Find Used Machinery from Leading Manufacturers
          </h2>

          <p className="text-gray-700 leading-relaxed mb-3">
            When purchasing used industrial equipment, the manufacturer is often
            an important starting point. Buyers may already operate machines
            from a particular brand, have experience with its CNC controls, or
            need equipment compatible with their existing manufacturing
            processes. Browsing by manufacturer helps narrow the search and
            makes it easier to compare available machines within a familiar
            product family.
          </p>

          <p className="text-gray-700 leading-relaxed mb-3">
            Our brand pages provide a starting point for researching equipment
            from individual manufacturers. Depending on current inventory, you
            may find used CNC mills, lathes, machining centers, fabrication
            equipment, and other machine tools. Individual machine listings
            provide available details such as model, year of manufacture, stock
            number, photographs, and specifications to help prospective buyers
            evaluate equipment.
          </p>

          <p className="text-gray-700 leading-relaxed">
            Because used machinery inventory changes regularly, a manufacturer
            may have several machines available at one time and fewer or none at
            another. If you are looking for a particular make or model that is
            not currently listed, contact our team to discuss your requirements
            and potential sourcing opportunities.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">
            Why Buy Used CNC and Industrial Machinery?
          </h2>

          <p className="text-gray-700 leading-relaxed mb-3">
            Purchasing used CNC machines can help manufacturers expand
            production capacity, replace aging equipment, or add specialized
            machining capabilities without the capital expenditure associated
            with buying new machinery. Depending on the machine&apos;s
            condition, configuration, and intended application, pre-owned
            equipment may offer a practical way to meet production requirements
            while managing equipment costs.
          </p>

          <p className="text-gray-700 leading-relaxed">
            Whether you need a CNC vertical machining center for general
            milling, a turning center for precision component production, a
            horizontal machining center for production work, or machinery for
            metal forming and fabrication, selecting the right equipment starts
            with understanding your application and evaluating the available
            options. Browse our{' '}
            <Link
              href="/inventory"
              className="text-blue-700 underline hover:text-blue-900"
            >
              used machinery inventory
            </Link>{' '}
            to see the machines currently listed for sale.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">
            Buying and Selling Used Machinery with Concord Machine Tools
          </h2>

          <p className="text-gray-700 leading-relaxed mb-3">
            Concord Machine Tools works with manufacturers and machine shops
            seeking to buy or sell used CNC machines and industrial equipment.
            In addition to offering machinery for sale, we purchase surplus
            equipment from businesses that are upgrading machinery,
            consolidating operations, reducing capacity, or selling equipment
            they no longer need.
          </p>

          <p className="text-gray-700 leading-relaxed mb-3">
            We evaluate individual machines, groups of machines, and equipment
            from larger manufacturing facilities. If you have surplus CNC
            machinery or other metalworking equipment, visit our{' '}
            <Link
              href="/sell"
              className="text-blue-700 underline hover:text-blue-900"
            >
              Sell Your Machine
            </Link>{' '}
            page to learn more about our purchasing process. If you are looking
            for a particular machine, browse our inventory or contact Concord
            Machine Tools to discuss your requirements.
          </p>

          <p className="text-gray-700 leading-relaxed">
            Based in Michigan, Concord Machine Tools serves machinery buyers
            and sellers throughout the United States and internationally. Our
            goal is to help customers navigate the used machinery market and
            connect with equipment that meets their manufacturing needs.
          </p>
        </div>
      </section>
    </main>
  );
}
