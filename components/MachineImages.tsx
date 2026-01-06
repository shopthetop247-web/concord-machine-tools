'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/lib/sanityClient';

interface MachineImage {
  asset: { _ref: string };
  alt?: string;
}

interface MachineImagesProps {
  images: MachineImage[];
}

// Setup Sanity image builder
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source).auto('format').url();
}

export default function MachineImages({ images }: MachineImagesProps) {
  const [index, setIndex] = useState(-1);

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
          marginTop: '16px',
        }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            style={{
              cursor: 'pointer',
              border: '1px solid #ddd',
              borderRadius: '8px',
              overflow: 'hidden',
              padding: '4px',
              backgroundColor: '#f9f9f9',
            }}
            onClick={() => setIndex(i)}
          >
            <Image
              src={urlFor(img)}
              alt={img.alt || 'Machine image'}
              width={400}
              height={300}
              style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
            />
          </div>
        ))}
      </div>

      {index >= 0 && (
        <Lightbox
          open={index >= 0}
          index={index}
          slides={images.map((img) => ({ src: urlFor(img) }))}
          close={() => setIndex(-1)}
        />
      )}
    </>
  );
}

