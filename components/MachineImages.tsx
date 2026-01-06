'use client';

import Image from 'next/image';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/lib/sanityClient';

interface ImageAsset {
  asset: { _ref: string };
}

interface MachineImagesProps {
  images: ImageAsset[];
  alt: string;
}

// Sanity image builder
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source).auto('format').url();
}

export default function MachineImages({ images, alt }: MachineImagesProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px',
          marginTop: '2rem',
        }}
      >
        {images.map((img, index) => (
          <div
            key={index}
            style={{ cursor: 'pointer', overflow: 'hidden', borderRadius: '8px', border: '1px solid #ddd' }}
            onClick={() => setLightboxIndex(index)}
          >
            <Image
              src={urlFor(img)}
              alt={alt}
              width={400}
              height={300}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          slides={images.map((img) => ({ src: urlFor(img) }))}
          open={lightboxIndex !== null}
          index={lightboxIndex}
          close={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
