// app/contact/page.tsx
import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Concord Machine Tools | Used CNC Machinery',
  description:
    'Contact Concord Machine Tools to buy or sell used CNC machines, machining centers, lathes, and industrial equipment. Call or email our Michigan-based machinery team.',
  alternates: {
    canonical: 'https://www.concordmt.com/contact',
  },
  openGraph: {
    title: 'Contact Concord Machine Tools | Used CNC Machinery',
    description:
      'Get in touch with Concord Machine Tools for used CNC machines, surplus industrial equipment, machinery purchasing, and equipment sourcing.',
    url: 'https://www.concordmt.com/contact',
    siteName: 'Concord Machine Tools',
    type: 'website',
  },
};

export default function ContactPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': 'https://www.concordmt.com/contact#webpage',
    url: 'https://www.concordmt.com/contact',
    name: 'Contact Concord Machine Tools',
    description:
      'Contact Concord Machine Tools for used CNC machinery, industrial equipment sales, machinery purchasing, and equipment sourcing.',
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
      {/* Contact Page Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          Contact Us
        </h1>

        <p className="text-slate-700 max-w-3xl mb-10 leading-relaxed">
         Whether you're looking to purchase quality used CNC machinery, sell
          surplus manufacturing equipment, or explore machinery sourcing and
          valuation services, Concord Machine Tools is ready to help. Contact
          our experienced team to discuss your equipment needs and learn how
          we can assist your business.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Concord Machine Tools
              </h2>
              <p className="text-slate-700">
                Michigan-based used CNC and metalworking machinery dealer
                serving manufacturers, machine shops, and industrial businesses
                throughout the United States and worldwide.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Address</h3>
              <p className="text-slate-700">
                200 East Big Beaver Rd.<br />
                Troy, MI 48083
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Phone</h3>
              <p className="text-slate-700">
                <a
                  href="tel:+12482243147"
                  className="text-blue-600 hover:underline"
                >
                  (248) 224-3147
                </a>
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-slate-700">
                <a
                  href="mailto:sales@concordmt.com"
                  className="text-blue-600 hover:underline"
                >
                  sales@concordmt.com
                </a>
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Business Hours</h3>
              <p className="text-slate-700">
                Monday – Friday
                <br />
                9:00 AM – 5:00 PM Eastern Time
                <br />
                Saturday – Sunday: Closed
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-100 border border-slate-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Send Us a Message About a Machine You Want to Sell or Buy
            </h2>

            <ContactForm />

            <p className="text-sm text-slate-600 mt-4">
              📌 Tip: When selling a machine, include its condition, tooling,
              control information, and your anticipated asking price to help
              us provide the fastest possible response.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
