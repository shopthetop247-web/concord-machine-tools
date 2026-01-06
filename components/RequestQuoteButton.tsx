'use client';

import React, { useState } from 'react';
import RequestQuoteModal from './RequestQuoteModal';

interface Props {
  stockNumber: string;
}

export default function RequestQuoteButton({ stockNumber }: Props) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div style={{ marginTop: '16px' }}>
      <button
        onClick={() => setShowModal(true)}
        style={{
          padding: '8px 16px',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Request Quote
      </button>

      {showModal && (
        <RequestQuoteModal
          stockNumber={stockNumber}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
