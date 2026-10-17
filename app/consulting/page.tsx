import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Machinery Valuation & Consulting Services | Concord Machine Tools',
  description:
    'Get expert guidance on used CNC machinery values, equipment disposition, replacement planning, and machinery relocation. Concord Machine Tools helps manufacturers make informed equipment decisions.',
  alternates: {
    canonical: 'https://www.concordmt.com/consulting',
  },
  openGraph: {
    title: 'Machinery Valuation & Consulting Services | Concord Machine Tools',
    description:
      'Make informed decisions about your industrial equipment with used machinery valuation, disposition planning, equipment acquisition guidance, and machinery relocation assistance.',
    url: 'https://www.concordmt.com/consulting',
    type: 'website',
  },
};

const services = [
  {
    number: '01',
    title: 'Used Machinery Valuation',
    description:
      'Understand the potential market value of your existing CNC machines, metalworking equipment, and other industrial assets. We consider manufacturer, model, age, configuration, condition, options, and current market demand.',
  },
  {
    number: '02',
    title: 'Equipment Disposition Planning',
    description:
      'Determine whether surplus equipment should be sold, retained, relocated, traded, or considered for scrap. We help you evaluate the practical and financial considerations behind each decision.',
  },
  {
    number: '03',
    title: 'Equipment Replacement Planning',
    description:
      'Evaluate the timing of machinery upgrades and replacements by considering current equipment value, operational requirements, resale potential, and the implications of keeping older equipment in service.',
  },
  {
    number: '04',
    title: 'Machinery Acquisition Guidance',
    description:
      'When your operation needs additional equipment, we can help you consider used machinery options, evaluate available machines, and understand factors that influence value and suitability.',
  },
  {
    number: '05',
    title: 'Rigging & Transportation Coordination',
    description:
      'Machinery moves require the right rigging, trucking, and logistical resources. We can help identify appropriate service providers based on the equipment, facility, destination, and requirements of the move.',
  },
  {
    number: '06',
    title: 'Facility Consolidation & Liquidation',
    description:
      'For plant closures, facility relocations, and manufacturing consolidations, we can help evaluate groups of machines and develop a practical approach to equipment disposition.',
  },
];

const valuationFactors = [
  'Manufacturer, model, and year of manufacture',
  'Machine configuration and available options',
  'CNC control, spindle specifications, and capabilities',
  'Operating hours and maintenance history',
  'Mechanical condition and operational status',
  'Tooling, workholding, and included accessories',
  'Current used machinery supply and market demand',
  'Comparable equipment and potential resale markets',
];

const faqs = [
  {
    question: 'What is a used CNC machine worth?',
    answer:
      'The market value of a used CNC machine depends on its manufacturer, model, age, configuration, condition, options, and current demand. Comparable machines and resale potential also influence value. Providing accurate specifications and photographs helps support a more informed evaluation.',
  },
  {
    question: 'Can you help us decide whether to sell or keep our machinery?',
    answer:
      'Yes. We can help you evaluate the potential resale value of your equipment alongside considerations such as current production needs, future capacity requirements, replacement costs, and the practical implications of retaining or selling the machine.',
  },
  {
    question: 'When should a manufacturer start planning to sell equipment?',
    answer:
      'It is generally useful to evaluate equipment before a replacement, relocation, consolidation, or facility closure becomes urgent. Early planning gives a company more time to understand market value, explore selling options, coordinate removal, and consider how equipment availability may affect production.',
  },
  {
    question: 'Can you help us determine whether a machine should be sold or scrapped?',
    answer:
      'We can help assess whether a machine may have resale potential based on its specifications, condition, completeness, and market demand. Some older or nonoperational machines may still have value, while others may be better suited for parts recovery or scrap. The appropriate decision depends on the individual machine and its circumstances.',
  },
  {
    question: 'Can you help with an entire machine shop or manufacturing facility?',
    answer:
      'Yes. We can discuss equipment evaluations and disposition planning for multiple machines, complete machine shops, manufacturing facilities, and larger equipment liquidations. The appropriate approach depends on the equipment involved, the timeline, and the objectives of the business.',
  },
  {
    question: 'Can you recommend rigging and trucking companies?',
    answer:
      'We can help identify rigging and transportation providers whose capabilities may suit a particular machinery move. Requirements such as machine weight, dimensions, access, lifting points, route, and destination should be considered when selecting service providers.',
  },
  {
    question: 'Do you provide consulting for companies outside Michigan?',
    answer:
      'Concord Machine Tools is based in Troy, Michigan, and works with machinery buyers and sellers throughout the United States and internationally. Contact us to discuss your equipment, location, and consulting requirements.',
  },
];

