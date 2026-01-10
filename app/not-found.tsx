import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h1>

        <p className="text-gray-600 mb-6">
          Sorry — we recently updated our website, and some pages may take a little
          time for Google to re-index and reconnect from search results.
        </p>

        <p className="text-gray-600 mb-6">
          Please use our <strong>Inventory</strong> menu to find the machine
          you’re looking for, or feel free to contact us directly.
        </p>

        <p className="text-gray-700 mb-8">
          Email us at{" "}
          <a
            href="mailto:sales@concordmt.com"
            className="text-brandBlue underline hover:text-blue-500"
          >
            sales@concordmt.com
          </a>
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/inventory"
            className="bg-brandBlue text-white px-6 py-3 rounded-md
                       font-semibold hover:bg-blue-400 transition"
          >
            View Inventory
          </Link>

          <Link
            href="/"
            className="border border-gray-300 px-6 py-3 rounded-md
                       font-semibold hover:bg-gray-100 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
