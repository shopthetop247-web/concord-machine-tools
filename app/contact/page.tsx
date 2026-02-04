// app/contact/page.tsx
import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | Concord Machine Tools',
  description:
    'Contact Concord Machine Tools for buying or selling CNC and metalworking machinery. Michigan-based dealer serving customers worldwide.',
  openGraph: {
    title: 'Contact Concord Machine Tools',
    description:
      'Get in touch with Concord Machine Tools for used CNC machines, surplus equipment, and metalworking solutions.',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            mainEntity: {
              '@type': 'Organization',
              name: 'Concord Machine Tools',
              url: 'https://www.concordmt.com',
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'sales',
                telephone: '+1-248-224-3147',
                email: 'sales@concordmt.com',
                areaServed: ['US', 'Worldwide'],
                availableLanguage: 'English',
              },
            },
          }),
        }}
      />

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          Contact Us
        </h1>

        <p className="text-slate-700 max-w-3xl mb-10 leading-relaxed">
          Whether you’re looking to buy quality used machinery, sell surplus
          equipment, or explore auction and liquidation solutions, our team is
          ready to help. Reach out today and speak directly with experienced
          metalworking professionals.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Concord Machine Tools
              </h2>
              <p className="text-slate-700">
                Michigan-based used metalworking machinery dealer serving
                customers across the United States and worldwide.
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
                Monday – Friday<br />
                9:00 AM – 5:00 PM (EST)
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
              📌 Tip: When selling a machine, include condition, tooling,
              controls, and price idea you have in mind for the fastest response.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
