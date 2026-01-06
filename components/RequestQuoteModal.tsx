// components/RequestQuoteModal.tsx
'use client';

import { useState } from 'react';
import RequestQuoteForm from './RequestQuoteForm';

interface RequestQuoteModalProps {
  stockNumber: string;
   onClose: () => void;
}

export default function RequestQuoteModal({ stockNumber }: RequestQuoteModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-brandBlue text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-400 transition transform hover:scale-105 duration-300"
      >
        Request Quote
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-lg relative">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              &times;
            </button>

            {/* Modal title */}
            <h2 className="text-xl font-semibold mb-4">Request a Quote - Stock# {stockNumber}</h2>

            {/* Form */}
            <RequestQuoteForm
              stockNumber={stockNumber}
              onSuccess={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
