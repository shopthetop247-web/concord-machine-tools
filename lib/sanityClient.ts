// lib/sanityClient.ts
import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: 'iwodjd3n', // your Sanity project ID
  dataset: 'production',  // your dataset
  useCdn: false,          // set to true if you want cached data
  apiVersion: '2023-12-31', // today's date or later
});
