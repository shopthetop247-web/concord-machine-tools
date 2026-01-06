'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface SanityImage {
  asset: {
    _ref: string;
  };
}

interface Props {
  images: string[];
}

export default function MachineImages({ images }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [open, setOpen] = useState(false);

  if (!images || images.length === 0) return null;

  return (
    <section style={{ marginTop: '24px' }}>
      {/* HERO IMAGE */}
      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '8px',
          marginBottom: '12px',
          cursor: 'pointer',
        }}
        onClick={() => setOpen(true)}
      >
        <Image
          src={images[selectedIndex]}
          alt="Machine image"
          width={900}
          height={600}
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
          }}
          priority
        />
      </div>

      {/* THUMBNAILS */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            style={{
              border:
                index === selectedIndex
                  ? '2px solid #2563eb'
                  : '1px solid #e5e7eb',
              borderRadius: '6px',
              padding: '2px',
              background: 'white',
              cursor: 'pointer',
            }}
          >
            <Image
              src={img}
              alt={`Thumbnail ${index + 1}`}
              width={120}
              height={90}
              style={{
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </button>
        ))}
      </div>

      {/* LIGHTBOX */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={images.map((src) => ({ src }))}
        index={selectedIndex}
      />
    </section>
  );
}

