import './globals.css';
import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Script from 'next/script';

export const metadata = {
  metadataBase: new URL('https://www.concordmt.com'),

  title: {
    default: 'Concord Machine Tools | Used CNC & Industrial Machinery',
    template: '%s | Concord Machine Tools',
  },

  description:
    'Buy and sell used CNC machines, metalworking machinery, and industrial manufacturing equipment with Concord Machine Tools.',

  openGraph: {
    title: 'Concord Machine Tools | Used CNC & Industrial Machinery',
    description:
      'Buy and sell used CNC machines, machining centers, lathes, and industrial manufacturing equipment.',
    siteName: 'Concord Machine Tools',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Y6DJQGDKRN"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Y6DJQGDKRN');
          `}
        </Script>
      </head>

      <body className="bg-slate-50 text-slate-900">
        <Header />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}
