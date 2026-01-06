'use client';

import React, { useState } from 'react';

interface RequestQuoteModalProps {
  stockNumber: string;
  onClose: () => void; // <-- add this line
}

export default function RequestQuoteModal({ stockNumber, onClose }: RequestQuoteModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate your email sending / form submission logic
    console.log({ name, email, company, stockNumber });
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
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          minWidth: '300px',
        }}
      >
        <button
          style={{ float: 'right', marginBottom: '8px' }}
          onClick={onClose}
        >
          Close
        </button>

        {submitted ? (
          <p>Thank you! Your request has been submitted.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2>Request Quote - Stock #{stockNumber}</h2>
            <label>
              Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Company:
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </label>
            <br />
            <button type="submit" style={{ marginTop: '12px' }}>
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

