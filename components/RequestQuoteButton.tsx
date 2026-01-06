'use client';

import React, { useState } from 'react';
import RequestQuoteModal from './RequestQuoteModal';

interface RequestQuoteButtonProps {
  stockNumber: string;
}

export default function RequestQuoteButton({ stockNumber }: RequestQuoteButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        style={{
          padding: '8px 16px',
          backgroundColor: '#1f2937',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '12px'
        }}
        onClick={() => setShowModal(true)}
      >
        Request Quote
      </button>

      {showModal && (
        <RequestQuoteModal
          stockNumber={stockNumber}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

