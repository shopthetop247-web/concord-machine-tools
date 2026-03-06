// lib/sanityClient.ts
import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: 'iwodjd3n', // your Sanity project ID
  dataset: 'production', // your dataset
  useCdn: false,         // set to true if you want cached data
  apiVersion: '2023-12-31',
});


// RECENT MACHINES QUERY (for homepage)
export const recentMachinesQuery = `
*[_type == "machine"] | order(_createdAt desc)[0...4]{
  _id,
  title,
  slug,
  mainImage{
    asset->{
      url
    }
  }
}
`;
