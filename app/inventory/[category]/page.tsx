// app/inventory/[category]/page.tsx
export const revalidate = 30;

import { client } from '@/lib/sanityClient';
import Link from 'next/link';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const SITE_URL = 'https://www.concordmt.com';

interface Subcategory {
  _id: string;
  name: string;
  slug: { current: string };
}

interface Category {
  name: string;
  slug: { current: string };
}

interface PageProps {
  params: {
    category: string;
  };
}

interface CategorySeoContent {
  title: string;
  description: string;
  heading: string;
  introduction: string[];
  sections: {
    heading: string;
    paragraphs: string[];
  }[];
}

/*
 * Category-specific SEO copy.
 * The category and subcategory navigation remains dynamically populated
 * from Sanity; this content only supplies the editorial copy for each
 * known top-level category.
 */
const categorySeoContent: Record<string, CategorySeoContent> = {
  'cnc-machinery': {
    title: 'Used CNC Machines for Sale | CNC Mills, Lathes & Machining Centers',
    description:
      'Browse used CNC machinery for sale at Concord Machine Tools, including vertical and horizontal machining centers, CNC lathes, turning centers and five-axis machines.',
    heading: 'Used CNC Machines & Machining Centers for Sale',
    introduction: [
      'Concord Machine Tools offers a changing selection of used CNC machines and computer numerical control equipment for manufacturers, machine shops, and industrial operations. Our inventory may include CNC vertical machining centers, horizontal machining centers, CNC mills, turning centers, lathes, boring mills, grinders, and specialized multi-axis machining equipment. Whether you are adding capacity, replacing an existing machine, or sourcing equipment for a new production requirement, our team can help you review available machinery and discuss potential options.',
      'Used CNC machine availability changes as equipment is purchased, sold, and sourced. Listings provide the machine details available at the time of publication, which may include manufacturer, model, year, control, travels, spindle specifications, tooling, options, photographs, and other configuration information. If you are looking for a particular machine that is not currently listed, contact Concord Machine Tools to discuss your requirements and possible sourcing opportunities.',
    ],
    sections: [
      {
        heading: 'Used CNC Mills & Vertical Machining Centers',
        paragraphs: [
          'CNC vertical machining centers and CNC mills are used for a broad range of milling, drilling, tapping, and production applications. Depending on current availability, our inventory may include compact machining centers for general-purpose work, larger VMCs for heavier components, high-speed machines, and models equipped with fourth- or fifth-axis capabilities. Buyers comparing machines should consider the work envelope, spindle taper and speed, tool changer capacity, control, axis configuration, and the type of work the machine needs to perform.',
          'We work with equipment from established builders such as Haas, Mazak, Okuma, Doosan, Hurco, Makino, and other manufacturers. Visit the relevant manufacturer pages to learn more about the brands represented in our used machinery marketplace.',
        ],
      },
      {
        heading: 'Used CNC Lathes, Turning Centers & Horizontal Machining Centers',
        paragraphs: [
          'CNC lathes and turning centers support production of precision turned components, while horizontal machining centers are commonly selected for multi-face machining, palletized production, and applications requiring efficient access to multiple sides of a workpiece. Available configurations can vary significantly. Live tooling, Y-axis capability, sub-spindles, bar feeders, pallet changers, rotary tables, probing, and other options can affect a machine’s suitability and value.',
          'When evaluating a used CNC machine, review its exact model and configuration rather than relying on the model family alone. Control generation, spindle condition, machine hours, maintenance history, included accessories, and overall operating condition are all relevant considerations.',
        ],
      },
      {
        heading: 'Five-Axis, Boring, Grinding & Specialized CNC Equipment',
        paragraphs: [
          'Concord Machine Tools also handles specialized CNC equipment, which may include five-axis machining centers, CNC boring mills, gantry and double-column machines, CNC grinders, and other production machinery. These machines can have application-specific features such as extended travels, high-speed or high-torque spindles, large worktables, rotary axes, probing systems, and specialized tooling packages.',
          'For specialized equipment, it is particularly important to identify the intended application, part size, material, accuracy requirements, and any required machine options. If you need help locating a particular configuration, share your specifications with our team so we can discuss available inventory and sourcing possibilities.',
        ],
      },
      {
        heading: 'Buying Used CNC Machinery from Concord Machine Tools',
        paragraphs: [
          'A used CNC machine purchase should be based on the complete machine configuration and its suitability for the buyer’s production needs. Review the published specifications, photographs, control type, included tooling and accessories, and any available condition information. When comparing similar machines, differences in spindle, travels, tool capacity, automation, and options can have a meaningful impact on productivity and value.',
          'Concord Machine Tools is based in Michigan and works with buyers throughout the United States and internationally. Browse the subcategories below to view current listings, or contact us if you are searching for a specific manufacturer, model, or machine configuration.',
        ],
      },
    ],
  },

  'fabricating-and-stamping': {
    title: 'Used Fabricating & Stamping Equipment for Sale | Metalworking Machinery',
    description:
      'Explore used metal fabricating and stamping equipment at Concord Machine Tools, including press brakes, shears, presses, laser and plasma cutters, rolls and more.',
    heading: 'Used Metal Fabricating & Stamping Equipment for Sale',
    introduction: [
      'Concord Machine Tools offers used metal fabricating, forming, cutting, and stamping machinery for manufacturers, fabricators, and industrial businesses. Depending on current inventory, equipment may include press brakes, shears, stamping presses, laser cutting machines, plasma cutters, waterjets, ironworkers, plate rolls, angle rolls, saws, and other metalworking equipment. Our inventory changes as machinery is purchased, sold, and sourced.',
      'Whether you are expanding a fabrication department, replacing an existing machine, adding a new process, or looking for equipment for a larger manufacturing operation, our team can help you review available machinery. If the specific machine or configuration you need is not listed, contact us to discuss your requirements and possible sourcing opportunities.',
    ],
    sections: [
      {
        heading: 'Used Press Brakes, Shears & Metal Forming Equipment',
        paragraphs: [
          'Press brakes are used to bend sheet and plate material into formed components, while mechanical and hydraulic shears are used to cut metal stock to size. When comparing used press brakes, buyers should consider rated tonnage, bending length, frame construction, control type, backgauge configuration, tooling, and available safety features. For shears, important factors include cutting capacity, cutting length, material type, blade condition, and backgauge capabilities.',
          'Other forming equipment may include plate rolls, angle rolls, section benders, tube and pipe benders, and related machinery. The required capacity depends on material grade, thickness, width or section size, bend radius, and production requirements.',
        ],
      },
      {
        heading: 'Used Stamping Presses & Punching Equipment',
        paragraphs: [
          'Stamping presses and punching equipment are used in manufacturing operations that form, pierce, blank, or shape metal components. Press selection depends on factors such as press type, rated tonnage, stroke, bed dimensions, shut height, speed, control and feeding requirements, and the tooling or die package included with the machine.',
          'A machine’s suitability cannot be determined by tonnage alone. Buyers should evaluate the intended process, material, part geometry, production rate, available floor space, and any auxiliary equipment needed to operate the press. Details about the machine’s condition and operating history are also important when evaluating pre-owned equipment.',
        ],
      },
      {
        heading: 'Laser, Plasma, Waterjet & Other Cutting Machinery',
        paragraphs: [
          'Used metal cutting equipment may include laser cutting systems, plasma cutting machines, waterjet systems, band saws, and other cutting solutions. Relevant specifications vary by process but can include cutting area, material capacity, power or cutting source, CNC control, software, material handling, filtration, and included accessories.',
          'For laser, plasma, and waterjet equipment, buyers should confirm the machine’s configuration and the materials and thicknesses it is designed to process. Availability of consumables, service support, software, and auxiliary systems may also factor into a purchasing decision.',
        ],
      },
      {
        heading: 'Evaluating Used Fabricating & Stamping Machinery',
        paragraphs: [
          'The value and suitability of used fabrication equipment depend on its manufacturer, model, age, capacity, configuration, condition, controls, tooling, accessories, and current market demand. Photographs, specification plates, operating hours where applicable, maintenance records, and details about any known repairs can help buyers understand the equipment being offered.',
          'Concord Machine Tools works with buyers seeking individual machines as well as multiple pieces of equipment for broader production needs. Browse the subcategories below to review current listings, or contact our team if you are searching for a particular type of fabricating or stamping machinery.',
        ],
      },
    ],
  },

  'manual-machinery': {
    title: 'Used Manual Machinery for Sale | Mills, Lathes & Grinders',
    description:
      'Browse used manual metalworking machinery at Concord Machine Tools, including manual milling machines, engine lathes, surface grinders, boring mills and more.',
    heading: 'Used Manual Metalworking Machinery for Sale',
    introduction: [
      'Concord Machine Tools offers used manual metalworking machinery for machine shops, toolrooms, maintenance departments, manufacturers, and industrial facilities. Depending on current availability, our inventory may include manual milling machines, engine lathes, surface grinders, cylindrical grinders, boring mills, drill presses, saws, and other conventional machine tools.',
      'Manual machinery continues to play an important role in repair work, tooling, prototyping, maintenance, short-run production, and secondary machining operations. Whether you are outfitting a shop, replacing an older machine, or adding a specialized capability, our team can help you review available equipment and discuss sourcing options for machines that are not currently listed.',
    ],
    sections: [
      {
        heading: 'Used Manual Milling Machines',
        paragraphs: [
          'Manual milling machines are used for machining flat surfaces, slots, pockets, contours, and a wide range of precision features. Common configurations include vertical mills, horizontal mills, turret mills, and universal milling machines. Buyers should consider table dimensions, longitudinal and cross travel, spindle taper, spindle speed range, head configuration, power feed, DRO equipment, and included tooling.',
          'Machine size and configuration should be matched to the parts and operations required. A smaller toolroom mill may be suitable for repair and prototype work, while larger knee mills and production-style manual mills can accommodate different work envelopes and cutting requirements.',
        ],
      },
      {
        heading: 'Used Engine Lathes & Conventional Turning Equipment',
        paragraphs: [
          'Engine lathes remain useful for turning, facing, threading, boring, and general-purpose machining. Important specifications include swing over bed, distance between centers, spindle bore, spindle speed range, bed length, chuck size, threading capability, and available steady rests, follow rests, and tooling.',
          'When evaluating a used manual lathe, buyers should review the condition of the ways, spindle, gearbox, lead screw, feed rod, carriage, and other major components. The machine’s included accessories and tooling can also affect its overall usefulness and value.',
        ],
      },
      {
        heading: 'Used Surface Grinders, Cylindrical Grinders & Boring Mills',
        paragraphs: [
          'Grinding machines are used where surface finish, dimensional accuracy, and controlled material removal are important. Surface grinder specifications can include table size, longitudinal and cross travel, wheel dimensions, spindle configuration, and available coolant or filtration equipment. Cylindrical grinders have different workholding and capacity considerations, including swing, distance between centers, and internal or external grinding capability.',
          'Manual boring mills and other conventional machine tools can support large-part machining, maintenance, repair, and specialized shop operations. Buyers should review the machine’s work envelope, spindle and quill specifications, table or floor configuration, travels, and available accessories.',
        ],
      },
      {
        heading: 'What to Consider When Buying Used Manual Machinery',
        paragraphs: [
          'The condition of a used manual machine is particularly important because wear in ways, screws, bearings, gears, and other mechanical components can affect accuracy and operation. Buyers should review available photographs and specifications and, when possible, inspect the machine and test its functions. Included tooling, vises, chucks, fixtures, DRO systems, and other accessories may add practical value.',
          'Concord Machine Tools is based in Michigan and serves machine shops and manufacturers throughout the United States and internationally. Browse the subcategories below for current listings, or contact us if you need help locating a particular manual machine or configuration.',
        ],
      },
    ],
  },
};

