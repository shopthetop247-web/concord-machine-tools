'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile?: any;
  }
}

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement | null>(null);
  const tokenRef = useRef<string | null>(null);

  // Load Turnstile script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      if (!window.turnstile) throw new Error('Spam protection not loaded. Please refresh.');

      // Execute Turnstile
      if (!tokenRef.current) {
        const token = await new Promise<string>((resolve, reject) => {
          window.turnstile.render(turnstileRef.current!, {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_KEY,
            callback: resolve,
            'error-callback': () => reject(),
            size: 'invisible',
          });
        });
        tokenRef.current = token;
      }

      const form = e.currentTarget;
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, turnstileToken: tokenRef.current }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error || 'Failed to send message.');

      setSuccess('Thank you! Your message has been sent successfully.');
      form.reset();
      tokenRef.current = null; // reset token
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div ref={turnstileRef} style={{ display: 'none' }} />
      {success && (
        <div className="mb-4 rounded-md bg-green-100 text-green-800 px-4 py-3 text-sm">{success}</div>
      )}
      {error && (
        <div className="mb-4 rounded-md bg-red-100 text-red-800 px-4 py-3 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot */}
        <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input type="text" name="name" required className="w-full border rounded-md px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Company</label>
          <input type="text" name="company" className="w-full border rounded-md px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input type="email" name="email" required className="w-full border rounded-md px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input type="tel" name="phone" className="w-full border rounded-md px-3 py-2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="sr-only">Machine Brand</label>
            <input name="machineBrand" placeholder="Machine Brand" className="border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="sr-only">Machine Model</label>
            <input name="machineModel" placeholder="Machine Model" className="border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="sr-only">Machine Year</label>
            <input name="machineYear" placeholder="Machine Year" className="border rounded-md px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Message *</label>
          <textarea name="message" rows={4} required className="w-full border rounded-md px-3 py-2" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </>
  );
}
