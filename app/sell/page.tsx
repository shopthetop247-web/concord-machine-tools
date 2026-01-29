import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Sell Your Machine | Concord Machine Tools',
  description:
    'Sell your surplus CNC and metalworking machinery with Concord Machine Tools. We buy single machines, entire shops, and offer auction solutions.',
  openGraph: {
    title: 'Sell Your Machine | Concord Machine Tools',
    description:
      'We purchase surplus CNC and metalworking equipment — single machines, multiple units, or complete facilities.',
    type: 'website',
  },
};

export default function SellPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Sell Metalworking Machinery',
            provider: {
              '@type': 'Organization',
              name: 'Concord Machine Tools',
              url: 'https://www.concordmt.com',
            },
            areaServed: ['United States', 'Worldwide'],
            serviceType: 'Used CNC and Metalworking Machinery Purchasing',
          }),
        }}
      />

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          Sell Your Machine
        </h1>

        <div className="space-y-6 text-slate-700 leading-relaxed">
          <p>
            Do you have surplus metalworking or CNC machinery? Whether you’re
            selling a single machine, multiple units, or an entire shop or
            manufacturing facility, <strong>Concord Machine Tools</strong> can
            help.
          </p>

          <p>
            We actively purchase used metalworking equipment for inventory and
            provide flexible solutions tailored to your situation. Our goal is
            to make the selling process efficient, transparent, and
            hassle-free.
          </p>

          <div className="grid md:grid-cols-3 gap-8 pt-8">
            <div>
              <h2 className="text-xl font-semibold mb-3">Single Machines</h2>
              <p>
                Have one machine you no longer need? We buy individual CNC and
                metalworking machines across a wide range of brands and
                conditions.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Multiple Machines</h2>
              <p>
                Downsizing or upgrading equipment? We can purchase multiple
                machines at once and coordinate logistics to minimize downtime.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Complete Shops & Auctions</h2>
              <p>
                For larger facilities or full plant liquidations, we offer
                complete buyout and auction solutions when appropriate, ensuring
                maximum value and efficiency.
              </p>
            </div>
          </div>

          <div className="bg-slate-100 border border-slate-200 rounded-lg p-6 mt-10">
            <h2 className="text-2xl font-semibold mb-4">
              Why Sell to Concord Machine Tools?
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Experienced metalworking machinery professionals</li>
              <li>Competitive, market-driven pricing</li>
              <li>Fast evaluations and straightforward offers</li>
              <li>Domestic and global resale expertise</li>
              <li>Trusted Michigan-based dealer</li>
            </ul>
          </div>

          {/* Form Section */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Submit Your Machine Details
            </h2>
            <p className="mb-6 text-center text-slate-700">
              Fill out the form below to provide information about your machine, including brand, model, year, and condition. Our team will review it and get back to you promptly with an evaluation.
            </p>

            {/* ContactForm component with props for Sell page */}
            <ContactForm
              title="Sell Your Machine"
              description="Provide details below for a fast evaluation."
              tip="📌 Tip: Include condition, tooling, controls, and a price idea to speed up our response."
            />
          </div>
        </div>
      </section>
    </>
  );
}