const defaultCategoryContent = (categoryName: string): CategorySeoContent => ({
  title: `Used ${categoryName} for Sale | Industrial Machinery`,
  description: `Browse used ${categoryName.toLowerCase()} at Concord Machine Tools. View current machinery listings, specifications and equipment details, or contact us about sourcing.`,
  heading: `Used ${categoryName} for Sale`,
  introduction: [
    `Browse used ${categoryName.toLowerCase()} at Concord Machine Tools. Our industrial machinery inventory changes as equipment is purchased, sold, and sourced, so available listings may vary over time.`,
    'Review the subcategories below to find equipment listings and available specifications. If you are searching for a particular machine, manufacturer, or configuration that is not currently listed, contact our team to discuss your requirements and possible sourcing opportunities.',
  ],
  sections: [
    {
      heading: `Buying Used ${categoryName}`,
      paragraphs: [
        `When evaluating used ${categoryName.toLowerCase()}, consider the manufacturer, model, year, configuration, condition, included options, and suitability for your intended application. Review the available listing details and contact Concord Machine Tools with questions about a particular machine.`,
        'Concord Machine Tools works with buyers throughout the United States and internationally. You can also browse the complete inventory or contact us about locating equipment that meets your requirements.',
      ],
    },
  ],
});

/* ------------------------------------
   SEO METADATA
------------------------------------ */
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const categoryData: Category | null = await client.fetch(
    `*[_type == "category" && slug.current == $slug][0]{
      name,
      slug
    }`,
    { slug: params.category }
  );

  if (!categoryData) {
    return {
      title: 'Machinery Category Not Found',
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const content =
    categorySeoContent[params.category] ??
    defaultCategoryContent(categoryData.name);

  const canonicalUrl = `${SITE_URL}/inventory/${params.category}`;

  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: content.title,
      description: content.description,
      url: canonicalUrl,
      siteName: 'Concord Machine Tools',
      type: 'website',
      locale: 'en_US',
    },
  };
}

