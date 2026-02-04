'use client';

import { useState } from 'react';

interface Props {
  stockNumber: string;
  machineName?: string;
  machineUrl?: string;
  onClose: () => void;
}

export default function RequestQuoteModal({
  stockNumber,
  machineName,
  machineUrl,
  onClose,
}: Props) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: `Inquiry about ${machineName ?? ''} (Stock #${stockNumber})`,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // send form logic
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Request a Quote</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Message"
            className="w-full border px-3 py-2 rounded"
            rows={4}
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brandBlue text-white rounded hover:bg-blue-500"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

