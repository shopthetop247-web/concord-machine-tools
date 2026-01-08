import Link from 'next/link';

export const metadata = {
  title: 'Used CNC & Metalworking Machinery for Sale | Concord Machine Tools',
  description:
    'Browse high-quality used CNC machines, machining centers, lathes, mills, and metalworking equipment. Professionally represented industrial machinery.',
  openGraph: {
    title: 'Used CNC & Metalworking Machinery for Sale',
    description:
      'Concord Machine Tools specializes in used CNC machines and industrial equipment ready for production.',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-semibold mb-6">
            Used CNC & Metalworking Machinery for Sale
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10">
            Specializing in CNC machining centers, lathes, mills, and industrial equipment —
            wide ranging & budget friendly options.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/inventory"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-md font-medium transition"
            >
              View Inventory
            </Link>

            <Link
              href="/sell"
              className="border border-slate-400 hover:border-white px-8 py-3 rounded-md font-medium transition"
            >
              Sell Your Machine
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORY PILLARS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold mb-10 text-center">
          Browse Machinery by Category
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <Link
            href="/inventory/cnc-machinery"
            className="block bg-white border rounded-lg p-6 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-2">CNC Machinery</h3>
            <p className="text-sm text-gray-600">
              CNC machining centers, turning centers, horizontal and vertical machines.
            </p>
          </Link>

          <Link
            href="/inventory/fabricating-stamping"
            className="block bg-white border rounded-lg p-6 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-2">
              Fabricating & Stamping
            </h3>
            <p className="text-sm text-gray-600">
              Press brakes, stamping presses, fabrication and forming equipment.
            </p>
          </Link>

          <Link
            href="/inventory/manual-machinery"
            className="block bg-white border rounded-lg p-6 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-2">
              Manual Machinery
            </h3>
            <p className="text-sm text-gray-600">
              Manual lathes, mills, grinders, and traditional shop equipment.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