/* ------------------------------------
   PAGE
------------------------------------ */
export default async function CategoryPage({ params }: PageProps) {
  const { category } = params;

  const categoryData: Category | null = await client.fetch(
    `*[_type == "category" && slug.current == $slug][0]{
      name,
      slug
    }`,
    { slug: category }
  );

  if (!categoryData) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold mb-4">Category Not Found</h1>
        <p className="text-gray-700">
          The requested category does not exist.
        </p>
      </div>
    );
  }

  const subcategories: Subcategory[] = await client.fetch(
    `*[_type == "subcategory" && parentCategory->slug.current == $slug] | order(name asc) {
      _id,
      name,
      slug
    }`,
    { slug: category }
  );

  const content =
    categorySeoContent[category] ??
    defaultCategoryContent(categoryData.name);

  const categoryUrl = `${SITE_URL}/inventory/${category}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${categoryUrl}#webpage`,
        url: categoryUrl,
        name: content.title,
        description: content.description,
        isPartOf: {
          '@id': `${SITE_URL}/#website`,
        },
        breadcrumb: {
          '@id': `${categoryUrl}#breadcrumb`,
        },
        mainEntity: {
          '@id': `${categoryUrl}#subcategories`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${categoryUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Inventory',
            item: `${SITE_URL}/inventory`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: categoryData.name,
            item: categoryUrl,
          },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${categoryUrl}#subcategories`,
        name: `${categoryData.name} Subcategories`,
        numberOfItems: subcategories.length,
        itemListElement: subcategories.map((sub, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: sub.name,
          url: `${categoryUrl}/${sub.slug.current}`,
        })),
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="text-sm text-slate-500 mb-6"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-blue-700 hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href="/inventory"
              className="hover:text-blue-700 hover:underline"
            >
              Inventory
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-slate-800" aria-current="page">
            {categoryData.name}
          </li>
        </ol>
      </nav>

      {/* Category Heading and Introduction */}
      <header className="max-w-4xl mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold mb-5">
          {content.heading}
        </h1>

        <div className="space-y-4 text-slate-700 leading-relaxed">
          {content.introduction.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </header>

      {/* Subcategories */}
      <section aria-labelledby="subcategory-heading">
        <h2
          id="subcategory-heading"
          className="text-2xl font-semibold mb-5 text-slate-900"
        >
          Browse {categoryData.name} Subcategories
        </h2>

        {subcategories.length === 0 ? (
          <p className="text-gray-600">
            No subcategories found for this category.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {subcategories.map((sub) => (
              <Link
                key={sub._id}
                href={`/inventory/${category}/${sub.slug.current}`}
                className="block border rounded-lg p-5 bg-white hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-medium text-slate-900 mb-1">
                  {sub.name}
                </h3>
                <p className="text-sm text-gray-600">
                  View available machines
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Category-Specific SEO Content */}
      <section className="mt-14 max-w-4xl text-slate-700 leading-relaxed space-y-8">
        {content.sections.map((section, index) => (
          <div key={index} className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">
              {section.heading}
            </h2>
            {section.paragraphs.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex}>{paragraph}</p>
            ))}
          </div>
        ))}
      </section>

      {/* Internal Navigation and CTA */}
      <section className="mt-12 mb-8 border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">
          Find the Right Used Machinery
        </h2>

        <p className="max-w-4xl text-slate-700 leading-relaxed mb-5">
          Explore the current listings in our{' '}
          <Link
            href="/inventory"
            className="text-blue-700 hover:underline font-medium"
          >
            complete used machinery inventory
          </Link>
          . If you are looking to sell surplus equipment, visit our{' '}
          <Link
            href="/sell"
            className="text-blue-700 hover:underline font-medium"
          >
            Sell Your Machine
          </Link>{' '}
          page. You can also learn about our{' '}
          <Link
            href="/consulting"
            className="text-blue-700 hover:underline font-medium"
          >
            machinery consulting
          </Link>{' '}
          services or{' '}
          <Link
            href="/contact"
            className="text-blue-700 hover:underline font-medium"
          >
            contact Concord Machine Tools
          </Link>{' '}
          with questions about a particular machine or equipment requirement.
        </p>
      </section>
    </div>
  );
}
