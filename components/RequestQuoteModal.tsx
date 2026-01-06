'use client';

import React, { useState } from 'react';

interface RequestQuoteModalProps {
  stockNumber: string;
  onClose: () => void;
}

export default function RequestQuoteModal({ stockNumber, onClose }: RequestQuoteModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct mailto link
    const subject = `RFQ Stock# ${stockNumber}`;
    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0ACompany: ${company}%0D%0AStock#: ${stockNumber}`;

    window.location.href = `mailto:sales@concordmt.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setSubmitted(true);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            float: 'right',
            fontWeight: 'bold',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          ×
        </button>

        <h2 style={{ marginBottom: '16px' }}>Request Quote</h2>

        {submitted ? (
          <p>Thank you! Your email client should open shortly.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '12px' }}>
              <label>
                Name:
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
              </label>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label>
                Email:
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
              </label>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label>
                Company:
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
              </label>
            </div>

            <p>
              <strong>Stock#:</strong> {stockNumber}
            </p>

            <button
              type="submit"
              style={{
                marginTop: '12px',
                padding: '10px 20px',
                backgroundColor: '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              Send Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

