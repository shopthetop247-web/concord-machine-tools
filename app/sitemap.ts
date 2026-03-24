// app/sitemap.ts
import { client } from '@/lib/sanityClient';

export default async function sitemap() {
const baseUrl = 'https://www.concordmt.com';

/* ----------------------------
FETCH DATA FROM SANITY
---------------------------- */

const machines = await client.fetch(' *[_type == "machine" && defined(slug.current) && defined(category->slug.current) && defined(subcategory->slug.current) ]{ "slug": slug.current, _updatedAt, category->{ "slug": slug.current }, subcategory->{ "slug": slug.current } } ');

const categories = await client.fetch(' *[_type == "category" && defined(slug.current)]{ "slug": slug.current, _updatedAt } ');

const subcategories = await client.fetch(' *[_type == "subcategory" && defined(slug.current) && defined(category->slug.current) ]{ "slug": slug.current, _updatedAt, category->{ "slug": slug.current } } ');

const brands = await client.fetch(' *[_type == "brand" && defined(slug.current)]{ "slug": slug.current, _updatedAt } ');

/* ----------------------------
STATIC PAGES
---------------------------- */

const staticPages = [
{
url: '${baseUrl}',
lastModified: new Date().toISOString(),
changefreq: 'daily',
priority: 1.0,
},
{
url: '${baseUrl}/inventory',
lastModified: new Date().toISOString(),
changefreq: 'daily',
priority: 0.95,
},
{
url: '${baseUrl}/brands',
lastModified: new Date().toISOString(),
changefreq: 'weekly',
priority: 0.8,
},
{
url: '${baseUrl}/about',
lastModified: new Date().toISOString(),
changefreq: 'yearly',
priority: 0.3,
},
{
url: '${baseUrl}/sell',
lastModified: new Date().toISOString(),
changefreq: 'yearly',
priority: 0.4,
},
{
url: '${baseUrl}/contact',
lastModified: new Date().toISOString(),
changefreq: 'yearly',
priority: 0.3,
},
];

/* ----------------------------
CATEGORY PAGES
---------------------------- */

const categoryPages = categories.map((cat: any) => ({
url: '${baseUrl}/inventory/${cat.slug}',
lastModified: new Date(cat._updatedAt).toISOString(),
changefreq: 'daily',
priority: 0.85,
}));

/* ----------------------------
SUBCATEGORY PAGES
---------------------------- */

const subcategoryPages = subcategories.map((sub: any) => ({
url: '${baseUrl}/inventory/${sub.category.slug}/${sub.slug}',
lastModified: new Date(sub._updatedAt).toISOString(),
changefreq: 'daily',
priority: 0.85,
}));

/* ----------------------------
BRAND PAGES
---------------------------- */

const brandPages = brands.map((brand: any) => ({
url: '${baseUrl}/brands/${brand.slug}',
lastModified: new Date(brand._updatedAt).toISOString(),
changefreq: 'weekly',
priority: 0.75,
}));

/* ----------------------------
MACHINE PAGES (MOST IMPORTANT)
---------------------------- */

const machinePages = machines.map((machine: any) => ({
url: '${baseUrl}/inventory/${machine.category.slug}/${machine.subcategory.slug}/${machine.slug}',
lastModified: new Date(machine._updatedAt).toISOString(),
changefreq: 'daily', // 🔥 key upgrade
priority: 0.9, // 🔥 higher priority for inventory
}));

return [
...staticPages,
...categoryPages,
...subcategoryPages,
...brandPages,
...machinePages,
];
}
