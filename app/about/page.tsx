import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Concord Machine Tools | Used CNC & Industrial Machinery Dealer',
  description:
    'Learn about Concord Machine Tools, a Michigan-based dealer specializing in used CNC machines, metalworking equipment, machinery purchasing, sales, sourcing, and valuations.',
  keywords: [
    'Concord Machine Tools',
    'used CNC machinery dealer',
    'used industrial machinery dealer',
    'used metalworking machinery',
    'used CNC machine buyers',
    'used CNC machines for sale',
    'industrial machinery buyers',
    'surplus machinery buyers',
    'CNC machinery valuations',
    'used manufacturing equipment',
    'Michigan machinery dealer',
    'industrial equipment purchasing',
    'metalworking machinery sales',
  ],
  alternates: {
    canonical: 'https://www.concordmt.com/about',
  },
  openGraph: {
    title: 'About Concord Machine Tools | Used CNC & Industrial Machinery Dealer',
    description:
      'Discover Concord Machine Tools, a Michigan-based dealer specializing in used CNC machinery, industrial equipment purchasing, sales, sourcing, and valuations.',
    url: 'https://www.concordmt.com/about',
    siteName: 'Concord Machine Tools',
    type: 'website',
  },
};

export default function AboutPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': 'https://www.concordmt.com/about#webpage',
    url: 'https://www.concordmt.com/about',
    name: 'About Concord Machine Tools',
    description:
      'Learn about Concord Machine Tools, a Michigan-based dealer specializing in the purchase, sale, sourcing, and valuation of used CNC machines, metalworking machinery, and industrial manufacturing equipment.',
    isPartOf: {
      '@id': 'https://www.concordmt.com/#website',
    },
    about: {
      '@id': 'https://www.concordmt.com/#organization',
    },
    mainEntity: {
      '@id': 'https://www.concordmt.com/#organization',
    },
  };

  return (
    <>
      {/* About Page Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      <main className="max-w-5xl mx-auto px-6 py-16">

        {/* Introduction */}
        <section className="space-y-6 text-slate-700 leading-relaxed">

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            About Concord Machine Tools
          </h1>

          <p>
            <strong>Concord Machine Tools</strong> is a Michigan-based dealer
            specializing in the purchase, sale, sourcing, and valuation of
            quality used CNC machines, metalworking machinery, and industrial
            manufacturing equipment. We work with manufacturers, machine
            shops, fabrication companies, and industrial businesses throughout
            the United States and around the world, helping connect buyers and
            sellers of pre-owned manufacturing equipment.
          </p>

          <p>
            Our business is built around understanding the used machinery
            marketplace and providing practical equipment solutions for
            manufacturers. Whether a company is looking to purchase a CNC
            machining center, sell surplus production equipment, liquidate
            machinery from a facility, or determine the market value of an
            industrial asset, Concord Machine Tools provides knowledgeable
            assistance throughout the process.
          </p>

          <p>
            We understand that buying or selling industrial machinery is an
            important business decision. Equipment represents a significant
            investment, and determining its market value, identifying the
            appropriate buyer, and coordinating a successful transaction all
            require industry knowledge and attention to detail. Our goal is to
            make those transactions as straightforward and productive as
            possible.
          </p>

        </section>

        {/* What We Do */}
        <section className="mt-14 space-y-6 text-slate-700 leading-relaxed">

          <h2 className="text-2xl font-semibold text-slate-900">
            Our Specialization in Used CNC and Industrial Machinery
          </h2>

          <p>
            Concord Machine Tools focuses on used metalworking machinery and
            industrial manufacturing equipment from leading machine tool
            manufacturers. Our experience encompasses a broad range of
            equipment used in machining, fabrication, stamping, and general
            manufacturing operations.
          </p>

          <p>
            CNC equipment is an important part of our business. We regularly
            work with vertical machining centers, horizontal machining centers,
            CNC lathes, turning centers, five-axis machining centers, CNC
            grinders, boring mills, and other specialized machine tools.
            Manufacturers such as Haas, Mazak, Okuma, Doosan, Hurco, DMG MORI,
            Makino, Mori Seiki, and many others are commonly represented in
            the used machinery marketplace we serve.
          </p>

          <p>
            In addition to CNC machinery, we handle a variety of conventional
            metalworking and fabrication equipment, including manual milling
            machines, engine lathes, surface grinders, press brakes, shears,
            stamping presses, saws, plasma cutting systems, and other
            industrial equipment.
          </p>

          <p>
            Our inventory changes frequently as machines are purchased and
            sold. We also work with customers seeking specific manufacturers,
            models, machine configurations, and production capabilities.
            Whether you are looking for one machine or equipment to support
            an entire manufacturing operation, we welcome the opportunity to
            assist.
          </p>

          <p>
            <Link
              href="/inventory"
              className="text-blue-600 hover:underline font-medium"
            >
              Browse our current used CNC machines and industrial equipment inventory.
            </Link>
          </p>

        </section>

        {/* Buying and Selling */}
        <section className="mt-14 space-y-6 text-slate-700 leading-relaxed">

          <h2 className="text-2xl font-semibold text-slate-900">
            Buying and Selling Used Industrial Machinery
          </h2>

          <p>
            One of our primary areas of expertise is purchasing and selling
            used industrial machinery. We work with companies that are
            upgrading equipment, consolidating operations, replacing older
            machines, relocating facilities, or simply selling machinery that
            is no longer needed.
          </p>

          <p>
            For businesses with surplus equipment, we purchase individual
            machines, multiple pieces of machinery, and larger collections
            of manufacturing assets. Depending on the equipment and
            circumstances, we can also discuss alternative disposition
            strategies, including auction solutions when appropriate.
          </p>

          <p>
            On the purchasing side, we help manufacturers locate quality
            pre-owned equipment that meets their operational requirements.
            Our ongoing involvement in the machinery marketplace allows us
            to work with both available inventory and additional sourcing
            opportunities.
          </p>

          <p>
            We believe successful machinery transactions begin with clear
            communication, realistic market expectations, and an understanding
            of the equipment involved. Whether buying or selling, our objective
            is to create practical solutions that benefit everyone involved.
          </p>

          <p>
            If you have machinery to sell, visit our{' '}
            <Link
              href="/sell"
              className="text-blue-600 hover:underline font-medium"
            >
              Sell Your Machine
            </Link>{' '}
            page to learn more about our purchasing process and submit your
            equipment information.
          </p>

        </section>

        {/* Machinery Valuations and Consulting */}
        <section className="mt-14 space-y-6 text-slate-700 leading-relaxed">

          <h2 className="text-2xl font-semibold text-slate-900">
            Used Machinery Valuations and Equipment Consulting
          </h2>

          <p>
            Determining the market value of used manufacturing equipment
            requires more than looking at an original purchase price or
            comparing a few online listings. Machine condition, age,
            manufacturer, configuration, control system, operating hours,
            available tooling, and current market demand can all influence
            the value of an industrial machine.
          </p>

          <p>
            Concord Machine Tools understands the importance of evaluating
            these factors when buying, selling, or planning the disposition
            of surplus machinery. We consider the equipment itself, its
            configuration, its overall condition, and the current market
            environment when assessing potential market value.
          </p>

          <p>
            We also recognize that selling machinery is not always the only
            consideration. Manufacturers may need help deciding whether to
            retain equipment, replace it, sell it, or remove it from a
            facility. Timing, production requirements, equipment relocation,
            and market conditions can all play a role in those decisions.
          </p>

          <p>
            Through our machinery consulting services, we help businesses
            evaluate equipment-related decisions and explore practical
            solutions. We can also assist with referrals to qualified rigging
            and transportation providers when machinery needs to be moved.
          </p>

          <p>
            Learn more about our{' '}
            <Link
              href="/consulting"
              className="text-blue-600 hover:underline font-medium"
            >
              Used Machinery Consulting Services
            </Link>{' '}
            and how we can help with equipment evaluations, selling decisions,
            and machinery-related planning.
          </p>

        </section>

        {/* Our Approach */}
        <section className="mt-14 space-y-6 text-slate-700 leading-relaxed">

          <h2 className="text-2xl font-semibold text-slate-900">
            Our Approach to Customer Relationships
          </h2>

          <p>
            At Concord Machine Tools, we believe long-term business
            relationships are built on reliability, industry knowledge,
            responsiveness, and straightforward communication. We recognize
            that every manufacturing business has different equipment needs
            and that every machinery transaction presents its own set of
            considerations.
          </p>

          <p>
            We take the time to understand what our customers are looking to
            accomplish, whether that means locating a specific CNC machine,
            evaluating surplus equipment, purchasing machinery from a
            manufacturing facility, or exploring options for an entire
            equipment inventory.
          </p>

          <p>
            As a Michigan-based machinery dealer serving domestic and
            international customers, we work with businesses across a wide
            range of manufacturing industries. Our focus remains on providing
            knowledgeable assistance, identifying opportunities, and helping
            customers make informed decisions about their industrial
            machinery.
          </p>

        </section>

        {/* Closing */}
        <section className="mt-14 p-8 bg-slate-50 rounded-lg space-y-5 text-slate-700 leading-relaxed">

          <h2 className="text-2xl font-semibold text-slate-900">
            Contact Concord Machine Tools
          </h2>

          <p>
            Whether you are interested in purchasing used CNC machinery,
            selling surplus manufacturing equipment, obtaining assistance
            with a machinery valuation, or discussing an upcoming equipment
            project, we welcome the opportunity to work with you.
          </p>

          <p>
            Contact Concord Machine Tools to discuss your machinery
            requirements and discover how we can assist with your used CNC
            and industrial equipment needs.
          </p>

          <Link
            href="/contact"
            className="inline-block text-blue-600 hover:underline font-semibold"
          >
            Contact Concord Machine Tools →
          </Link>

        </section>

      </main>
    </>
  );
}
