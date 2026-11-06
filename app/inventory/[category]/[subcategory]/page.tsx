// app/inventory/[category]/[subcategory]/page.tsx
export const revalidate = 30;

import { client } from '@/lib/sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

const SITE_URL = 'https://www.concordmt.com';

/* ------------------------------------
   TYPES
------------------------------------ */
interface Category {
  name: string;
  slug: { current: string };
}

interface Subcategory {
  _id: string;
  name: string;
  slug: { current: string };
  parentCategory?: {
    name: string;
    slug: { current: string };
  };
}

interface Machine {
  _id: string;
  name: string;
  brand?: string;
  yearOfMfg?: number;
  stockNumber?: string;
  images?: {
    asset?: {
      _ref?: string;
      _id?: string;
      url?: string;
    };
    alt?: string;
  }[];
  slug: { current: string };
}

interface PageProps {
  params: {
    category: string;
    subcategory: string;
  };
}

interface SubcategorySeoContent {
  title: string;
  description: string;
  heading: string;
  introduction: string[];
  buyingHeading: string;
  buyingParagraphs: string[];
}

/* ------------------------------------
   IMAGE URL BUILDER
------------------------------------ */
const builder = imageUrlBuilder(client);
const urlFor = (source: any) =>
  builder.image(source).auto('format').width(900).height(600).fit('crop').url();

