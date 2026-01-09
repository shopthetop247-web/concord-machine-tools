'use client';

import { useState } from 'react';

interface Props {
  stockNumber: string;
  onClose: () => void;
}

export default function RequestQuoteModal({ stockNumber, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);

    const res = await fetch('/api/request-quote', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Failed to send request. Please try again.');
      setLoading(false);
      return;
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Request a Quote
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="stockNumber" value={stockNumber} />

          <input
            name="name"
            placeholder="Your Name"
            required
            className="w-full border rounded px-4 py-2"
          />

          <input
            name="company"
            placeholder="Company"
            className="w-full border rounded px-4 py-2"
          />

          <input
            name="email"
            type="email"
            placeholder="Your Email"
            required
            className="w-full border rounded px-4 py-2"
          />

          <textarea
            name="message"
            placeholder="Message"
            rows={4}
            className="w-full border rounded px-4 py-2"
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg
                       hover:bg-blue-500 transition font-semibold"
          >
            {loading ? 'Sending...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}

