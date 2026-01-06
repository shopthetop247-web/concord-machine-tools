'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface MachineImagesProps {
  images: string[];
  alt: string;
}

export default function MachineImages({ images, alt }: MachineImagesProps) {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <>
      {/* Image Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '16px',
          marginTop: '24px',
        }}
      >
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            style={{
              border: 'none',
              background: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            <Image
              src={src}
              alt={alt}
              width={400}
              height={300}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
                objectFit: 'contain',
                background: '#f5f5f5',
              }}
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {index !== null && (
        <Lightbox
          open
          index={index}
          close={() => setIndex(null)}
          slides={images.map((src) => ({ src }))}
        />
      )}
    </>
  );
}
