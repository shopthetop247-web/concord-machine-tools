'use client';

import { useState } from 'react';
import RequestQuoteModal from './RequestQuoteModal';

interface Props {
  stockNumber: string;
  variant?: 'primary' | 'inline';
}

export default function RequestQuoteSection({
  stockNumber,
  variant = 'primary',
}: Props) {
  const [open, setOpen] = useState(false);

  const baseClasses =
    'font-semibold rounded transition duration-200';

  const styles =
    variant === 'inline'
      ? 'text-sm px-3 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
      : 'bg-brandBlue text-white px-6 py-3 shadow-md hover:bg-blue-400 hover:shadow-lg transform hover:scale-105';

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`${baseClasses} ${styles}`}
      >
        Request a Quote
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
