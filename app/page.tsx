export const revalidate = 0;

import Link from 'next/link';
import Head from 'next/head';
import { Metadata } from 'next';
import Image from 'next/image';
import { client } from '@/lib/sanityClient';

export const metadata: Metadata = {
  title: 'Used Machines for Sale - CNC & Fabricating Machinery',
  description:
    'Buy & sell used machinery, used Haas, used CNC machines, lathes, mills, and metalworking equipment. Trusted dealer offering a wide inventory and fair pricing.',
  alternates: {
    canonical: 'https://www.concordmt.com',
  },
};

export default async function HomePage() {
  const machines = await client.fetch(`
    *[_type == "machine"] | order(_createdAt desc)[0...4]{
      _id,
      name,
      yearOfMfg,
      slug,
      images[]{
        asset->{ url }
      },
      category->{slug},
      subcategory->{slug}
    }
  `);

  return (
    <main>
      <Head>
        <title>Used Machines for Sale | Machinery | Concord Machine Tools</title>
      </Head>

      {/* HERO */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-semibold mb-6">
            Used CNC & Metalworking Machinery for Sale
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10">
            Specializing in CNC machining centers, lathes, mills, fabrication equipment,
            and industrial machinery from today's leading manufacturers.
          </p>

          <p className="mb-10 text-base md:text-lg text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Browse a continually updated inventory of used CNC machines for sale,
            including machining centers, CNC lathes, grinders, fabrication equipment,
            and metalworking machinery from trusted brands like{' '}
            <Link href="/brands/haas" className="underline">
              Haas
            </Link>
            ,{' '}
            <Link href="/brands/mazak" className="underline">
              Mazak
            </Link>
            ,{' '}
            <Link href="/brands/okuma" className="underline">
              Okuma
            </Link>
            ,{' '}
            <Link href="/brands/doosan" className="underline">
              Doosan
            </Link>
            , and many more.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/inventory"
              className="bg-blue-600 px-8 py-3 rounded-md hover:bg-blue-700 transition"
            >
              View Inventory
            </Link>

            <Link
              href="/sell"
              className="border border-white px-8 py-3 rounded-md hover:bg-white hover:text-slate-900 transition"
            >
              Sell Your Machine
            </Link>
          </div>
        </div>
      </section>

      {/* RECENTLY ADDED MACHINES */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl font-semibold text-center mb-4">
            Recently Added Used CNC Machines & Industrial Equipment
          </h2>

          <p className="text-center text-gray-700 max-w-3xl mx-auto mb-10">
            Explore the latest additions to our used machinery inventory. We
            regularly acquire quality CNC machining centers, CNC lathes,
            fabrication equipment, manual machinery, and industrial equipment
            from leading manufacturers. Check back often as our inventory is
            updated frequently with newly available machines.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {machines.map((machine: any) => (
              <Link
                key={machine._id}
                href={`/inventory/${machine.category?.slug?.current}/${machine.subcategory?.slug?.current}/${machine.slug.current}`}
                className="block bg-white border rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                {machine.images?.[0]?.asset?.url && (
                  <div className="relative w-full h-48">
                    <Image
                      src={machine.images[0].asset.url}
                      alt={machine.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="p-4">
                  <h3 className="text-sm font-semibold">
                    {machine.name}
                  </h3>

                  {machine.yearOfMfg && (
                    <p className="text-sm text-gray-500">
                      {machine.yearOfMfg}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/inventory"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
            >
              View All Inventory
            </Link>
          </div>
        </div>
      </section>
      {/* SEO CONTENT BLOCK */}
      <section className="max-w-5xl mx-auto px-6 py-16">

        <h2 className="text-2xl font-semibold mb-6 text-center">
          Used CNC Machines & Industrial Equipment
        </h2>

        <p className="text-gray-700 mb-6 leading-relaxed">
          Concord Machine Tools is a trusted source for used CNC machines for
          sale, offering a wide selection of machining centers, CNC lathes,
          grinders, fabrication equipment, and industrial machinery for
          manufacturers, job shops, and production facilities throughout the
          United States and worldwide. Our inventory is continually updated with
          quality late-model equipment that is ready for immediate delivery,
          helping businesses increase production without the long lead times
          associated with purchasing new machinery.
        </p>

        <p className="text-gray-700 mb-10 leading-relaxed">
          Whether you are searching for a vertical machining center,
          horizontal machining center, CNC turning center, Swiss machine,
          fabrication equipment, or manual machinery, our experienced team can
          help you locate the right equipment for your application and budget.
          You can{' '}
          <Link
            href="/inventory"
            className="text-blue-600 underline"
          >
            browse our complete inventory here
          </Link>{' '}
          or contact us directly for assistance locating a specific machine.
        </p>

        <h3 className="text-xl font-semibold mb-4">
          Types of Used Machinery We Offer
        </h3>

        <p className="text-gray-700 mb-10 leading-relaxed">
          Our inventory regularly includes CNC machining centers, CNC lathes,
          horizontal machining centers, vertical machining centers, Swiss
          turning centers, manual mills, manual lathes, grinders, EDM
          equipment, fabrication machinery, press brakes, stamping presses,
          inspection equipment, tooling, and other industrial machinery.
          Browse our{' '}
          <Link
            href="/inventory/cnc-machinery"
            className="text-blue-600 underline"
          >
            CNC Machinery
          </Link>
          ,{' '}
          <Link
            href="/inventory/fabricating-and-stamping"
            className="text-blue-600 underline"
          >
            Fabricating & Stamping
          </Link>
          , and{' '}
          <Link
            href="/inventory/manual-machinery"
            className="text-blue-600 underline"
          >
            Manual Machinery
          </Link>{' '}
          categories to view available equipment.
        </p>

        <h3 className="text-xl font-semibold mb-4">
          Why Buy Used CNC Machines?
        </h3>

        <p className="text-gray-700 mb-10 leading-relaxed">
          Purchasing quality used CNC machinery allows manufacturers to reduce
          capital expenditures while maintaining production capacity. Used
          equipment often provides faster delivery, proven reliability, and
          outstanding value compared to purchasing new machinery. Many machines
          in our inventory are available for immediate shipment, helping
          minimize downtime and keep your operation productive.
        </p>

        <h3 className="text-xl font-semibold mb-6">
          Why Choose Concord Machine Tools
        </h3>

        <div className="space-y-6 text-gray-700 leading-relaxed">

          <p>
            Since 2002, Concord Machine Tools has been a trusted source for
            buying and selling used CNC machines, fabrication equipment, and
            industrial machinery. Based in Michigan's manufacturing corridor,
            we serve customers throughout the United States and around the
            world, connecting buyers and sellers with quality used machinery
            at competitive market prices.
          </p>

          <p>
            We specialize in CNC machining centers, CNC lathes, horizontal and
            vertical machining centers, Swiss-type lathes, grinding machines,
            EDM equipment, press brakes, stamping presses, sheet metal
            fabrication equipment, and many other categories of industrial
            machinery. Our inventory frequently features respected brands such
            as Haas, Mazak, Okuma, Doosan, Makino, Hurco, Fanuc, Amada,
            Mitsubishi, Mori Seiki, DMG MORI, and many others.
          </p>

          <p>
            Every machine listing includes detailed specifications, photographs,
            and accurate condition information whenever available so buyers can
            make informed purchasing decisions. Whether you are expanding your
            facility, replacing existing equipment, or searching for a specific
            machine model, our experienced team is committed to helping you
            identify the right solution.
          </p>

          <p>
            We also assist manufacturers in selling surplus machinery, idle
            assets, and complete manufacturing facilities. Our extensive
            industry network and market knowledge help maximize equipment value
            while simplifying the selling process from start to finish.
          </p>

          <p>
            If you are looking to buy used CNC machines, sell industrial
            equipment, or locate a hard-to-find machine tool, Concord Machine
            Tools provides the experience, inventory, and responsive service to
            help you achieve your manufacturing goals.
          </p>

        </div>

      </section>
      {/* CATEGORY SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold mb-10 text-center">
          Browse Used Machinery by Category
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <Link
            href="/inventory/cnc-machinery"
            className="block bg-white border rounded-lg p-6 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-2">
              CNC Machinery
            </h3>

            <p className="text-sm text-gray-600">
              Used CNC machining centers, turning centers, horizontal and
              vertical machining centers, CNC lathes, and other CNC equipment.
            </p>
          </Link>

          <Link
            href="/inventory/fabricating-and-stamping"
            className="block bg-white border rounded-lg p-6 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-2">
              Fabricating & Stamping
            </h3>

            <p className="text-sm text-gray-600">
              Used press brakes, stamping presses, fabrication equipment,
              forming machinery, and other sheet metal equipment.
            </p>
          </Link>

          <Link
            href="/inventory/manual-machinery"
            className="block bg-white border rounded-lg p-6 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-2">
              Manual Machinery
            </h3>

            <p className="text-sm text-gray-600">
              Used manual lathes, mills, grinders, drill presses, and
              traditional metalworking shop equipment.
            </p>
          </Link>
        </div>

        {/* BRAND LOGOS */}
        <div className="mt-14">
          <h2 className="text-xl font-semibold text-center mb-6">
            We Frequently Stock Used CNC Machines From Leading Manufacturers
          </h2>

          <div className="flex flex-wrap justify-center items-center gap-8">
            <Link
              href="/brands/haas"
              aria-label="Used Haas CNC Machines For Sale"
            >
              <Image
                src="/haaslogo.jpg"
                alt="Used Haas CNC Machines For Sale"
                width={160}
                height={50}
                className="h-10 w-auto object-contain"
              />
            </Link>

            <Link
              href="/brands/doosan"
              aria-label="Used Doosan CNC Machines For Sale"
            >
              <Image
                src="/doosanlogo.jpg"
                alt="Used Doosan CNC Machines For Sale"
                width={160}
                height={50}
                className="h-10 w-auto object-contain"
              />
            </Link>

            <Link
              href="/brands/hurco"
              aria-label="Used Hurco CNC Machines For Sale"
            >
              <Image
                src="/hurcologo.jpg"
                alt="Used Hurco CNC Machines For Sale"
                width={160}
                height={50}
                className="h-10 w-auto object-contain"
              />
            </Link>

            <Link
              href="/brands/mazak"
              aria-label="Used Mazak CNC Machines For Sale"
            >
              <Image
                src="/mazaklogo.jpg"
                alt="Used Mazak CNC Machines For Sale"
                width={160}
                height={50}
                className="h-10 w-auto object-contain"
              />
            </Link>

            <Link
              href="/brands/okuma"
              aria-label="Used Okuma CNC Machines For Sale"
            >
              <Image
                src="/okumalogo.jpg"
                alt="Used Okuma CNC Machines For Sale"
                width={160}
                height={50}
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
