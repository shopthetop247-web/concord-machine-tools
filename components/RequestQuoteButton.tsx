'use client';

import React from 'react';

interface Props {
  stockNumber: string;
}

export default function RequestQuoteButton({ stockNumber }: Props) {
  const mailto = `mailto:youremail@example.com?subject=Quote Request for Stock# ${stockNumber}`;

  return (
    <a
      href={mailto}
      style={{
        display: 'inline-block',
        padding: '12px 24px',
        backgroundColor: '#1e40af', // original button color
        color: 'white',
        borderRadius: '8px',
        textDecoration: 'none',
        transition: 'background-color 0.3s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5795f2')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1e40af')}
    >
      Request Quote
    </a>
  );
}
