// components/RequestQuoteForm.tsx
'use client';

import { useState } from 'react';

interface RequestQuoteFormProps {
  stockNumber: string;
  onSuccess?: () => void;
}

export default function RequestQuoteForm({ stockNumber, onSuccess }: RequestQuoteFormProps) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState(''); // ← New field
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/request-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockNumber, name, company, email, message }),
      });

      if (!res.ok) throw new Error('Failed to send email. Please try again.');

      setSuccess(true);
      setName('');
      setCompany(''); // ← Clear company field
      setEmail('');
      setMessage('');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">Message sent successfully!</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                     focus:outline-none focus:ring-brandBlue focus:border-brandBlue sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Company</label> {/* New field */}
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                     focus:outline-none focus:ring-brandBlue focus:border-brandBlue sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                     focus:outline-none focus:ring-brandBlue focus:border-brandBlue sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                     focus:outline-none focus:ring-brandBlue focus:border-brandBlue sm:text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-brandBlue text-white font-semibold px-4 py-2 rounded-md
                   shadow-md hover:bg-blue-400 hover:shadow-lg transition transform hover:scale-105
                   duration-300 ease-in-out ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Sending...' : 'Send Request'}
      </button>
    </form>
  );
}

