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
  const turnstileToken = useRef<string | null>(null);

  // Load Cloudflare Turnstile
  useEffect(() => {
    if (document.getElementById('turnstile-script')) return;

    const script = document.createElement('script');
    script.id = 'turnstile-script';
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

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Honeypot check (bots usually fill this)
    if (formData.get('website')) {
      setLoading(false);
      return;
    }

    // Execute Turnstile
    if (!window.turnstile) {
      setError('Security check failed. Please refresh and try again.');
      setLoading(false);
      return;
    }

    await new Promise<void>((resolve) => {
      window.turnstile.render(document.createElement('div'), {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
        callback: (token: string) => {
          turnstileToken.current = token;
          resolve();
        },
        'error-callback': () => {
          setError('Security verification failed. Please try again.');
          setLoading(false);
        },
      });
    });

    const payload = {
      ...Object.fromEntries(formData.entries()),
      turnstileToken: turnstileToken.current,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to send message.');
      }

      setSuccess('Thank you! Your message has been sent successfully.');
      form.reset();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      turnstileToken.current = null;
    }
  }

  return (
    <div className="bg-slate-100 border border-slate-200 rounded-lg p-6">
      {success && (
        <div className="mb-4 rounded-md bg-green-100 text-green-800 px-4 py-3 text-sm">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-md bg-red-100 text-red-800 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot field (hidden) */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
        />

        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            type="text"
            name="name"
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Company</label>
          <input
            type="text"
            name="company"
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            type="email"
            name="email"
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Machine Brand
            </label>
            <input
              type="text"
              name="machineBrand"
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Machine Model
            </label>
            <input
              type="text"
              name="machineModel"
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Machine Year
            </label>
            <input
              type="text"
              name="machineYear"
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Message *</label>
          <textarea
            name="message"
            rows={4}
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
