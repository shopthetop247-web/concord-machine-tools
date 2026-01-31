import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Used CNC Machines for Sale | Machinery | Concord Machine Tools',
  description:
    'Buy and sell used CNC machines, lathes, mills, and metalworking equipment. Trusted dealer offering inspected inventory, fair pricing, and fast response nationwide.',
  keywords: [
  'used CNC machines for sale',
  'CNC mills for sale',
  'used CNC lathes',
  'used machining centers',
  'metalworking equipment for sale',
  'industrial machinery dealer',
  'used Haas CNC machines',
  'used Mazak CNC machines',
  'used Okuma CNC machines',
  'used Doosan CNC machines',
  'Concord Machine Tools',
],
  openGraph: {
    title: 'Used CNC Machines for Sale | Concord Machine Tools',
    description:
      'Browse used CNC machines including mills, lathes, and machining centers. Trusted inventory, fair pricing, and fast response nationwide.',
    url: 'https://www.concordmt.com',
    siteName: 'Concord Machine Tools',
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    canonical: 'https://www.concordmt.com',
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

          <p className="mb-10 text-base md:text-lg text-slate-300 max-w-4xl mx-auto leading-relaxed">
  Browse a continually updated inventory of used CNC machines for sale, including CNC mills, lathes, machining centers,
  and metalworking equipment from trusted brands like{' '}
  <Link
    href="/brands/haas"
    className="text-white underline underline-offset-4 hover:text-slate-200"
    title="Used Haas CNC Machines For Sale"
  >
    Haas CNC machines
  </Link>
  ,{' '}
  <Link
    href="/brands/mazak"
    className="text-white underline underline-offset-4 hover:text-slate-200"
    title="Used Mazak CNC Machines For Sale"
  >
    Mazak CNC machines
  </Link>
  ,{' '}
  <Link
    href="/brands/okuma"
    className="text-white underline underline-offset-4 hover:text-slate-200"
    title="Used Okuma CNC Machines For Sale"
  >
    Okuma CNC machines
  </Link>
  ,{' '}
  <Link
    href="/brands/doosan"
    className="text-white underline underline-offset-4 hover:text-slate-200"
    title="Used Doosan CNC Machines For Sale"
  >
    Doosan CNC machines
  </Link>
  , and more. Whether you’re looking to buy a single CNC machine or outfit an entire shop, Concord Machine Tools provides
  inspected equipment, honest descriptions, and fast response times for buyers across the United States and worldwide.
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
            href="/inventory/fabricating-and-stamping"
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
       <div className="mt-14">
       <h2 className="text-xl font-semibold text-center mb-6">
        We frequently stock late-model CNC machines from leading manufacturers:
       </h2>

       <div className="flex flex-wrap justify-center items-center gap-8">
       <Link href="/brands/haas" title="Used Haas CNC Machines For Sale">
       <img src="/haaslogo.jpg" alt="Used Haas CNC Machines For Sale" className="h-10" />
       </Link>

       <Link href="/brands/doosan" title="Used Doosan CNC Machines For Sale">
       <img src="/doosanlogo.jpg" alt="Used Doosan CNC Machines For Sale" className="h-10" />
       </Link>

       <Link href="/brands/hurco" title="Used Hurco CNC Machines For Sale">
       <img src="/hurcologo.jpg" alt="Used Hurco CNC Machines For Sale" className="h-10" />
       </Link>

       <Link href="/brands/mazak" title="Used Mazak CNC Machines For Sale">
       <img src="/mazaklogo.jpg" alt="Used Mazak CNC Machines For Sale" className="h-10" />
       </Link>

       <Link href="/brands/okuma" title="Used Okuma CNC Machines For Sale">
      <img src="/okumalogo.jpg" alt="Used Okuma CNC Machines For Sale" className="h-10" />
      </Link>
     </div>
    </div>
        
      </section>
    </main>
  );
}