/* ------------------------------------
   SUBCATEGORY CONTENT
   Editorial copy is selected using the Sanity
   subcategory name and parent category. The
   inventory itself remains dynamically queried.
------------------------------------ */
function createSubcategoryContent(
  categoryName: string,
  subcategoryName: string
): SubcategorySeoContent {
  const name = subcategoryName.trim();
  const lower = name.toLowerCase();
  const categoryLower = categoryName.toLowerCase();

  const commonBuyingParagraphs = [
    `When comparing used ${lower}, review the exact manufacturer, model, year, configuration, condition, and included options. Specifications can vary substantially between machines within the same general category, so check each listing carefully and contact Concord Machine Tools if you need clarification about a particular machine.`,
    'Other important considerations may include control or operating system, machine hours where applicable, maintenance history, tooling, workholding, accessories, electrical requirements, installation needs, and transportation. The right machine depends on the parts you intend to produce, your production requirements, and the equipment already in your facility.',
    'Concord Machine Tools is based in Michigan and works with buyers throughout the United States and internationally. Browse the current listings on this page, or contact our team if you are looking for a particular manufacturer, model, or configuration that is not currently available. We can discuss your requirements and potential sourcing opportunities.',
  ];

  const base: SubcategorySeoContent = {
    title: `Used ${name} for Sale | Concord Machine Tools`,
    description: `Browse used ${lower} for sale at Concord Machine Tools. Review current machine listings, specifications, photos and equipment details, or contact us about sourcing.`,
    heading: `Used ${name} for Sale`,
    introduction: [
      `Explore the current selection of used ${lower} at Concord Machine Tools. Our inventory changes as machines are purchased, sold, and sourced, and listings may include equipment from a range of established machine tool and industrial equipment manufacturers.`,
      `This page displays available ${lower} listings with the machine information currently provided, which may include manufacturer, model, year, photographs, specifications, stock number, and configuration details. If you are searching for a particular machine that is not shown, contact our team to discuss your application and possible sourcing options.`,
    ],
    buyingHeading: `Buying Used ${name}`,
    buyingParagraphs: commonBuyingParagraphs,
  };

  if (
    lower.includes('vertical machining') ||
    lower.includes('vertical cnc') ||
    /\bvmc\b/.test(lower)
  ) {
    return {
      ...base,
      title: 'Used CNC Vertical Machining Centers for Sale | Concord Machine Tools',
      description:
        'Browse used CNC vertical machining centers for sale, including VMCs from leading machine tool builders. View current listings, specifications and photos.',
      heading: 'Used CNC Vertical Machining Centers for Sale',
      introduction: [
        'Concord Machine Tools offers a changing selection of used CNC vertical machining centers for manufacturers, machine shops, and production facilities. Vertical machining centers are widely used for milling, drilling, tapping, and other machining operations, with configurations ranging from compact general-purpose machines to larger, high-performance production equipment.',
        'Available machines may differ in table size, X/Y/Z travels, spindle taper, spindle speed, tool changer capacity, CNC control, axis configuration, and included options. Review the individual listings for available details, photographs, and specifications. Inventory changes regularly, so contact us if you are searching for a particular VMC that is not currently listed.',
      ],
      buyingHeading: 'What to Consider When Buying a Used CNC Vertical Machining Center',
      buyingParagraphs: [
        'Start by matching the machine’s work envelope and table capacity to the size and weight of the parts you plan to machine. Spindle taper, horsepower, speed range, and condition should be evaluated against the materials and cutting operations involved. Tool changer capacity, probing, coolant systems, chip management, and fourth- or fifth-axis options can also affect a machine’s suitability.',
        'The CNC control generation, machine hours, maintenance history, and overall mechanical condition are important parts of the evaluation. Compare the complete configuration rather than relying on the model name alone, since machines from the same product family may have different travels, spindles, controls, and options.',
        ...commonBuyingParagraphs.slice(2),
      ],
    };
  }

  if (
    lower.includes('horizontal machining') ||
    lower.includes('horizontal cnc') ||
    /\bhmc\b/.test(lower)
  ) {
    return {
      ...base,
      title: 'Used CNC Horizontal Machining Centers for Sale | Concord Machine Tools',
      description:
        'Find used CNC horizontal machining centers for sale at Concord Machine Tools. Browse HMC listings, pallet configurations, specifications and photos.',
      heading: 'Used CNC Horizontal Machining Centers for Sale',
      introduction: [
        'Concord Machine Tools offers used CNC horizontal machining centers for manufacturers seeking equipment for multi-face machining, production work, and applications that benefit from horizontal spindle orientation. Depending on availability, listings may include machines with pallet systems, rotary tables, automatic tool changers, and a range of work capacities.',
        'Horizontal machining center configurations vary by model and options. Important specifications can include X/Y/Z travels, pallet or table dimensions, spindle taper and speed, tool capacity, pallet changer arrangement, CNC control, and available probing or coolant systems. Review each machine listing for its specific details and contact us about equipment that meets your production requirements.',
      ],
      buyingHeading: 'Evaluating a Used Horizontal Machining Center',
      buyingParagraphs: [
        'Consider the size and weight of the components, the number of sides that must be machined, and the production volume. Pallet size, pallet count, indexing capability, and automation can influence throughput and workflow. Spindle condition, tool capacity, axis travels, and the machine’s control are also central to evaluating the configuration.',
        'For a used HMC, review the pallet changer operation, rotary or indexing functions, coolant delivery, chip evacuation, and maintenance history where information is available. Confirm what tooling, fixtures, pallets, and accessories are included with the machine.',
        ...commonBuyingParagraphs.slice(2),
      ],
    };
  }

  if (
    lower.includes('lathe') ||
    lower.includes('turning center') ||
    lower.includes('turning centres')
  ) {
    return {
      ...base,
      title: 'Used CNC Lathes & Turning Centers for Sale | Concord Machine Tools',
      description:
        'Browse used CNC lathes and turning centers for sale. Explore current listings, machine configurations, specifications and photos at Concord Machine Tools.',
      heading: 'Used CNC Lathes & Turning Centers for Sale',
      introduction: [
        'Concord Machine Tools offers used CNC lathes and turning centers for manufacturers and machine shops producing turned components. Available equipment may include two-axis CNC lathes, turning centers with live tooling, Y-axis machines, sub-spindle configurations, twin-spindle machines, and other specialized turning equipment.',
        'The capabilities of CNC turning equipment depend on its exact configuration. Swing and turning diameter, maximum turning length, bar capacity, spindle bore, spindle speed, turret arrangement, live tooling, Y-axis travel, sub-spindle capability, and included accessories can all affect suitability. Check individual listings for machine-specific details and availability.',
      ],
      buyingHeading: 'What to Review When Buying a Used CNC Lathe',
      buyingParagraphs: [
        'Match the machine’s turning capacity and bar or chuck configuration to the parts you intend to produce. Consider whether live tooling, Y-axis capability, a sub-spindle, parts catcher, bar feeder, or additional spindle options are needed for your process. These features can vary substantially between machines with similar model designations.',
        'Review spindle and turret condition, control generation, machine hours, maintenance history, included chucks and tooling, and chip or coolant handling equipment. For machines with automation or bar feeding, confirm the make, model, compatibility, and included components.',
        ...commonBuyingParagraphs.slice(2),
      ],
    };
  }

  if (
    lower.includes('boring mill') ||
    lower.includes('boring machine') ||
    lower.includes('horizontal boring')
  ) {
    return {
      ...base,
      title: 'Used CNC Boring Mills for Sale | Horizontal & Floor-Type Boring Mills',
      description:
        'Browse used CNC boring mills for sale, including horizontal and floor-type boring equipment. View current machinery listings at Concord Machine Tools.',
      heading: 'Used CNC Boring Mills for Sale',
      introduction: [
        'Concord Machine Tools offers used boring mills for manufacturers and machine shops machining large, heavy, or complex components. Depending on current availability, equipment may include horizontal boring mills, CNC table-type boring mills, floor-type boring mills, and other large-capacity machining equipment.',
        'Boring mill configurations can differ significantly in table size, spindle diameter, spindle travel, column arrangement, rotary table capacity, floor or table configuration, and CNC control. Review each listing for its available specifications and photographs, and contact us if you need help identifying a machine for a particular work envelope or application.',
      ],
      buyingHeading: 'Evaluating a Used Boring Mill',
      buyingParagraphs: [
        'Begin with the dimensions and weight of the workpieces. Consider table size and capacity, X/Y/Z and W-axis travels where applicable, spindle diameter, spindle taper, facing head or ram configuration, and the capacity of any rotary table. These details determine the size and type of work the machine can accommodate.',
        'For large boring mills, installation and logistics are also important. Consider floor space, foundation requirements, electrical service, machine layout, dismantling, rigging, and transportation. Confirm the machine’s configuration and included accessories before making a purchasing decision.',
        ...commonBuyingParagraphs.slice(2),
      ],
    };
  }

  if (lower.includes('grinder') || lower.includes('grinding')) {
    return {
      ...base,
      title: `Used ${name} for Sale | Industrial Grinding Machines`,
      description: `Browse used ${lower} for sale at Concord Machine Tools. Review machine capacity, specifications, photos and current grinding equipment listings.`,
      heading: `Used ${name} for Sale`,
      introduction: [
        `Concord Machine Tools offers used grinding machinery for manufacturers, toolrooms, and precision machining operations. Depending on the specific category and current inventory, equipment may include surface grinders, cylindrical grinders, centerless grinders, tool and cutter grinders, and CNC grinding machines.`,
        'Grinding machine selection depends on the type of work, required tolerances, workpiece dimensions, material, wheel configuration, and production requirements. Review the individual machine listing for its available capacity, specifications, photographs, and included accessories.',
      ],
      buyingHeading: `What to Consider When Buying Used ${name}`,
      buyingParagraphs: [
        'Important considerations may include grinding capacity, table or workholding dimensions, spindle configuration, wheel size, travel, control type, coolant and filtration systems, dressing equipment, and included tooling. The relevant specifications differ between surface, cylindrical, centerless, tool and cutter, and other grinding machine types.',
        'Inspect the condition of the spindle, ways, slides, workholding, coolant system, and other major components. Where possible, review maintenance records and confirm the machine’s operating condition and included accessories.',
        ...commonBuyingParagraphs.slice(2),
      ],
    };
  }

  if (
    lower.includes('five-axis') ||
    lower.includes('5-axis') ||
    lower.includes('5 axis')
  ) {
    return {
      ...base,
      title: 'Used 5-Axis CNC Machining Centers for Sale | Concord Machine Tools',
      description:
        'Explore used 5-axis CNC machining centers for sale. Browse available multi-axis machines, specifications, configurations and photos at Concord Machine Tools.',
      heading: 'Used 5-Axis CNC Machining Centers for Sale',
      introduction: [
        'Concord Machine Tools offers used five-axis CNC machining centers for manufacturers machining complex components, contoured surfaces, and parts that require multiple machining angles or orientations. Depending on availability, equipment may include trunnion-style machines, swivel-head configurations, universal machining centers, and other multi-axis platforms.',
        'Five-axis machine configurations vary by rotary-axis arrangement, table size, travels, spindle, control, tool changer, and workpiece capacity. Review each listing carefully to understand the machine’s actual configuration, available options, and included accessories.',
      ],
      buyingHeading: 'Evaluating a Used 5-Axis CNC Machine',
      buyingParagraphs: [
        'Identify the rotary-axis configuration and the work envelope available when the rotary axes are in use. Consider the size and weight of the parts, required machining access, spindle performance, tool capacity, control functions, probing, and any required workholding or automation.',
        'The condition and calibration of rotary axes are important considerations when evaluating a used five-axis machine. Review available service information, machine hours, control generation, included tooling, and the machine’s suitability for the intended application.',
        ...commonBuyingParagraphs.slice(2),
      ],
    };
  }

  if (
    categoryLower.includes('fabricat') ||
    categoryLower.includes('stamping')
  ) {
    return {
      ...base,
      title: `Used ${name} for Sale | Metal Fabricating Equipment`,
      description: `Browse used ${lower} for sale at Concord Machine Tools. Review available metal fabrication equipment, specifications and machine details.`,
      heading: `Used ${name} for Sale`,
      introduction: [
        `Concord Machine Tools offers used metal fabrication and forming equipment for manufacturers, fabricators, and industrial businesses. The equipment in this category supports processes such as cutting, bending, forming, punching, rolling, and processing metal stock. Current availability changes as machines are purchased and sold.`,
        'Machine capacity and configuration should be matched to the material, thickness, dimensions, and production requirements of the intended work. Review each listing for its specifications, photographs, condition information, and included tooling or accessories.',
      ],
      buyingHeading: `What to Consider When Buying Used ${name}`,
      buyingParagraphs: [
        'Important factors vary by machine type but may include rated capacity, working length or area, material thickness, machine dimensions, control, tooling, backgauges, feeding systems, and auxiliary equipment. Confirm that the listed capacity is appropriate for the material and process you intend to run.',
        'Review the condition of major mechanical, hydraulic, electrical, and control components as applicable. Also consider installation requirements, available service support, tooling availability, and the cost of moving and commissioning the equipment.',
        ...commonBuyingParagraphs.slice(2),
      ],
    };
  }

  return base;
}

