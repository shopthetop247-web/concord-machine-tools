import { client } from '@/lib/sanityClient';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.concordmt.com';

  /* ------------------------------------
     FETCH DATA FROM SANITY
  ------------------------------------ */

  // Categories
  const categories = await client.fetch(`
    *[_type == "category" && defined(slug.current)]{
      "slug": slug.current,
      _updatedAt
    }
  `);

  // Subcategories (with parent category)
  const subcategories = await client.fetch(`
    *[_type == "subcategory" && defined(slug.current)]{
      "slug": slug.current,
      category->{
        "slug": slug.current
      },
      _updatedAt
    }
  `);

  // Brands
  const brands = await client.fetch(`
    *[_type == "brand" && defined(slug.current)]{
      "slug": slug.current,
      _updatedAt
    }
  `);

  // Machines
  const machines = await client.fetch(`
    *[_type == "machine" && defined(slug.current)]{
      "slug": slug.current,
      category->{
        "slug": slug.current
      },
      subcategory->{
        "slug": slug.current
      },
      _updatedAt
    }
  `);

  /* ------------------------------------
     STATIC CORE PAGES
  ------------------------------------ */
  const staticPages: MetadataRoute.Sitemap = [
    '',
    '/inventory',
    '/brands',
    '/about',
    '/sell',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  /* ------------------------------------
     CATEGORY PAGES
  ------------------------------------ */
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat: any) => ({
    url: `${baseUrl}/inventory/${cat.slug}`,
    lastModified: new Date(cat._updatedAt),
  }));

  /* ------------------------------------
     SUBCATEGORY PAGES
  ------------------------------------ */
  const subcategoryPages: MetadataRoute.Sitemap = subcategories
    .filter((sub: any) => sub.category?.slug)
    .map((sub: any) => ({
      url: `${baseUrl}/inventory/${sub.category.slug}/${sub.slug}`,
      lastModified: new Date(sub._updatedAt),
    }));

  /* ------------------------------------
     BRAND LANDING PAGES
  ------------------------------------ */
  const brandPages: MetadataRoute.Sitemap = brands.map((brand: any) => ({
    url: `${baseUrl}/brands/${brand.slug}`,
    lastModified: new Date(brand._updatedAt),
  }));

  /* ------------------------------------
     MACHINE DETAIL PAGES
  ------------------------------------ */
  const machinePages: MetadataRoute.Sitemap = machines
    .filter(
      (machine: any) =>
        machine.category?.slug && machine.subcategory?.slug
    )
    .map((machine: any) => ({
      url: `${baseUrl}/inventory/${machine.category.slug}/${machine.subcategory.slug}/${machine.slug}`,
      lastModified: new Date(machine._updatedAt),
    }));

  /* ------------------------------------
     RETURN FULL SITEMAP
  ------------------------------------ */
  return [
    ...staticPages,
    ...categoryPages,
    ...subcategoryPages,
    ...brandPages,
    ...machinePages,
  ];
}
