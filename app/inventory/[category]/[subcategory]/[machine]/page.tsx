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
  model?: string;
  modelSlug?: string;
  modelDisplay?: string;
  yearOfMfg?: number;
  specifications?: string;
  description?: string;
  images?: any[];
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
HELPER: CREATE URL SLUG
----------------------------------- */

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/* -----------------------------------
YOUTUBE URL HANDLER
----------------------------------- */

function getYouTubeEmbedUrl(url?: string) {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    const hostname = parsed.hostname.replace(/^www\./, '');

    if (
      hostname !== 'youtube.com' &&
      hostname !== 'm.youtube.com' &&
      hostname !== 'youtu.be'
    ) {
      return null;
    }

    let id: string | null = null;

    // youtu.be short links
    if (hostname === 'youtu.be') {
      id = parsed.pathname.split('/').filter(Boolean)[0] ?? null;
    }

    // youtube.com/watch?v=
    else if (parsed.pathname === '/watch') {
      id = parsed.searchParams.get('v');
    }

    // youtube.com/shorts/
    else if (parsed.pathname.startsWith('/shorts/')) {
      id = parsed.pathname.split('/shorts/')[1]?.split('/')[0] ?? null;
    }

    // youtube.com/embed/
    else if (parsed.pathname.startsWith('/embed/')) {
      id = parsed.pathname.split('/embed/')[1]?.split('/')[0] ?? null;
    }

    if (!id || !/^[a-zA-Z0-9_-]{11}$/.test(id)) {
      return null;
    }

    return `https://www.youtube.com/embed/${id}`;
  } catch {
    return null;
  }
}

/* -----------------------------------
SEO METADATA
----------------------------------- */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const machine = await client.fetch(
    `*[_type == "machine" && slug.current == $slug][0]{
      name,
      brand,
      stockNumber,
      description,
      slug
    }`,
    { slug: params.machine }
  );

  if (!machine) {
    return {
      title: 'Machine Not Found | Concord Machine Tools',
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const fullName = getFullMachineName(machine);

  const canonicalUrl = `https://www.concordmt.com/inventory/${params.category}/${params.subcategory}/${machine.slug?.current || params.machine}`;

  const metaDescription =
    machine.description?.trim().slice(0, 155) ||
    `Used ${fullName} for sale at Concord Machine Tools. Contact us for pricing, specifications, availability, and additional machine details. Stock #${machine.stockNumber}.`;

  return {
    title: `Used ${fullName} for Sale | Concord Machine Tools`,
    description: metaDescription,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title: `Used ${fullName} for Sale | Concord Machine Tools`,
      description: metaDescription,
      url: canonicalUrl,
      siteName: 'Concord Machine Tools',
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title: `Used ${fullName} for Sale | Concord Machine Tools`,
      description: metaDescription,
    },
  };
}

/* -----------------------------------
PAGE
----------------------------------- */

