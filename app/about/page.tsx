import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Concord Machine Tools | Used Metalworking Machinery Dealer',
  description:
    'Concord Machine Tools is a Michigan-based dealer of used CNC and metalworking machinery, serving customers across the United States and worldwide.',
  openGraph: {
    title: 'About Concord Machine Tools',
    description:
      'Trusted Michigan-based dealer of used CNC and metalworking machinery, serving domestic and global customers.',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Concord Machine Tools',
            url: 'https://www.concordmachinetools.com',
            description:
              'Michigan-based dealer of used CNC and metalworking machinery serving customers in the United States and worldwide.',
            areaServed: ['United States', 'Worldwide'],
            industry: 'Industrial Machinery',
          }),
        }}
      />

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          About Concord Machine Tools
        </h1>

        <div className="space-y-6 text-slate-700 leading-relaxed">
          <p>
            <strong>Concord Machine Tools</strong> is a Michigan-based used
            metalworking machinery dealer providing a wide range of equipment to
            customers throughout the United States and around the world. Our
            extensive inventory and commitment to exceptional service have made
            us a trusted partner in the metalworking industry.
          </p>

          <p>
            With a strong focus on customer satisfaction, we strive to deliver
            the best solutions for all metalworking needs. Our experienced team
            provides expert guidance to ensure each customer finds the right
            machinery for their specific application.
          </p>

          <div className="grid md:grid-cols-3 gap-8 pt-8">
            <div>
              <h2 className="text-xl font-semibold mb-3">Buying</h2>
              <p>
                Have surplus machinery? Whether it’s a single machine, multiple
                units, or an entire shop or plant, we can help. Concord Machine
                Tools purchases equipment for inventory and also offers auction
                solutions when appropriate. Contact us today to discuss your
                surplus machinery.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Selling</h2>
              <p>
                Being one of the leading metalworking machinery dealers in
                Michigan and the United States is important to us. Through
                continuous market research, we keep our pricing competitive and
                our customers satisfied. Our goal is to make every transaction
                efficient and worry-free.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Working</h2>
              <p>
                Concord Machine Tools is constantly working to bring our
                customers the best value in machinery solutions. We aim to be
                your go-to source for buying new and used equipment, as well as
                selling surplus assets. Hard work and dedication have helped us
                remain a trusted machinery company year after year.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
