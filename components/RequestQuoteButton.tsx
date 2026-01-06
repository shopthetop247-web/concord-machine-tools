// components/RequestQuoteButton.tsx
'use client';

import { useState } from 'react';

interface RequestQuoteButtonProps {
  stockNumber: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function RequestQuoteButton({ stockNumber }: RequestQuoteButtonProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
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

      if (!res.ok) {
        throw new Error('Failed to send email. Please try again later.');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
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
          px-8 py-3 
          mt-4 
          rounded-lg 
          shadow-lg 
          hover:bg-blue-400 
          hover:shadow-xl 
          transform 
          hover:scale-105 
          transition 
          duration-300 
          ease-in-out
          w-full sm:w-auto
        "
      >
        Request Quote
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md relative">
            {/* Close button */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 font-bold text-2xl"
            >
              &times;
            </button>

            {success ? (
              <p className="text-green-600 font-semibold text-center text-lg">
                Quote request sent successfully!
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-600 text-sm">{error}</p>}

                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                />

                <input
                  type="text"
                  name="phone"
                  placeholder="Phone (optional)"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                />

                <textarea
                  name="message"
                  placeholder="Additional message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    bg-brandBlue 
                    text-white 
                    font-semibold 
                    px-6 py-3 
                    rounded-lg 
                    hover:bg-blue-400 
                    shadow-md 
                    transition 
                    duration-300 
                    w-full
                  "
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
