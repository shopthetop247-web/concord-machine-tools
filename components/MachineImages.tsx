'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface Props {
  images: string[];
}

export default function MachineImages({ images }: Props) {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <section style={{ marginTop: '24px' }}>
      {/* HERO IMAGE */}
      <div
        style={{
          maxWidth: '700px',
          marginBottom: '16px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '12px',
          background: '#fafafa',
        }}
      >
        <Image
          src={images[0]}
          alt="Machine image"
          width={700}
          height={450}
          style={{
            objectFit: 'contain',
            width: '100%',
            height: 'auto',
            cursor: 'pointer',
          }}
          onClick={() => setIndex(0)}
        />
      </div>

      {/* THUMBNAILS */}
      {images.length > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          {images.map((src, i) => (
            <Image
              key={i}
              src={src}
              alt={`Thumbnail ${i + 1}`}
              width={120}
              height={90}
              style={{
                objectFit: 'contain',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                padding: '4px',
                background: '#fff',
              }}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}

      {/* LIGHTBOX */}
      <Lightbox
        open={index !== null}
        close={() => setIndex(null)}
        index={index ?? 0}
        slides={images.map((src) => ({ src }))}
      />
    </section>
  );
}