export default function ConsultingPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Used Machinery Valuation & Consulting',
    description:
      'Consulting services for used CNC machinery and industrial equipment, including machinery valuation, equipment disposition planning, replacement planning, acquisition guidance, and machinery relocation coordination.',
    url: 'https://www.concordmt.com/consulting',
    provider: {
      '@type': 'Organization',
      name: 'Concord Machine Tools',
      url: 'https://www.concordmt.com',
    },
    areaServed: [
      {
        '@type': 'Country',
        name: 'United States',
      },
      {
        '@type': 'Place',
        name: 'Worldwide',
      },
    ],
    serviceType: [
      'Used Machinery Valuation',
      'CNC Machine Valuation',
      'Industrial Equipment Disposition Planning',
      'Machinery Acquisition Guidance',
      'Equipment Replacement Planning',
      'Machinery Relocation Coordination',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <main className="text-slate-800">
        {/* Hero */}
        <section className="bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-300 mb-4">
              Machinery Valuation & Consulting
            </p>

            <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-4xl mb-6">
              Make Better Decisions About Your Industrial Machinery
            </h1>

            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mb-8">
              Should you sell an existing machine, keep it in production,
              replace it, or consider scrapping it? Concord Machine Tools helps
              manufacturers evaluate their machinery, understand potential
              market value, and make informed decisions about their equipment.
            </p>

            <p className="text-slate-300 leading-relaxed max-w-3xl mb-9">
              From individual CNC machine valuations to equipment disposition
              planning for entire facilities, we provide practical guidance
              informed by our experience in the used machinery market.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 px-7 py-3.5 font-semibold text-white transition-colors"
              >
                Discuss Your Equipment
              </Link>

              <Link
                href="/sell"
                className="inline-flex items-center justify-center rounded-md border border-slate-500 hover:bg-slate-800 px-7 py-3.5 font-semibold text-white transition-colors"
              >
                Sell Your Machinery
              </Link>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="max-w-6xl mx-auto px-6 py-14 md:py-18">
          <div className="max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Practical Guidance for Machinery and Equipment Decisions
            </h2>

            <div className="space-y-5 text-slate-700 leading-relaxed">
              <p>
                Industrial machinery represents a significant investment for
                manufacturers. Knowing when to sell a machine, when to replace
                it, and when to retain it can have important financial and
                operational implications.
              </p>

              <p>
                However, equipment decisions are not always straightforward.
                A machine that no longer meets your production requirements may
                still have substantial resale value. An older machine that
                appears obsolete may remain useful to another manufacturer.
                Conversely, equipment that occupies valuable floor space may
                have limited resale potential relative to the cost of moving
                or maintaining it.
              </p>

              <p>
                Concord Machine Tools helps companies assess these situations
                from the perspective of the used machinery market. Our focus is
                on understanding the equipment, evaluating its potential value,
                and helping you consider the available options before making a
                decision.
              </p>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="bg-slate-50 border-y border-slate-200">
          <div className="max-w-6xl mx-auto px-6 py-14 md:py-18">
            <div className="max-w-3xl mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Machinery Consulting Services
              </h2>

              <p className="text-slate-700 leading-relaxed">
                We help manufacturers evaluate existing equipment, plan for
                changing production needs, and consider practical options for
                machinery they no longer need.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <article
                  key={service.number}
                  className="bg-white border border-slate-200 rounded-xl p-6"
                >
                  <p className="text-sm font-bold tracking-widest text-blue-700 mb-3">
                    {service.number}
                  </p>

                  <h3 className="text-xl font-semibold mb-3">
                    {service.title}
                  </h3>

                  <p className="text-slate-700 leading-relaxed">
                    {service.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Core valuation section */}
        <section className="max-w-6xl mx-auto px-6 py-14 md:py-18">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-700 mb-3">
                Our Primary Focus
              </p>

              <h2 className="text-2xl md:text-3xl font-bold mb-5">
                Used Machinery Valuation & Equipment Evaluation
              </h2>

              <div className="space-y-5 text-slate-700 leading-relaxed">
                <p>
                  Understanding what your machinery is worth is often the
                  first step toward making a sound equipment decision. Whether
                  you are considering selling a single CNC machine, replacing
                  older production equipment, or reviewing the assets at an
                  entire facility, a realistic view of the used machinery
                  market can help you plan your next move.
                </p>

                <p>
                  Concord Machine Tools evaluates used CNC machinery,
                  metalworking equipment, and other industrial assets by
                  considering the machine's specifications, condition,
                  configuration, and potential resale market.
                </p>

                <p>
                  A valuation is not simply a calculation based on the original
                  purchase price or the age of a machine. Current demand,
                  comparable equipment, included options, and the practical
                  costs associated with moving and preparing the equipment can
                  all affect the decision.
                </p>

                <p>
                  Our goal is to help you better understand the equipment's
                  potential market position so you can make a more informed
                  decision about selling, retaining, replacing, or otherwise
                  disposing of it.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-5">
                What Influences Used Machinery Value?
              </h3>

              <ul className="space-y-3">
                {valuationFactors.map((factor) => (
                  <li key={factor} className="flex gap-3 text-slate-700">
                    <span
                      aria-hidden="true"
                      className="text-blue-700 font-bold"
                    >
                      ✓
                    </span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 pt-6 border-t border-slate-200">
                <p className="text-slate-700 leading-relaxed mb-5">
                  Have equipment you would like evaluated?
                </p>

                <Link
                  href="/sell"
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 px-6 py-3 font-semibold text-white transition-colors"
                >
                  Submit Machinery Details
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Sell, retain or scrap */}
        <section className="bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-6 py-14 md:py-18">
            <div className="max-w-3xl mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-5">
                Should You Sell, Retain, Replace, or Scrap Your Machinery?
              </h2>

              <p className="text-slate-300 leading-relaxed">
                The right decision depends on more than whether a machine is
                currently being used. Evaluating the available options can
                help you avoid overlooking resale opportunities or spending
                money on equipment that no longer fits your operation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">
                  Sell
                </h3>

                <p className="text-slate-300 leading-relaxed">
                  Consider selling when a machine is surplus, no longer needed,
                  being replaced, or has greater value as a saleable asset than
                  as equipment retained in your facility.
                </p>
              </div>

              <div className="border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">
                  Retain
                </h3>

                <p className="text-slate-300 leading-relaxed">
                  Keeping equipment may make sense when it supports production,
                  provides useful backup capacity, or remains more economical
                  than replacing its capabilities.
                </p>
              </div>

              <div className="border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">
                  Replace
                </h3>

                <p className="text-slate-300 leading-relaxed">
                  Replacement may be worth considering when production
                  requirements change, maintenance becomes burdensome, or a
                  newer machine offers capabilities your operation needs.
                </p>
              </div>

              <div className="border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">
                  Scrap
                </h3>

                <p className="text-slate-300 leading-relaxed">
                  If resale demand is limited or repair and removal costs are
                  disproportionate to potential value, parts recovery or scrap
                  may be worth evaluating.
                </p>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed mt-8 max-w-4xl">
              These options are not mutually exclusive across an entire
              facility. A company may benefit from selling selected machines,
              retaining others, and disposing of equipment with limited
              remaining value. Each machine should be considered on its own
              merits.
            </p>
          </div>
        </section>

        {/* Timing */}
        <section className="max-w-6xl mx-auto px-6 py-14 md:py-18">
          <div className="max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-5">
              When Should You Start Planning Your Machinery Decisions?
            </h2>

            <div className="space-y-5 text-slate-700 leading-relaxed">
              <p>
                The best time to evaluate equipment is often before a sale,
                replacement, or facility move becomes urgent. Early planning
                gives your company more time to understand potential market
                value, consider its options, and coordinate the practical
                requirements of moving or selling machinery.
              </p>

              <p>It may be worth reviewing your equipment when your company is:</p>

              <ul className="list-disc list-inside space-y-2">
                <li>Planning to purchase new CNC machines or production equipment</li>
                <li>Replacing older machines or upgrading production technology</li>
                <li>Reducing unused or surplus equipment</li>
                <li>Expanding production capacity or entering new markets</li>
                <li>Moving to a different manufacturing facility</li>
                <li>Consolidating operations or closing a facility</li>
                <li>Reviewing capital expenditures and equipment investments</li>
              </ul>

              <p>
                Evaluating existing equipment before making a major investment
                can help management consider whether surplus machinery has
                resale potential and whether existing equipment can continue
                meeting operational requirements.
              </p>
            </div>
          </div>
        </section>

        {/* Acquisitions */}
        <section className="bg-slate-50 border-y border-slate-200">
          <div className="max-w-6xl mx-auto px-6 py-14 md:py-18">
            <div className="max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-5">
                Planning for Future Machinery Purchases
              </h2>

              <div className="space-y-5 text-slate-700 leading-relaxed">
                <p>
                  Machinery planning is not only about deciding what to sell.
                  Manufacturers also need to determine when additional
                  equipment is required, whether used machinery could meet
                  production requirements, and how an acquisition fits into
                  their broader equipment strategy.
                </p>

                <p>
                  Concord Machine Tools can help companies consider available
                  used machinery options and evaluate relevant factors such as
                  machine specifications, configuration, condition, and
                  potential market value.
                </p>

                <p>
                  Our experience in the used machinery market can be useful
                  when comparing equipment alternatives, reviewing a machine's
                  suitability for an application, or considering the potential
                  resale implications of an equipment purchase.
                </p>

                <p>
                  You can also browse our{' '}
                  <Link
                    href="/inventory"
                    className="text-blue-700 hover:underline font-medium"
                  >
                    current used CNC machinery and industrial equipment inventory
                  </Link>{' '}
                  to see the types of machines we handle.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Rigging and transportation */}
        <section className="max-w-6xl mx-auto px-6 py-14 md:py-18">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-5">
                Machinery Rigging, Transportation & Relocation
              </h2>

              <div className="space-y-5 text-slate-700 leading-relaxed">
                <p>
                  Moving industrial machinery requires careful planning and
                  service providers equipped to handle the machine's size,
                  weight, configuration, and site requirements.
                </p>

                <p>
                  A CNC machining center, large horizontal boring mill, press
                  brake, and complete production line can each present very
                  different transportation and rigging challenges.
                </p>

                <p>
                  Depending on your requirements, we can help identify
                  appropriate rigging and trucking providers for consideration
                  and help you understand the logistical factors that should be
                  addressed before a move is scheduled.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-5">
                Factors to Consider Before Moving Machinery
              </h3>

              <ul className="list-disc list-inside space-y-3 text-slate-700">
                <li>Machine weight and overall dimensions</li>
                <li>Required lifting equipment and rigging capabilities</li>
                <li>Doorways, ceiling heights, and facility access</li>
                <li>Loading docks, floor conditions, and crane access</li>
                <li>Transportation permits and route restrictions</li>
                <li>Destination access and installation requirements</li>
                <li>Disconnection, preparation, and recommissioning needs</li>
                <li>Scheduling and production downtime considerations</li>
              </ul>

              <p className="text-sm text-slate-600 leading-relaxed mt-6">
                Rigging and transportation requirements should be confirmed
                with appropriately qualified service providers for the specific
                machine and move.
              </p>
            </div>
          </div>
        </section>

        {/* Facility planning */}
        <section className="bg-slate-50 border-y border-slate-200">
          <div className="max-w-6xl mx-auto px-6 py-14 md:py-18">
            <div className="max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-5">
                Equipment Planning for Facility Moves & Liquidations
              </h2>

              <div className="space-y-5 text-slate-700 leading-relaxed">
                <p>
                  Facility relocations, manufacturing consolidations, and plant
                  closures often involve decisions about dozens of machines
                  and other industrial assets. Each machine may have a
                  different market value, removal cost, and disposition path.
                </p>

                <p>
                  Evaluating the equipment early can help companies distinguish
                  between machines worth marketing for resale, equipment that
                  should be retained or relocated, and assets that may have
                  limited economic value.
                </p>

                <p>
                  Concord Machine Tools can discuss equipment evaluations and
                  potential disposition strategies for individual machines,
                  multiple-machine groups, and complete manufacturing
                  facilities.
                </p>

                <p>
                  If you already know you have equipment to sell, visit our{' '}
                  <Link
                    href="/sell"
                    className="text-blue-700 hover:underline font-medium"
                  >
                    Sell Your Machine page
                  </Link>{' '}
                  to submit your machinery details.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-6xl mx-auto px-6 py-14 md:py-18">
          <div className="max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">
              Machinery Valuation & Consulting FAQs
            </h2>

            <div className="space-y-7">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="text-lg md:text-xl font-semibold mb-2">
                    {faq.question}
                  </h3>

                  <p className="text-slate-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-blue-700 text-white">
          <div className="max-w-6xl mx-auto px-6 py-14 md:py-16 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-5">
              Need Help Evaluating Your Machinery?
            </h2>

            <p className="text-blue-100 leading-relaxed max-w-3xl mx-auto mb-8">
              Whether you are reviewing the value of a single CNC machine,
              planning an equipment upgrade, or evaluating machinery across an
              entire facility, Concord Machine Tools can help you consider your
              options.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-white text-blue-800 hover:bg-blue-50 px-7 py-3.5 font-semibold transition-colors"
              >
                Contact Our Team
              </Link>

              <Link
                href="/sell"
                className="inline-flex items-center justify-center rounded-md border border-white/60 hover:bg-blue-800 px-7 py-3.5 font-semibold transition-colors"
              >
                Submit Machinery for Evaluation
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
