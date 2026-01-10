import { client } from '@/lib/sanityClient';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source).auto('format').url();

export default async function sitemapImages() {
  const baseUrl = 'https://www.concordmt.com';

  // Fetch all machines with primary image
  const machines = await client.fetch(`
    *[_type == "machine" && defined(slug.current)]{
      name,
      slug { current },
      category->{ slug },
      subcategory->{ slug },
      images[0]{ asset-> { url }, alt }
    }
  `);

  // Build XML for image sitemap
  const xmlEntries = machines
    .filter((m: any) => m.images && m.images.length > 0 && m.images[0].asset?.url)
    .map((m: any) => {
      const machineUrl = `${baseUrl}/inventory/${m.category.slug.current}/${m.subcategory.slug.current}/${m.slug.current}`;
      const imageUrl = urlFor(m.images[0].asset);
      const altText = m.images[0].alt || m.name || 'Machine Image';

      return `
        <url>
          <loc>${machineUrl}</loc>
          <image:image>
            <image:loc>${imageUrl}</image:loc>
            <image:caption>${altText}</image:caption>
            <image:title>${altText}</image:title>
          </image:image>
        </url>
      `;
    })
    .join('');

  // Wrap entries in urlset
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    ${xmlEntries}
  </urlset>`;

  return xml;
}
