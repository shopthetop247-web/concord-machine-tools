export const revalidate = 60;

import { client } from '@/lib/sanityClient';
import MachineImages from '@/components/MachineImages';
import RequestQuoteSection from '@/components/RequestQuoteSection';
import imageUrlBuilder from '@sanity/image-url';
import Link from 'next/link';
import { Metadata } from 'next';

interface Machine {
_id: string;
_updatedAt?: string;
name: string;
brand?: string;
yearOfMfg?: number;
specifications?: string;
description?: string;
images?: { asset: { _ref: string } }[];
videoUrl?: string;
stockNumber: string;
slug?: { current: string };
subcategory?: { _ref: string };
}

interface PageProps {
params: {
category: string;
subcategory: string;
machine: string;
};
}

const builder = imageUrlBuilder(client);
const urlFor = (source: any) =>
builder.image(source).auto('format').fit('max').url();

/* -----------------------------------
HELPER: CLEAN MACHINE NAME
----------------------------------- */
function getFullMachineName(machine: Machine) {
if (!machine.brand) return machine.name;

const nameLower = machine.name.toLowerCase();
const brandLower = machine.brand.toLowerCase();

if (nameLower.startsWith(brandLower)) {
return machine.name;
}

return `${machine.brand} ${machine.name}`;
}

/* -----------------------------------
YOUTUBE URL HANDLER
----------------------------------- */
function getYouTubeEmbedUrl(url?: string) {
if (!url) return null;

if (url.includes('youtu.be/')) {
const id = url.split('youtu.be/')[1].split('?')[0];
return `https://www.youtube.com/embed/${id}`;
}

if (url.includes('watch?v=')) {
const id = url.split('watch?v=')[1].split('&')[0];
return `https://www.youtube.com/embed/${id}`;
}

return null;
}

/* -----------------------------------
SEO METADATA
----------------------------------- */
export async function generateMetadata(
{ params }: PageProps
): Promise<Metadata> {
const machine = await client.fetch(
`*[_type == "machine" && slug.current == $slug][0]{
      name,
      brand,
      stockNumber,
      description
    }`,
{ slug: params.machine }
);

if (!machine) {
return { title: 'Machine Not Found' };
}

const fullName = getFullMachineName(machine);

return {
title: `Used ${fullName} for Sale`,
description:
machine.description ??
`Used ${fullName} for sale. Stock #${machine.stockNumber}.`,
};
}

