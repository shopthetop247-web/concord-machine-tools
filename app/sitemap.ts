import { client } from '@/lib/sanityClient';

export default async function sitemap() {
  const baseUrl = 'https://www.concordmachinetools.com';

  // Fetch all published machines
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

  // Core static pages
  const staticPages = [
    '',
    '/inventory',
    '/about',
    '/sell',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  // Machine pages
  const machinePages = machines.map((machine: any) => ({
    url: `${baseUrl}/inventory/${machine.category.slug}/${machine.subcategory.slug}/${machine.slug}`,
    lastModified: new Date(machine._updatedAt),
  }));

  return [...staticPages, ...machinePages];
}
