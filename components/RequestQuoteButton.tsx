// components/RequestQuoteButton.tsx
'use client';

import React, { useState } from 'react';

interface RequestQuoteButtonProps {
  stockNumber: string;
}

export default function RequestQuoteButton({ stockNumber }: RequestQuoteButtonProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/request-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, stockNumber }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setError('Failed to send request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="
          bg-brandBlue 
          text-white 
          font-semibold 
          px-6 py-3 
          mt-4 
          rounded 
          shadow-md 
          hover:bg-blue-400 
          hover:shadow-lg 
          transform 
          hover:scale-105 
          transition 
          duration-300 
          ease-in-out
        "
      >
        Request Quote
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold text-xl"
            >
              &times;
            </button>

            {success ? (
              <p className="text-green-600 font-semibold text-center">
                Quote request sent successfully!
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {error && <p className="text-red-600">{error}</p>}
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone (optional)"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
                <textarea
                  name="message"
                  placeholder="Additional message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-brandBlue text-white font-semibold px-4 py-2 rounded hover:bg-blue-400 transition"
                >
                  {loading ? 'Sending...' : 'Send Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
