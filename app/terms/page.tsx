'use client'; // ← MUST be the first line for Client Components

import { Metadata } from 'next';
import { useEffect, useState } from 'react';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Concord Machine Tools',
  description:
    'Read the machine sale terms and conditions for purchasing used metalworking equipment from Concord Machine Tools.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms & Conditions | Concord Machine Tools',
    description:
      'View the terms and conditions for buying used CNC and metalworking machinery from Concord Machine Tools.',
    type: 'website',
  },
};

export default function TermsPage() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowButton(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 relative">
      <h1 className="text-3xl font-semibold mb-6">Machine Sale Terms</h1>

      <section className="space-y-4 text-gray-800 text-sm leading-relaxed">
        <p>Our Terms:</p>

        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>PRICES</strong> are as is, where is, unless otherwise noted. Prices are exclusive of any and all State, Country, or Federal taxes. Any taxes shall be paid by the buyer in addition to the quoted purchase price.
          </li>
          <li>
            <strong>TERMS</strong> are cash with order unless otherwise arranged. Title to the machine or machines does not pass to the buyer until it is paid for in full. All quotations are subject to prior sale and change without notice.
          </li>
          <li>
            <strong>SHIPMENTS:</strong> Dates of delivery are determined from the date of our acceptance of any order or orders by the buyer and see estimates of approximate dates of delivery, not a guarantee of a particular day or delivery.
          </li>
          <li>
            There are no provisions with respect to this quotation which are not specified herein. If buyer places an order with us based on this quotation, whether in writing or orally, then this quotation will constitute the entire contract between the buyer and us with respect to the subject matter of this quotation. Any agreement so made shall be governed by the law of the State of Michigan.
          </li>
          <li>
            Information is obtained from sources deemed reliable; however, we urge your inspection of this equipment to confirm any pertinent specifications prior to your purchase. We will not be responsible for any typographical errors or omissions.
          </li>
          <li>
            <strong>WARRANTY</strong>. Seller and Buyer agree that all Used Equipment to be sold under this Agreement is sold on an "AS IS, WHERE IS, WITH ALL FAULTS" basis. SELLER MAKES NO REPRESENTATION OR WARRANTY, STATUTORY, EXPRESS OR IMPLIED WITH RESPECT TO THE USED EQUIPMENT INCLUDING MAKING NO WARRANTY THAT THE USED EQUIPMENT WILL BE MERCHANTABLE OR FIT FOR ANY PARTICULAR PURPOSE. THE ONLY WARRANTY OR REPRESENTATION MADE BY SELLER IS A WARRANTY THAT SELLER IS THE OWNER OF THE USED EQUIPMENT. Buyer assumes all risks and liability whatsoever resulting from the possession, use, or disposition of the Used Equipment. Seller will have no liability with respect to the Used Equipment sold to Buyer, including having no liability for indirect, incidental, or consequential damages.
          </li>
          <li>
            <strong>INDEMNITY</strong>. Buyer indemnifies Seller and holds Seller harmless against all liability or loss of all persons for injury, sickness, and/or death and for property damage caused by the Used Equipment or by hazardous chemicals or other hazardous material on or in them, except for that solely attributable to Seller's sole negligence, after delivery by Seller and/or upon the commencement by Buyer of the dismantling or other work referred to in Section 7 of this Agreement, whichever first occurs. Buyer agrees to refrain from making any use of any trademarks, labels, distinctive markings, or designs that may appear on the Used Equipment.
          </li>
          <li>
            <strong>INSPECTION</strong>. Buyer is invited, urged, and cautioned to inspect the Used Equipment prior to purchase. The Used Equipment will be available for inspection at the places and times specified by Seller.
          </li>
        </ol>
      </section>

      {/* Back to Top Button */}
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          ↑ Back to Top
        </button>
      )}
    </main>
  );
}
