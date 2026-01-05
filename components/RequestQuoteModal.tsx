import React, { useState } from 'react';

interface RequestQuoteModalProps {
  stockNumber: string;
}

const RequestQuoteModal: React.FC<RequestQuoteModalProps> = ({ stockNumber }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Build email content
    const subject = `RFQ Stock# ${stockNumber}`;
    const body = `Stock#: ${stockNumber}\nName: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}`;

    // Open user's email client
    window.location.href = `mailto:sales@concordmt.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    setSubmitted(true);
  };

  return (
    <>
      {/* Request Quote button */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Request Quote
      </button>

      {/* Modal overlay */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>

            {!submitted ? (
              <>
                <h2 className="text-xl font-semibold mb-4">Request Quote</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full border px-2 py-1 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full border px-2 py-1 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      required
                      className="w-full border px-2 py-1 rounded"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Send Request
                  </button>
                </form>
              </>
            ) : (
              <p className="text-green-600 font-medium">
                Your request has been prepared in your email client!
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default RequestQuoteModal;
