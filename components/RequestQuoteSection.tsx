'use client';

import { useState } from 'react';
import RequestQuoteModal from './RequestQuoteModal';

interface Props {
  stockNumber: string;
}

export default function RequestQuoteSection({ stockNumber }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-brandBlue text-white font-semibold px-6 py-3 rounded shadow-md
                   hover:bg-blue-400 hover:shadow-lg transform hover:scale-105
                   transition duration-300 ease-in-out"
      >
        Request Quote
      </button>

      {open && (
        <RequestQuoteModal
          stockNumber={stockNumber}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
