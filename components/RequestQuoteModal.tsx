'use client';

import RequestQuoteForm from './RequestQuoteForm';

interface RequestQuoteModalProps {
  stockNumber: string;
  onClose: () => void;
}

export default function RequestQuoteModal({
  stockNumber,
  onClose,
}: RequestQuoteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">
          Request a Quote
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Stock #: <span className="font-medium">{stockNumber}</span>
        </p>

        <RequestQuoteForm
          stockNumber={stockNumber}
          onSuccess={onClose}
        />
      </div>
    </div>
  );
}
