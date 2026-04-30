// app/sitemap.ts
export const dynamic = 'force-dynamic';
import { client } from '@/lib/sanityClient';

export default async function sitemap() {
const baseUrl = 'https://www.concordmt.com';

const machines = await client.fetch(`     *[_type == "machine" &&
      defined(slug.current) &&
      defined(category->slug.current) &&
      defined(subcategory->slug.current)
    ]{
      "slug": slug.current,       _updatedAt,
      category->{ "slug": slug.current },
      subcategory->{ "slug": slug.current }
    }
  `);

const categories = await client.fetch(`     *[_type == "category" && defined(slug.current)]{
      "slug": slug.current,       _updatedAt
    }
  `);

const subcategories = await client.fetch(`     *[_type == "subcategory" &&
      defined(slug.current) &&
      defined(category->slug.current)
    ]{
      "slug": slug.current,       _updatedAt,
      category->{ "slug": slug.current }
    }
  `);

const brands = await client.fetch(`     *[_type == "brand" && defined(slug.current)]{
      "slug": slug.current,       _updatedAt
    }
  `);

/* ----------------------------
STATIC PAGES
---------------------------- */

const staticPages = [
{
url: baseUrl,
lastModified: new Date().toISOString(),
},
{
url: baseUrl + '/inventory',
lastModified: new Date().toISOString(),
},
{
url: baseUrl + '/brands',
lastModified: new Date().toISOString(),
},
{
url: baseUrl + '/about',
lastModified: new Date().toISOString(),
},
{
url: baseUrl + '/sell',
lastModified: new Date().toISOString(),
},
{
url: baseUrl + '/contact',
lastModified: new Date().toISOString(),
},
];

/* ----------------------------
CATEGORY PAGES
---------------------------- */

const categoryPages = categories.map((cat: any) => ({
url: baseUrl + '/inventory/' + cat.slug,
lastModified: new Date(cat._updatedAt).toISOString(),
}));

/* ----------------------------
SUBCATEGORY PAGES
---------------------------- */

const subcategoryPages = subcategories.map((sub: any) => ({
url: baseUrl + '/inventory/' + sub.category.slug + '/' + sub.slug,
lastModified: new Date(sub._updatedAt).toISOString(),
}));

/* ----------------------------
BRAND PAGES
---------------------------- */

const brandPages = brands.map((brand: any) => ({
url: baseUrl + '/brands/' + brand.slug,
lastModified: new Date(brand._updatedAt).toISOString(),
}));

/* ----------------------------
MACHINE PAGES
---------------------------- */

const machinePages = machines.map((machine: any) => ({
url:
baseUrl +
'/inventory/' +
machine.category.slug +
'/' +
machine.subcategory.slug +
'/' +
machine.slug,
lastModified: new Date(machine._updatedAt).toISOString(),
}));

return [
...staticPages,
...categoryPages,
...subcategoryPages,
...brandPages,
...machinePages,
];
}
