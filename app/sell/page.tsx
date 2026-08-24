import { Metadata } from 'next';
import Link from 'next/link';
import SellYourMachineForm from '@/components/SellYourMachineForm';

export const metadata: Metadata = {
  title: 'Sell Used CNC Machines & Machinery | Concord Machine Tools',
  description:
    'Sell your used CNC machine or metalworking equipment to Concord Machine Tools. We buy CNC mills, lathes, machining centers and industrial machinery nationwide.',
  openGraph: {
    title: 'Sell Used CNC Machines & Machinery | Concord Machine Tools',
    description:
      'Sell your used CNC machine or metalworking equipment. Concord Machine Tools buys CNC mills, lathes, machining centers and other industrial machinery.',
    type: 'website',
    url: 'https://www.concordmt.com/sell',
  },
};

export default function SellPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Sell Used CNC & Metalworking Machinery',
    description:
      'Concord Machine Tools purchases used CNC machines, metalworking equipment, and industrial machinery from manufacturers, machine shops, and other businesses.',
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
    serviceType: 'Used CNC and Metalworking Machinery Purchasing',
    url: 'https://www.concordmt.com/sell',
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <main>
        {/* Hero / Introduction */}
        <section className="max-w-5xl mx-auto px-6 pt-12 pb-8 md:pt-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Sell Your Used CNC Machine or Metalworking Equipment
          </h1>

          <div className="space-y-5 text-slate-700 leading-relaxed">
            <p>
              Do you have a used CNC machine, surplus metalworking equipment,
              or other industrial machinery that you no longer need?
              <strong> Concord Machine Tools</strong> purchases used CNC
              machines and metalworking equipment from manufacturers, machine
              shops, fabricators, and other businesses throughout the United
              States.
            </p>

            <p>
              Whether you are selling a single CNC machine, multiple machines,
              surplus equipment, or an entire manufacturing facility, our team
              can evaluate your equipment and discuss the best way to move
              forward. We specialize in the purchase and resale of used CNC
              machinery and industrial manufacturing equipment.
            </p>

            <p>
              Based in Troy, Michigan, Concord Machine Tools serves sellers
              throughout the United States and internationally. Submit your
              machine information below to begin the evaluation process.
            </p>
          </div>
        </section>

        {/* Machine Categories */}
        <section className="max-w-5xl mx-auto px-6 py-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-5">
            We Buy Used CNC & Metalworking Machinery
          </h2>

          <p className="text-slate-700 leading-relaxed mb-6">
            Concord Machine Tools evaluates a wide range of used CNC machines,
            machine tools, fabricating equipment, and other industrial
            machinery. Equipment is considered based on factors such as
            manufacturer, model, configuration, condition, age, options, and
            current market demand.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3 text-slate-700">
            <ul className="list-disc list-inside space-y-2">
              <li>CNC Vertical Machining Centers</li>
              <li>CNC Horizontal Machining Centers</li>
              <li>CNC Mills</li>
              <li>CNC Lathes & Turning Centers</li>
              <li>5-Axis Machining Centers</li>
              <li>Multi-Axis CNC Machines</li>
            </ul>

            <ul className="list-disc list-inside space-y-2">
              <li>Swiss-Type CNC Lathes</li>
              <li>CNC Grinders</li>
              <li>EDM Machines</li>
              <li>Boring Mills</li>
              <li>Manual Mills & Lathes</li>
              <li>Fabricating Machinery</li>
            </ul>

            <ul className="list-disc list-inside space-y-2">
              <li>Press Brakes</li>
              <li>Stamping Presses</li>
              <li>Laser Cutting Equipment</li>
              <li>Plasma Cutting Equipment</li>
              <li>Waterjet Cutting Equipment</li>
              <li>Other Metalworking Machinery</li>
            </ul>
          </div>

          <p className="text-slate-700 leading-relaxed mt-6">
            We consider equipment from many major machine tool manufacturers,
            including{' '}
            <Link
              href="/brands/haas"
              className="text-blue-700 hover:underline font-medium"
            >
              Haas
            </Link>
            ,{' '}
            <Link
              href="/brands/mazak"
              className="text-blue-700 hover:underline font-medium"
            >
              Mazak
            </Link>
            ,{' '}
            <Link
              href="/brands/okuma"
              className="text-blue-700 hover:underline font-medium"
            >
              Okuma
            </Link>
            ,{' '}
            <Link
              href="/brands/doosan"
              className="text-blue-700 hover:underline font-medium"
            >
              Doosan
            </Link>
            ,{' '}
            <Link
              href="/brands/hurco"
              className="text-blue-700 hover:underline font-medium"
            >
              Hurco
            </Link>
            ,{' '}
            <Link
              href="/brands/makino"
              className="text-blue-700 hover:underline font-medium"
            >
              Makino
            </Link>
            , and many others.
          </p>
        </section>

        {/* Selling Options */}
        <section className="max-w-5xl mx-auto px-6 py-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            Sell One Machine or an Entire Facility
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-slate-700">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">
                Single Machines
              </h3>
              <p className="leading-relaxed">
                Have one CNC machine or other piece of equipment you no longer
                need? We evaluate individual machines across a wide range of
                manufacturers, models, ages, and configurations.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">
                Multiple Machines
              </h3>
              <p className="leading-relaxed">
                If your company is upgrading equipment, downsizing,
                consolidating operations, or replacing a group of machines, we
                can evaluate multiple pieces of equipment together.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">
                Complete Shops & Facilities
              </h3>
              <p className="leading-relaxed">
                For machine shop closures, facility relocations, plant
                consolidations, and larger equipment liquidations, we can
                evaluate groups of CNC and metalworking machinery and discuss
                appropriate selling solutions.
              </p>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="max-w-5xl mx-auto px-6 py-10">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-center">
              Request a Used CNC Machine Evaluation
            </h2>

            <p className="mb-6 text-center text-slate-700 leading-relaxed max-w-3xl mx-auto">
              Tell us about the machine or equipment you have available. Include
              the manufacturer, model, year, condition, controls, options, and
              any other information you have available. The more information
              you provide, the easier it is for our team to evaluate the
              equipment.
            </p>

            {/* Existing form component intentionally preserved */}
            <SellYourMachineForm
              title="Sell Your Machine"
              description="Provide details below for a fast evaluation."
              tip="📌 Tip: Include condition, tooling, controls, and a price idea to speed up our response."
            />
          </div>
        </section>

        {/* Selling Process */}
        <section className="max-w-5xl mx-auto px-6 py-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            How to Sell Your CNC Machine
          </h2>

          <div className="space-y-6 text-slate-700">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">
                1. Submit Your Machine Information
              </h3>
              <p className="leading-relaxed">
                Start by providing the manufacturer, model, year, condition,
                location, and other relevant information about your equipment.
                Photos, machine hours, controls, options, and tooling can also
                be helpful.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">
                2. We Evaluate Your Equipment
              </h3>
              <p className="leading-relaxed">
                We review the machine's specifications, configuration, age,
                condition, location, and other factors that can affect its
                current used-equipment market value.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">
                3. Discuss the Selling Opportunity
              </h3>
              <p className="leading-relaxed">
                After reviewing the information, we can discuss the equipment
                and determine whether it is a fit for our current purchasing
                and resale needs.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">
                4. Coordinate the Transaction
              </h3>
              <p className="leading-relaxed">
                When a transaction is completed, machine removal and
                transportation can be coordinated according to the
                circumstances of the sale.
              </p>
            </div>
          </div>
        </section>

        {/* Machine Value */}
        <section className="max-w-5xl mx-auto px-6 py-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-5">
            How Much Is My Used CNC Machine Worth?
          </h2>

          <div className="space-y-5 text-slate-700 leading-relaxed">
            <p>
              Determining the value of a used CNC machine involves much more
              than simply looking at its original purchase price or age. The
              current market value of a machine depends on its specifications,
              configuration, condition, and demand for that particular type of
              equipment.
            </p>

            <p>
              Factors that can affect the value of used CNC machinery include:
            </p>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
              <ul className="list-disc list-inside space-y-2">
                <li>Manufacturer and model</li>
                <li>Year of manufacture</li>
                <li>CNC control</li>
                <li>Machine configuration</li>
                <li>Spindle speed and spindle type</li>
                <li>Machine and spindle hours</li>
                <li>Table size and work envelope</li>
              </ul>

              <ul className="list-disc list-inside space-y-2">
                <li>Tool changer capacity</li>
                <li>Number of axes</li>
                <li>Fourth- or fifth-axis equipment</li>
                <li>Coolant and probing systems</li>
                <li>Tooling and workholding</li>
                <li>Maintenance history</li>
                <li>Current market demand</li>
              </ul>
            </div>

            <p>
              If you are unsure what your machine is worth, you do not need to
              determine its value before contacting us. Providing accurate
              machine information allows our team to evaluate the equipment and
              discuss its potential market value.
            </p>
          </div>
        </section>

        {/* Information Needed */}
        <section className="max-w-5xl mx-auto px-6 py-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-5">
            Information That Helps Us Evaluate Your Machine
          </h2>

          <p className="text-slate-700 leading-relaxed mb-5">
            The more information you can provide, the easier it is to evaluate
            your equipment. Useful information includes:
          </p>

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-slate-700">
            <ul className="list-disc list-inside space-y-2">
              <li>Manufacturer and model</li>
              <li>Year of manufacture</li>
              <li>Serial number</li>
              <li>CNC control</li>
              <li>Machine and spindle hours</li>
              <li>Machine condition</li>
              <li>Major options and accessories</li>
            </ul>

            <ul className="list-disc list-inside space-y-2">
              <li>Tool changer and spindle specifications</li>
              <li>Tooling and workholding</li>
              <li>Maintenance or service history</li>
              <li>Current machine location</li>
              <li>Whether the machine is operational</li>
              <li>Photographs of the machine</li>
              <li>Photograph of the manufacturer's data plate</li>
            </ul>
          </div>

          <p className="text-slate-700 leading-relaxed mt-5">
            If you do not have all of this information, that is okay. Submit
            the information you have and provide any additional details in the
            message field of the form.
          </p>
        </section>

        {/* Why Concord */}
        <section className="max-w-5xl mx-auto px-6 py-8">
          <div className="bg-slate-100 border border-slate-200 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-5">
              Why Sell to Concord Machine Tools?
            </h2>

            <ul className="list-disc list-inside space-y-3 text-slate-700">
              <li>
                Experienced used CNC and metalworking machinery professionals
              </li>
              <li>
                Market-based equipment evaluations
              </li>
              <li>
                Experience with individual machines, multiple-machine
                purchases, and larger equipment liquidations
              </li>
              <li>
                Knowledge of CNC machine specifications, configurations, and
                manufacturers
              </li>
              <li>
                Domestic and international used machinery resale experience
              </li>
              <li>Michigan-based machinery dealer serving sellers nationwide</li>
            </ul>
          </div>
        </section>

        {/* Surplus / Idle Equipment */}
        <section className="max-w-5xl mx-auto px-6 py-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-5">
            Selling Surplus or Idle Machinery
          </h2>

          <div className="space-y-5 text-slate-700 leading-relaxed">
            <p>
              Unused machinery can occupy valuable floor space and tie up
              capital that could otherwise be used elsewhere in your business.
              Equipment may become surplus because of production changes,
              technology upgrades, facility consolidation, or other business
              decisions.
            </p>

            <p>
              If you have CNC machinery or other metalworking equipment that is
              no longer being used, Concord Machine Tools can evaluate the
              equipment and determine whether it is a fit for our current
              inventory and resale market.
            </p>
          </div>
        </section>

        {/* Facility Closures */}
        <section className="max-w-5xl mx-auto px-6 py-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-5">
            Selling Machinery When Closing or Relocating a Facility
          </h2>

          <div className="space-y-5 text-slate-700 leading-relaxed">
            <p>
              Closing a manufacturing facility, relocating a machine shop, or
              consolidating production can involve many machines and other
              industrial assets. Understanding the equipment and its current
              market position is an important part of developing an effective
              selling strategy.
            </p>

            <p>
              Concord Machine Tools can evaluate groups of CNC machines and
              metalworking equipment and discuss potential solutions for moving
              the equipment efficiently. Whether you are selling one machine or
              dealing with a larger facility liquidation, contact us to discuss
              your equipment.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-5xl mx-auto px-6 py-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            Frequently Asked Questions About Selling Used CNC Machines
          </h2>

          <div className="space-y-7 text-slate-700">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">
                Do you buy individual CNC machines?
              </h3>
              <p className="leading-relaxed">
                Yes. Concord Machine Tools purchases individual CNC machines
                and other used metalworking equipment when the equipment is a
                good fit for our inventory and current market demand.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">
                What types of CNC machines do you buy?
              </h3>
              <p className="leading-relaxed">
                We evaluate a wide range of CNC equipment, including vertical
                machining centers, horizontal machining centers, CNC lathes,
                turning centers, multi-axis machines, grinders, EDM equipment,
                boring mills, and other CNC machine tools.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">
                Do you buy older CNC machines?
              </h3>
              <p className="leading-relaxed">
                Yes. Machine age is one factor in determining value, but it is
                not the only factor. Manufacturer, model, configuration,
                condition, control, options, and current market demand are also
                important considerations.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">
                Do you buy machines that are not currently running?
              </h3>
              <p className="leading-relaxed">
                Equipment that is not currently operational can still be
                considered depending on the machine, condition, manufacturer,
                model, configuration, and circumstances. Please describe the
                machine's condition accurately when submitting your equipment.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">
                Do you buy multiple CNC machines?
              </h3>
              <p className="leading-relaxed">
                Yes. We can evaluate multiple machines, including equipment
                being sold as part of a production change, facility
                consolidation, relocation, or plant liquidation.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">
                Do you buy complete machine shops?
              </h3>
              <p className="leading-relaxed">
                We can evaluate complete machine shops and larger groups of
                industrial equipment. Depending on the circumstances, different
                selling and liquidation solutions may be appropriate.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">
                How do you determine the value of a used CNC machine?
              </h3>
              <p className="leading-relaxed">
                Used CNC machine values are influenced by the manufacturer,
                model, age, configuration, control, condition, hours, options,
                location, and current market demand. Comparable equipment and
                resale potential are also important considerations.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">
                What information should I provide when selling my machine?
              </h3>
              <p className="leading-relaxed">
                At a minimum, provide the manufacturer, model, year, condition,
                and your contact information. Additional information such as
                the CNC control, machine hours, options, tooling, maintenance
                history, serial number, and photographs can help us evaluate the
                equipment more accurately.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">
                Do I need to know what my machine is worth before contacting
                you?
              </h3>
              <p className="leading-relaxed">
                No. If you are unsure of the machine's current value, provide as
                much information as you have and our team can review the
                equipment and discuss its potential market value.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">
                Do you buy used machinery outside of Michigan?
              </h3>
              <p className="leading-relaxed">
                Yes. Concord Machine Tools works with sellers throughout the
                United States and has domestic and international experience
                buying and reselling used machinery.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-5xl mx-auto px-6 pt-8 pb-16">
          <div className="text-center border-t border-slate-200 pt-10">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              Have a Used CNC Machine to Sell?
            </h2>

            <p className="text-slate-700 leading-relaxed max-w-3xl mx-auto">
              Whether you have one surplus machine or an entire facility full
              of equipment, Concord Machine Tools can help you determine the
              next step.{' '}
              <Link
                href="/contact"
                className="text-blue-700 hover:underline font-medium"
              >
                Contact Concord Machine Tools
              </Link>{' '}
              or submit your machine information above to get started.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
