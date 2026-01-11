// app/sitemap-images.xml/route.ts
import { NextResponse } from 'next/server';
import { client } from '@/lib/sanityClient';

export const revalidate = 3600;

export async function GET() {
  const baseUrl = 'https://www.concordmt.com';

  const machines = await client.fetch(`
    *[_type == "machine" && defined(slug.current)]{
      "slug": slug.current,
      category->{ slug },
      subcategory->{ slug },
      images[]{ asset-> }
    }
  `);

  const imageEntries = machines
    .filter((m: any) => m.images?.length)
    .map((machine: any) => {
      const pageUrl = `${baseUrl}/inventory/${machine.category.slug.current}/${machine.subcategory.slug.current}/${machine.slug}`;
      const imageUrl = `${machine.images[0].asset.url}?w=1200`;

      return `
        <url>
          <loc>${pageUrl}</loc>
          <image:image>
            <image:loc>${imageUrl}</image:loc>
          </image:image>
        </url>
      `;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    ${imageEntries}
  </urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