export default async function MachinePage({ params }: PageProps) {
  const machine = await client.fetch<Machine>(
    `*[_type == "machine" && slug.current == $slug][0]{
      _id,
      name,
      brand,
      model,
      modelSlug,
      modelDisplay,
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
      .filter((image): image is string => Boolean(image)) ?? [];

  const embedUrl = getYouTubeEmbedUrl(machine.videoUrl);

  const machineUrl = `https://www.concordmt.com/inventory/${params.category}/${params.subcategory}/${machine.slug?.current || params.machine}`;

  const updatedDate = machine._updatedAt
    ? new Date(machine._updatedAt).toISOString()
    : undefined;

  const formattedUpdatedDate = updatedDate
    ? new Date(updatedDate).toLocaleDateString()
    : null;

  const brandSlug = machine.brand ? slugify(machine.brand) : null;

  const modelPath =
    brandSlug && machine.modelSlug
      ? `/models/${brandSlug}/${machine.modelSlug}`
      : null;

  const brandPath = brandSlug ? `/models/${brandSlug}` : null;

  /* -----------------------------------
  PRODUCT STRUCTURED DATA
  ----------------------------------- */

  const productSchema = {
    '@type': 'Product',
    '@id': `${machineUrl}#product`,
    name: fullName,

    ...(machine.brand && {
      brand: {
        '@type': 'Brand',
        name: machine.brand,
      },
    }),

    ...(machine.model && {
      model: machine.model,
    }),

    sku: machine.stockNumber,

    url: machineUrl,

    ...(images.length > 0 && {
      image: images,
    }),

    description:
      machine.description ||
      `Used ${fullName} for sale. Contact Concord Machine Tools for pricing, specifications, and availability.`,

    category: 'Used CNC and Industrial Machinery',
  };

  /* -----------------------------------
  BREADCRUMB STRUCTURED DATA
  ----------------------------------- */

  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',

    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inventory',
        item: 'https://www.concordmt.com/inventory',
      },

      {
        '@type': 'ListItem',
        position: 2,
        name: params.category.replace(/-/g, ' '),
        item: `https://www.concordmt.com/inventory/${params.category}`,
      },

      {
        '@type': 'ListItem',
        position: 3,
        name: params.subcategory.replace(/-/g, ' '),
        item: `https://www.concordmt.com/inventory/${params.category}/${params.subcategory}`,
      },

      {
        '@type': 'ListItem',
        position: 4,
        name: fullName,
        item: machineUrl,
      },
    ],
  };

  /* -----------------------------------
  WEBPAGE STRUCTURED DATA
  ----------------------------------- */

  const webpageSchema = {
    '@type': 'WebPage',
    '@id': `${machineUrl}#webpage`,
    url: machineUrl,
    name: `Used ${fullName} for Sale | Concord Machine Tools`,

    description:
      machine.description ||
      `Used ${fullName} available from Concord Machine Tools.`,

    isPartOf: {
      '@id': 'https://www.concordmt.com/#website',
    },

    about: {
      '@id': 'https://www.concordmt.com/#organization',
    },

    mainEntity: {
      '@id': `${machineUrl}#product`,
    },

    ...(updatedDate && {
      dateModified: updatedDate,
    }),
  };

  /* -----------------------------------
  COMBINED STRUCTURED DATA
  ----------------------------------- */

  const structuredData = {
    '@context': 'https://schema.org',

    '@graph': [
      webpageSchema,
      productSchema,
      breadcrumbSchema,
    ],
  };

  /* -----------------------------------
  RELATED MACHINES
  ----------------------------------- */

  const relatedMachines = machine.subcategory?._ref
    ? await client.fetch(
        `*[_type == "machine" &&
          slug.current != $slug &&
          subcategory._ref == $subcategoryRef
        ]
        | order(
            (brand == $brand) desc,
            yearOfMfg desc
          )[0...4]{
            _id,
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

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">

      {/* STRUCTURED DATA */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      {/* BREADCRUMBS */}

      <nav className="mb-6 text-sm text-gray-500">
        <Link
          href="/inventory"
          className="text-blue-500 hover:underline"
        >
          Inventory
        </Link>{' › '}

        <Link
          href={`/inventory/${params.category}`}
          className="text-blue-500 hover:underline"
        >
          {params.category.replace(/-/g, ' ')}
        </Link>{' › '}

        <Link
          href={`/inventory/${params.category}/${params.subcategory}`}
          className="text-blue-500 hover:underline"
        >
          {params.subcategory.replace(/-/g, ' ')}
        </Link>{' › '}

        <span>{machine.name}</span>
      </nav>

      {/* MACHINE TITLE */}

      <h1 className="text-3xl font-semibold mb-2">
        {machine.name}
      </h1>

      <h2 className="text-xl font-semibold mt-2 mb-4 text-gray-800">
        Used {fullName} for Sale
      </h2>

      {/* BRAND LINK */}

      {machine.brand && brandPath && (
        <p className="mb-2 text-sm">
          View more{' '}
          <Link
            href={`/brands/${brandSlug}`}
            className="text-blue-600 underline hover:text-blue-800"
          >
            {machine.brand} machines
          </Link>
        </p>
      )}

      {/* LISTING UPDATE DATE */}

      {formattedUpdatedDate && (
        <p className="text-xs text-gray-500 mb-4">
          Listing updated: {formattedUpdatedDate}
        </p>
      )}

      {/* STOCK NUMBER AND QUOTE */}

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

      {/* MACHINE DESCRIPTION */}

      {machine.description && (
        <p className="mb-4 text-gray-800">
          {machine.description}
        </p>
      )}

      {/* AVAILABILITY INFORMATION */}

      <p className="mb-6 text-gray-700">
        This {fullName} is currently available for purchase. Contact us for
        pricing, additional details, or to request a quote. Our inventory is
        updated regularly, so availability is subject to change.
      </p>

      {/* MACHINE IMAGES */}

      {images.length > 0 && (
        <MachineImages images={images} />
      )}

      {/* MACHINE VIDEO */}

      {embedUrl && (
        <div className="mt-8 aspect-video">
          <iframe
            src={embedUrl}
            title={`${fullName} video`}
            className="w-full h-full rounded"
            allowFullScreen
          />
        </div>
      )}

      {/* MACHINE SPECIFICATIONS */}

      {machine.specifications && (
        <section className="mt-8">
          <h2 className="font-medium mb-2">
            Specifications
          </h2>

          <pre className="bg-gray-50 p-4 border rounded text-sm whitespace-pre-wrap">
            {machine.specifications}
          </pre>
        </section>
      )}

      {/* INTERNAL SEO LINKS */}

      <section className="mt-6 border-t pt-6 text-sm text-blue-600 space-y-2">

        {brandPath && (
          <p>
            <Link
              href={brandPath}
              className="underline hover:text-blue-800"
            >
              Browse all {machine.brand} models
            </Link>
          </p>
        )}

        {modelPath && (
          <p>
            <Link
              href={modelPath}
              className="underline hover:text-blue-800"
            >
              View more {machine.brand} {machine.modelDisplay || machine.model} machines
            </Link>
          </p>
        )}

        <p>
          <Link
            href={`/inventory/${params.category}/${params.subcategory}`}
            className="underline hover:text-blue-800"
          >
            View all {params.subcategory.replace(/-/g, ' ')}
          </Link>
        </p>

      </section>

      {/* REQUEST A QUOTE */}

      <section id="request-quote" className="mt-10">
        <RequestQuoteSection
          stockNumber={machine.stockNumber}
          machineName={machine.name}
          machineUrl={machineUrl}
        />
      </section>

      {/* SOCIAL MEDIA */}

      <section className="mt-10 border-t pt-6">
        <h3 className="text-lg font-semibold mb-3">
          Follow Concord Machine Tools
        </h3>

        <p className="text-sm text-gray-600 mb-4">
          Stay updated with newly listed machines, machine videos, and
          featured inventory.
        </p>

        <div className="flex gap-4 text-sm flex-wrap">

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

      {/* RELATED MACHINES */}

      {relatedMachines.length > 0 && (
        <section className="mt-12">

          <h2 className="text-xl font-semibold mb-4">
            Related Machines
          </h2>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {relatedMachines.map((m: any) => (
              <li
                key={m._id}
                className="border p-4 rounded"
              >
                <Link
                  href={`/inventory/${params.category}/${params.subcategory}/${m.slug.current}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {m.name}
                </Link>

                {m.yearOfMfg && (
                  <p className="text-sm text-gray-600">
                    Year: {m.yearOfMfg}
                  </p>
                )}
              </li>
            ))}

          </ul>

        </section>
      )}

    </main>
  );
}
