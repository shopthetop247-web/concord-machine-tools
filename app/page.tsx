export const revalidate = 0;

import Link from 'next/link';
import Head from 'next/head';
import { Metadata } from 'next';
import Image from 'next/image';
import { client } from '@/lib/sanityClient';

export const metadata: Metadata = {
  title: 'Used Machines for Sale - CNC & Fabricating Machinery',
  description:
    'Buy & sell used machinery, used Haas, used CNC machines, lathes, mills, and metalworking equipment. Trusted dealer offering a wide inventory, and fair pricing.',

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
            Specializing in CNC machining centers, lathes, mills, and industrial equipment —
            wide ranging & budget friendly options.
          </p>

          <p className="mb-10 text-base md:text-lg text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Browse a continually updated inventory of used CNC machines for sale, including CNC mills, lathes,
            machining centers, and metalworking equipment from trusted brands like{' '}
            <Link href="/brands/haas" className="underline">Haas</Link>,{' '}
            <Link href="/brands/mazak" className="underline">Mazak</Link>,{' '}
            <Link href="/brands/okuma" className="underline">Okuma</Link>, and{' '}
            <Link href="/brands/doosan" className="underline">Doosan</Link>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/inventory" className="bg-blue-600 px-8 py-3 rounded-md">
              View Inventory
            </Link>

            <Link href="/sell" className="border px-8 py-3 rounded-md">
              Sell Your Machine
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
          Concord Machine Tools is a trusted source for used CNC machines for sale, offering a wide selection
          of machining centers, CNC lathes, and metalworking equipment for manufacturers, job shops, and production
          facilities across the United States. Our inventory is continually updated with late-model machines that are
          ready for immediate delivery, helping businesses increase capacity without the long lead times associated with new equipment.
        </p>

        <p className="text-gray-700 mb-10 leading-relaxed">
          Whether you are looking for a vertical machining center, horizontal machining center, or CNC turning center,
          our team can help you find the right machine for your application and budget. You can{' '}
          <Link href="/inventory" className="text-blue-600 underline">
            browse all available inventory here
          </Link>{' '}
          or contact us directly for current availability.
        </p>

        <h3 className="text-xl font-semibold mb-4">Types of Used Machinery We Offer</h3>

        <p className="text-gray-700 mb-10 leading-relaxed">
          We regularly stock a range of equipment including CNC machining centers, CNC lathes, manual mills,
          fabrication equipment, and shop support machinery. Popular categories include{' '}
          <Link href="/inventory/cnc-machinery" className="text-blue-600 underline">
            CNC machinery
          </Link>,{' '}
          <Link href="/inventory/fabricating-and-stamping" className="text-blue-600 underline">
            fabricating and stamping equipment
          </Link>, and{' '}
          <Link href="/inventory/manual-machinery" className="text-blue-600 underline">
            manual machinery
          </Link>. Our inventory often includes machines from leading brands known for reliability and performance.
        </p>

        <h3 className="text-xl font-semibold mb-4">Why Buy Used CNC Machines?</h3>

        <p className="text-gray-700 mb-10 leading-relaxed">
          Purchasing used CNC machines allows manufacturers to significantly reduce capital costs while maintaining
          production capabilities. Pre-owned equipment offers faster delivery, proven performance, and strong return on investment.
          Many of our machines are available for immediate shipment, helping minimize downtime and keep your operations running efficiently.
        </p>

        <h3 className="text-xl font-semibold mb-4">Why Choose Concord Machine Tools</h3>

        <p className="text-gray-700 leading-relaxed">
          Since 2002, Concord Machine Tools has been buying and selling used machinery with a focus on transparency,
          fair pricing, and responsive service. Located in Michigan’s manufacturing corridor, we work with companies
          nationwide and globally. Whether you are buying or selling equipment, our experienced team provides straightforward
          guidance and market expertise to help you make informed decisions.
        </p>
      </section>

      {/* CATEGORY SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold mb-10 text-center">
          Browse Machinery by Category
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
        <Link href="/inventory/cnc-machinery" className="block bg-white border rounded-lg p-6 hover:shadow-lg transition">
        <h3 className="text-lg font-semibold mb-2">CNC Machinery</h3>
        <p className="text-sm text-gray-600">
          CNC machining centers, turning centers, horizontal and vertical machines.
        </p>
      </Link>


        <Link href="/inventory/fabricating-and-stamping" className="block bg-white border rounded-lg p-6 hover:shadow-lg transition">
        <h3 className="text-lg font-semibold mb-2">Fabricating & Stamping</h3>
        <p className="text-sm text-gray-600">
          Press brakes, stamping presses, fabrication and forming equipment.
        </p>
      </Link>


          <Link href="/inventory/manual-machinery" className="block bg-white border rounded-lg p-6 hover:shadow-lg transition">
        <h3 className="text-lg font-semibold mb-2">Manual Machinery</h3>
        <p className="text-sm text-gray-600">
          Manual lathes, mills, grinders, and traditional shop equipment.
        </p>
      </Link>
    </div>
      
    {/* BRAND LOGOS */}
    <div className="mt-14">
      <h2 className="text-xl font-semibold text-center mb-6">
        We frequently stock late-model CNC machines from leading manufacturers:
      </h2>

      <div className="flex flex-wrap justify-center items-center gap-8">
        <Link href="/brands/haas"><img src="/haaslogo.jpg" alt="Used Haas CNC Machines For Sale" className="h-10" /></Link>
        <Link href="/brands/doosan"><img src="/doosanlogo.jpg" alt="Used Doosan CNC Machines For Sale" className="h-10" /></Link>
        <Link href="/brands/hurco"><img src="/hurcologo.jpg" alt="Used Hurco CNC Machines For Sale" className="h-10" /></Link>
        <Link href="/brands/mazak"><img src="/mazaklogo.jpg" alt="Used Mazak CNC Machines For Sale" className="h-10" /></Link>
        <Link href="/brands/okuma"><img src="/okumalogo.jpg" alt="Used Okuma CNC Machines For Sale" className="h-10" /></Link>
      </div>
    </div>
  </section>


      {/* RECENT MACHINES */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-center mb-10">
            Recently Added Machines
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {machines.map((machine: any) => (
              <Link
                key={machine._id}
                href={`/inventory/${machine.category?.slug?.current}/${machine.subcategory?.slug?.current}/${machine.slug.current}`}
                className="block bg-white border rounded-lg overflow-hidden"
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
            <Link href="/inventory" className="bg-blue-600 text-white px-6 py-3 rounded-md">
              View All Inventory
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
