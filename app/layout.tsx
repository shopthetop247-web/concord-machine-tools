import './globals.css';
import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Concord Machine Tools – Used CNC & Metalworking Machines',
  description:
    'Find high-quality used CNC machines, metalworking machines, and industrial equipment at Concord Machine Tools.',
  openGraph: {
    title: 'Concord Machine Tools',
    description:
      'Used CNC machines, lathes, mills, and industrial equipment for sale.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <Header />

        {/* Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Concord Machine Tools',
              url: 'https://www.concordmt.com',
              logo: 'https://www.concordmt.com/logo.png',
              sameAs: [],
            }),
          }}
        />

        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