/* -----------------------------------
PAGE
----------------------------------- */
export default async function MachinePage({ params }: PageProps) {
const machine = await client.fetch<Machine>(
`*[_type == "machine" && slug.current == $slug][0]{       _id,
      name,
      brand,
      yearOfMfg,
      specifications,
      description,
      images[]{ asset-> },
      videoUrl,
      stockNumber,
      slug,
      subcategory,
      _updatedAt
    }`,
{ slug: params.machine }
);

if (!machine) {
return <p className="p-6">Machine not found</p>;
}

const fullName = getFullMachineName(machine);

const images =
machine.images
?.map((img) => {
try {
return urlFor(img);
} catch {
return null;
}
})
.filter(Boolean) ?? [];

const embedUrl = getYouTubeEmbedUrl(machine.videoUrl);

const machineUrl = `https://www.concordmt.com/inventory/${params.category}/${params.subcategory}/${machine.slug?.current}`;

const updatedDate = machine._updatedAt
? new Date(machine._updatedAt).toISOString()
: new Date().toISOString();

/* -----------------------------------
PRODUCT SCHEMA (ENHANCED)
----------------------------------- */
const productSchema = {
"@context": "https://schema.org",
"@type": "Product",
name: fullName,
brand: machine.brand || "Concord Machine Tools",
model: machine.yearOfMfg?.toString(),
sku: machine.stockNumber,
url: machineUrl,
image: images,
description: machine.description,
itemCondition: "https://schema.org/UsedCondition",
dateModified: updatedDate,
offers: {
"@type": "Offer",
availability: "https://schema.org/InStock",
availabilityStarts: updatedDate,
url: machineUrl,
seller: {
"@type": "Organization",
name: "Concord Machine Tools"
}
}
};

/* -----------------------------------
BREADCRUMB SCHEMA
----------------------------------- */
const breadcrumbSchema = {
"@context": "https://schema.org",
"@type": "BreadcrumbList",
itemListElement: [
{
"@type": "ListItem",
position: 1,
name: "Inventory",
item: "https://www.concordmt.com/inventory"
},
{
"@type": "ListItem",
position: 2,
name: params.category.replace(/-/g, ' '),
item: `https://www.concordmt.com/inventory/${params.category}`
},
{
"@type": "ListItem",
position: 3,
name: params.subcategory.replace(/-/g, ' '),
item: `https://www.concordmt.com/inventory/${params.category}/${params.subcategory}`
},
{
"@type": "ListItem",
position: 4,
name: machine.name,
item: machineUrl
}
]
};

/* -----------------------------------
VIDEO SCHEMA
----------------------------------- */
const videoSchema =
embedUrl && machine.videoUrl
? {
'@context': 'https://schema.org',
'@type': 'VideoObject',
name: fullName,
description:
machine.description ??
`Used ${fullName} for sale.`,
thumbnailUrl: `https://img.youtube.com/vi/${embedUrl.split('/embed/')[1]}/hqdefault.jpg`,
uploadDate: updatedDate,
embedUrl: embedUrl,
contentUrl: machine.videoUrl,
}
: null;

/* -----------------------------------
RELATED MACHINES
----------------------------------- */
const relatedMachines =
machine.subcategory?._ref
? await client.fetch(
`*[_type == "machine" &&
            slug.current != $slug &&
            subcategory._ref == $subcategoryRef
          ]           | order(
              (brand == $brand) desc,
              yearOfMfg desc
            )[0...4]{             _id,
            name,
            yearOfMfg,
            slug
          }`,
{
slug: params.machine,
subcategoryRef: machine.subcategory._ref,
brand: machine.brand,
}
)
: [];

return ( <main className="max-w-6xl mx-auto px-6 py-8">

  {/* SCHEMA */}
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
  {videoSchema && (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }} />
  )}

  {/* Breadcrumbs */}
  <nav className="mb-6 text-sm text-gray-500">
    <Link href="/inventory" className="text-blue-500 hover:underline">
      Inventory
    </Link>{' › '}
    <Link href={`/inventory/${params.category}`} className="text-blue-500 hover:underline">
      {params.category.replace(/-/g, ' ')}
    </Link>{' › '}
    <Link href={`/inventory/${params.category}/${params.subcategory}`} className="text-blue-500 hover:underline">
      {params.subcategory.replace(/-/g, ' ')}
    </Link>{' › '}
    <span>{machine.name}</span>
  </nav>

  <h1 className="text-3xl font-semibold mb-2">{machine.name}</h1>

  {/* SEO BOOST */}
  <h2 className="text-xl font-semibold mt-2 mb-4 text-gray-800">
    Used {fullName} for Sale
  </h2>

  {/* BRAND LINK */}
  {machine.brand && (
    <p className="mb-2 text-sm">
      View more{' '}
      <Link
        href={`/brands/${machine.brand.toLowerCase()}`}
        className="text-blue-600 underline hover:text-blue-800"
      >
        {machine.brand} machines
      </Link>
    </p>
  )}

  {/* 🔥 FRESHNESS SIGNAL */}
  <p className="text-xs text-gray-500 mb-4">
    Listing updated: {new Date(updatedDate).toLocaleDateString()}
  </p>

  <div className="flex items-center gap-4 mb-4">
    <p className="text-gray-700">
      <strong>Stock #:</strong> {machine.stockNumber}
    </p>

    <RequestQuoteSection
      stockNumber={machine.stockNumber}
      machineName={machine.name}
      machineUrl={machineUrl}
      variant="inline"
    />
  </div>

  {machine.description && (
    <p className="mb-4 text-gray-800">{machine.description}</p>
  )}

  {/* 🔥 INVENTORY LANGUAGE */}
  <p className="mb-6 text-gray-700">
    This {fullName} is currently available for purchase. Contact us for pricing,
    additional details, or to request a quote. Our inventory is updated regularly,
    so availability is subject to change.
  </p>

  {images.length > 0 && <MachineImages images={images} />}

  {/* Video */}
  {embedUrl && (
    <div className="mt-8 aspect-video">
      <iframe
        src={embedUrl}
        title={`${machine.name} video`}
        className="w-full h-full rounded"
        allowFullScreen
      />
    </div>
  )}

  {machine.specifications && (
    <section className="mt-8">
      <h2 className="font-medium mb-2">Specifications</h2>
      <pre className="bg-gray-50 p-4 border rounded text-sm">
        {machine.specifications}
      </pre>
    </section>
  )}

  <section id="request-quote" className="mt-10">
    <RequestQuoteSection
      stockNumber={machine.stockNumber}
      machineName={machine.name}
      machineUrl={machineUrl}
    />
  </section>

{/* SOCIAL PROOF / FOLLOW */}
   <section className="mt-10 border-t pt-6">
     <h3 className="text-lg font-semibold mb-3">
       Follow Concord Machine Tools
     </h3>

     <p className="text-sm text-gray-600 mb-4">
       Stay updated with newly listed machines, machine videos, and featured inventory.
     </p>

     <div className="flex gap-4 text-sm">
     <a
      href="https://www.facebook.com/concordmachinetools/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline"
     >
      Facebook
     </a>

     <a
      href="https://www.instagram.com/concordmachinetools/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-pink-600 hover:underline"
     >
      Instagram
     </a>

     <a
      href="https://www.youtube.com/@concordmachinetools"
      target="_blank"
      rel="noopener noreferrer"
      className="text-red-600 hover:underline"
     >
      YouTube
     </a>

     <a
      href="https://www.linkedin.com/company/concord-machine-tools/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-800 hover:underline"
     >
      LinkedIn
    </a>
  </div>
</section>

  {relatedMachines.length > 0 && (
    <section className="mt-12">
      <h2 className="text-xl font-semibold mb-4">Related Machines</h2>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {relatedMachines.map((m: any) => (
          <li key={m._id} className="border p-4 rounded">
            <Link
              href={`/inventory/${params.category}/${params.subcategory}/${m.slug.current}`}
              className="font-medium text-blue-600 hover:underline"
            >
              {m.name}
            </Link>
            {m.yearOfMfg && (
              <p className="text-sm text-gray-600">Year: {m.yearOfMfg}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  )}
</main>
);
}
