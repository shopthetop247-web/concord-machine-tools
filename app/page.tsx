export const revalidate = 0;

import Link from 'next/link';
import { Metadata } from 'next';
import Image from 'next/image';
import { client } from '@/lib/sanityClient';

export const metadata: Metadata = {
  title: {
    absolute: 'Used CNC Machines for Sale | Concord Machine Tools',
  },
  description:
    'Buy and sell used CNC machines and industrial machinery with Concord Machine Tools. Browse CNC mills, lathes, machining centers, and fabrication equipment.',
  alternates: {
    canonical: 'https://www.concordmt.com',
  },
  openGraph: {
    title: 'Used CNC Machines for Sale | Concord Machine Tools',
    description:
      'Buy and sell used CNC machines, machining centers, lathes, mills, and industrial manufacturing equipment with Concord Machine Tools.',
    url: 'https://www.concordmt.com',
    siteName: 'Concord Machine Tools',
    type: 'website',
  },
};

export default async function HomePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://www.concordmt.com/#organization',
        name: 'Concord Machine Tools',
        url: 'https://www.concordmt.com',
        description:
          'Concord Machine Tools is a Michigan-based dealer specializing in the purchase, sale, sourcing, and valuation of used CNC machines, metalworking machinery, and industrial manufacturing equipment. Serving manufacturers throughout the United States and worldwide.',
        foundingDate: '2002',
        telephone: '+1-248-224-3147',
        email: 'sales@concordmt.com',

        address: {
          '@type': 'PostalAddress',
          streetAddress: '200 East Big Beaver Road',
          addressLocality: 'Troy',
          addressRegion: 'MI',
          postalCode: '48083',
          addressCountry: 'US',
        },

        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+1-248-224-3147',
          email: 'sales@concordmt.com',
          contactType: 'sales',
          availableLanguage: 'English',
        },

        areaServed: [
          {
            '@type': 'Country',
            name: 'United States',
          },
          'Worldwide',
        ],

        knowsAbout: [
          'Used Machinery',
          'Used CNC Machines',
          'CNC Machining Centers',
          'CNC Lathes',
          'CNC Milling Machines',
          'Horizontal Machining Centers',
          'Vertical Machining Centers',
          'Swiss-Type CNC Lathes',
          'Used Industrial Machinery',
          'Metalworking Equipment',
          'Fabricating and Stamping Equipment',
          'Press Brakes',
          'Stamping Presses',
          'Grinding Machines',
          'EDM Equipment',
          'Used Machinery Purchasing',
          'Industrial Equipment Sales',
          'Used Machinery Valuations',
          'Surplus Manufacturing Equipment',
          'Industrial Machinery Consulting',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://www.concordmt.com/#website',
        url: 'https://www.concordmt.com',
        name: 'Concord Machine Tools',
        publisher: {
          '@id': 'https://www.concordmt.com/#organization',
        },
        inLanguage: 'en-US',
      },
    ],
  };

  const machines = await client.fetch(`
    *[
      _type == "machine" &&
      defined(slug.current) &&
      defined(category->slug.current) &&
      defined(subcategory->slug.current)
    ] | order(_createdAt desc)[0...4]{
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
    <div>
      {/* Organization and Website Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      {/* HERO */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-semibold mb-6">
            Used CNC Machines & Metalworking Machinery for Sale
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10">
            Concord Machine Tools specializes in buying, selling, sourcing,
            and valuing used CNC machines and industrial manufacturing
            equipment for manufacturers throughout the United States and
            worldwide.
          </p>

          <p className="mb-10 text-base md:text-lg text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Browse our inventory of used CNC machining centers, CNC lathes,
            milling machines, grinders, fabrication equipment, and other
            metalworking machinery from leading manufacturers including{' '}
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
            , and many others.
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
            Explore the latest additions to our used machinery inventory.
            We regularly acquire quality CNC machining centers, CNC lathes,
            fabrication equipment, manual machinery, and industrial
            equipment from leading manufacturers. Check back often as
            our inventory is updated with newly available machines.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {machines.map((machine: any) => (
              <Link
                key={machine._id}
                href={`/inventory/${machine.category.slug.current}/${machine.subcategory.slug.current}/${machine.slug.current}`}
                className="block bg-white border rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                {machine.images?.[0]?.asset?.url && (
                  <div className="relative w-full h-48">
                    <Image
                      src={machine.images[0].asset.url}
                      alt={`${machine.name} - used machine for sale`}
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

      {/* HOMEPAGE SEO CONTENT */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Your Source for Used CNC Machines & Industrial Machinery
        </h2>

        <p className="text-gray-700 mb-6 leading-relaxed">
          Concord Machine Tools is a U.S. dealer of used CNC machine tools
          and industrial manufacturing equipment, specializing in the
          purchase, sale, sourcing, and valuation of quality used machinery.
          We work with manufacturers, machine shops, and production
          facilities looking to buy or sell CNC machining centers, CNC
          lathes, milling machines, grinders, fabrication equipment, and
          other metalworking machinery.
        </p>

        <p className="text-gray-700 mb-10 leading-relaxed">
          Our inventory includes equipment from established manufacturers
          and covers a wide range of manufacturing applications. Whether
          you need a vertical machining center, horizontal machining center,
          CNC turning center, Swiss-type lathe, or metal fabrication machine,
          our team can help you identify equipment that meets your
          requirements.{' '}
          <Link
            href="/inventory"
            className="text-blue-600 underline"
          >
            Browse our complete used machinery inventory
          </Link>{' '}
          or contact us for assistance locating a specific machine.
        </p>

        <h3 className="text-xl font-semibold mb-4">
          Used CNC Machines, Metalworking & Fabrication Equipment
        </h3>

        <p className="text-gray-700 mb-10 leading-relaxed">
          Our used machinery inventory regularly includes CNC vertical and
          horizontal machining centers, CNC turning centers, Swiss-type
          lathes, manual mills, manual lathes, surface and cylindrical
          grinders, EDM equipment, press brakes, stamping presses, plate
          rolls, fabrication machinery, inspection equipment, and other
          industrial manufacturing assets. Explore our major equipment
          categories:
          {' '}
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
          </Link>
          .
        </p>

        <h3 className="text-xl font-semibold mb-4">
          Buy Used CNC Machines & Industrial Equipment
        </h3>

        <p className="text-gray-700 mb-10 leading-relaxed">
          Purchasing quality used CNC machinery can help manufacturers
          expand production capacity, reduce capital investment, and
          acquire equipment without the lead times sometimes associated
          with ordering new machines. From production CNC lathes and
          machining centers to specialized fabrication and metalworking
          equipment, used machinery offers buyers additional options when
          planning equipment purchases. Our team can help you review
          available machines and discuss sourcing opportunities when a
          particular model or configuration is not listed in our inventory.
        </p>

        <h3 className="text-xl font-semibold mb-4">
          Sell Your Used CNC Machines & Surplus Machinery
        </h3>

        <p className="text-gray-700 mb-10 leading-relaxed">
          Concord Machine Tools also purchases used CNC machines and
          industrial equipment from manufacturers, machine shops, and
          businesses throughout the United States. Whether you are
          replacing older equipment, selling surplus machinery, liquidating
          idle assets, or transitioning manufacturing operations, we can
          review your equipment and discuss a potential purchase.
          We evaluate a wide range of machinery, including CNC machining
          centers, lathes, grinders, fabrication equipment, and complete
          manufacturing assets. Visit our{' '}
          <Link
            href="/sell"
            className="text-blue-600 underline"
          >
            Sell Your Machinery
          </Link>{' '}
          page to learn more.
        </p>

        <h3 className="text-xl font-semibold mb-4">
          Machinery Valuations, Consulting & Equipment Sourcing
        </h3>

        <p className="text-gray-700 mb-10 leading-relaxed">
          Establishing the fair market value of used industrial machinery
          requires an understanding of equipment specifications, age,
          condition, configuration, demand, and current market conditions.
          Concord Machine Tools assists manufacturers with machinery
          evaluations, selling guidance, and equipment sourcing. We can
          help businesses assess surplus equipment, consider selling
          options, and identify machinery that meets their manufacturing
          requirements. Learn more about our{' '}
          <Link
            href="/consulting"
            className="text-blue-600 underline"
          >
            machinery consulting services
          </Link>
          .
        </p>

        <h3 className="text-xl font-semibold mb-6">
          Why Choose Concord Machine Tools?
        </h3>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            Since 2002, Concord Machine Tools has helped manufacturers
            buy and sell used CNC machines, fabrication equipment, and
            industrial machinery. Based in Michigan, we serve customers
            throughout the United States and internationally, connecting
            equipment buyers and sellers through our industry experience
            and network of manufacturing contacts.
          </p>

          <p>
            We specialize in CNC machining centers, CNC lathes, horizontal
            and vertical machining centers, Swiss-type lathes, grinding
            machines, EDM equipment, press brakes, stamping presses,
            sheet metal fabrication equipment, and many other categories
            of industrial machinery. Our inventory frequently features
            respected manufacturers such as Haas, Mazak, Okuma, Doosan,
            Makino, Hurco, FANUC, Amada, Mitsubishi, Mori Seiki, DMG MORI,
            and many others.
          </p>

          <p>
            We provide detailed machine specifications, photographs, and
            available condition information to help buyers evaluate
            equipment. Whether you are expanding your facility, replacing
            existing machinery, or searching for a specific machine model,
            our team can assist with identifying potential equipment
            solutions.
          </p>

          <p>
            Our business also focuses on purchasing surplus machinery and
            helping manufacturers evaluate equipment they no longer need.
            From individual CNC machines to larger groups of industrial
            assets, we work with businesses to discuss practical selling
            and equipment disposition options.
          </p>

          <p>
            Whether you are looking to buy used CNC machines, sell
            industrial equipment, obtain a machinery valuation, or locate
            a hard-to-find machine tool, Concord Machine Tools provides
            the experience and industry connections to help with your
            equipment needs.
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
              Used CNC machining centers, turning centers, horizontal
              and vertical machining centers, CNC lathes, and other
              CNC equipment.
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
            Used CNC Machines From Leading Manufacturers
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
    </div>
  );
}