/* ------------------------------------
   METADATA
------------------------------------ */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category, subcategory } = params;

  const data = await client.fetch(
    `{
      "category": *[_type == "category" && slug.current == $category][0]{
        name,
        slug
      },
      "subcategory": *[
        _type == "subcategory" &&
        slug.current == $subcategory &&
        parentCategory->slug.current == $category
      ][0]{
        name,
        slug
      }
    }`,
    { category, subcategory }
  );

  if (!data?.category || !data?.subcategory) {
    return {
      title: 'Machinery Category Not Found',
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const content = createSubcategoryContent(
    data.category.name,
    data.subcategory.name
  );

  const canonicalUrl = `${SITE_URL}/inventory/${category}/${subcategory}`;

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
   PAGE COMPONENT
------------------------------------ */
export default async function SubcategoryPage({ params }: PageProps) {
  const { category, subcategory } = params;

  const subcategoryData: Subcategory | null = await client.fetch(
    `*[
      _type == "subcategory" &&
      slug.current == $subcategory &&
      parentCategory->slug.current == $category
    ][0]{
      _id,
      name,
      slug,
      "parentCategory": parentCategory->{
        name,
        slug
      }
    }`,
    { category, subcategory }
  );

  if (!subcategoryData) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold mb-4">
          Machinery Category Not Found
        </h1>
        <p className="text-gray-700">
          The requested machinery category could not be found.
        </p>
        <Link
          href="/inventory"
          className="inline-block mt-4 text-blue-700 hover:underline"
        >
          Browse all inventory
        </Link>
      </div>
    );
  }

  const categoryName =
    subcategoryData.parentCategory?.name ?? category.replace(/-/g, ' ');

  const content = createSubcategoryContent(
    categoryName,
    subcategoryData.name
  );

  const machines: Machine[] = await client.fetch(
    `*[
      _type == "machine" &&
      subcategory._ref == $subcategoryId &&
      defined(slug.current) &&
      defined(category->slug.current) &&
      defined(subcategory->slug.current)
    ] | order(yearOfMfg desc, brand asc){
      _id,
      name,
      brand,
      yearOfMfg,
      stockNumber,
      images[]{
        asset->{
          _id,
          url
        },
        alt
      },
      slug
    }`,
    { subcategoryId: subcategoryData._id }
  );

  const manufacturers = Array.from(
    new Set(
      machines
        .map((machine) => machine.brand)
        .filter((brand): brand is string => Boolean(brand.trim()))
    )
  ).sort();

  const pageUrl = `${SITE_URL}/inventory/${category}/${subcategory}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: content.title,
        description: content.description,
        isPartOf: {
          '@id': `${SITE_URL}/#website`,
        },
        breadcrumb: {
          '@id': `${pageUrl}#breadcrumb`,
        },
        mainEntity: {
          '@id': `${pageUrl}#machines`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
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
            name: categoryName,
            item: `${SITE_URL}/inventory/${category}`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: subcategoryData.name,
            item: pageUrl,
          },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${pageUrl}#machines`,
        name: `${subcategoryData.name} Inventory`,
        numberOfItems: machines.length,
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        itemListElement: machines.map((machine, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: machine.name,
          url: `${pageUrl}/${machine.slug.current}`,
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
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500 mb-6">
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
          <li>
            <Link
              href={`/inventory/${category}`}
              className="hover:text-blue-700 hover:underline"
            >
              {categoryName}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-slate-800" aria-current="page">
            {subcategoryData.name}
          </li>
        </ol>
      </nav>

      {/* Page Heading and SEO Introduction */}
      <header className="max-w-4xl mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold mb-5">
          {content.heading}
        </h1>

        <div className="space-y-4 text-slate-700 leading-relaxed">
          {content.introduction.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </header>

      {/* Manufacturer Information */}
      {manufacturers.length > 0 && (
        <section className="max-w-4xl mb-8">
          <p className="text-slate-700 leading-relaxed">
            Manufacturers represented in the current listings include{' '}
            <strong>{manufacturers.join(', ')}</strong>. Available brands and
            models change as equipment is purchased and sold.
          </p>
        </section>
      )}

      {/* Current Machine Listings */}
      <section aria-labelledby="available-machines-heading">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <h2
            id="available-machines-heading"
            className="text-2xl font-semibold"
          >
            Available {subcategoryData.name}
          </h2>
          <span className="text-sm text-slate-500">
            {machines.length}{' '}
            {machines.length === 1 ? 'machine' : 'machines'} listed
          </span>
        </div>

        {machines.length === 0 ? (
          <div className="border border-slate-200 rounded-lg bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No {subcategoryData.name.toLowerCase()} currently listed
            </h3>
            <p className="text-slate-700 leading-relaxed">
              Our used machinery inventory changes regularly. If you are
              searching for a particular machine, manufacturer, or model,
              contact Concord Machine Tools to discuss your requirements and
              potential sourcing opportunities.
            </p>
            <Link
              href="/contact"
              className="inline-block mt-4 text-blue-700 hover:underline font-medium"
            >
              Contact us about sourcing a machine
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {machines.map((machine) => {
              const firstImage = machine.images?.[0];
              const imageUrl = firstImage?.asset
                ? urlFor(firstImage.asset)
                : '/placeholder.jpg';

              return (
                <Link
                  key={machine._id}
                  href={`/inventory/${category}/${subcategory}/${machine.slug.current}`}
                  className="block border rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow"
                >
                  <div className="relative w-full h-48 bg-slate-100">
                    <Image
                      src={imageUrl}
                      alt={
                        firstImage?.alt ||
                        `${machine.yearOfMfg ? `${machine.yearOfMfg} ` : ''}${machine.name} for sale`
                      }
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium mb-1 text-slate-900">
                      {machine.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {machine.yearOfMfg && (
                        <>Year: {machine.yearOfMfg} &nbsp;|&nbsp;</>
                      )}
                      {machine.stockNumber && (
                        <>Stock #: {machine.stockNumber}</>
                      )}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Category-Specific Buying Guidance */}
      <section className="mt-14 max-w-4xl text-slate-700 leading-relaxed space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">
          {content.buyingHeading}
        </h2>

        {content.buyingParagraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </section>

      {/* Internal Links */}
      <section className="mt-12 border-t border-slate-200 pt-8 pb-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">
          Need Help Finding the Right Machine?
        </h2>
        <p className="max-w-4xl text-slate-700 leading-relaxed">
          Browse our{' '}
          <Link
            href="/inventory"
            className="text-blue-700 hover:underline font-medium"
          >
            complete used machinery inventory
          </Link>
          {' '}or explore other equipment in{' '}
          <Link
            href={`/inventory/${category}`}
            className="text-blue-700 hover:underline font-medium"
          >
            {categoryName}
          </Link>
          . If the machine you need is not currently listed,{' '}
          <Link
            href="/contact"
            className="text-blue-700 hover:underline font-medium"
          >
            contact Concord Machine Tools
          </Link>{' '}
          to discuss sourcing opportunities. If you have equipment to sell,
          visit our{' '}
          <Link
            href="/sell"
            className="text-blue-700 hover:underline font-medium"
          >
            Sell Your Machine
          </Link>{' '}
          page.
        </p>
      </section>
    </div>
  );
}
