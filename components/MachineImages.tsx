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

  // ✅ Lightbox expects ONLY image slides
  const slides = images.map((src) => ({ src }));

  return (
    <section className="mt-6">
      {/* HERO IMAGE */}
      <div className="max-w-[700px] mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
        <Image
          src={images[0]}
          alt="Machine image"
          width={700}
          height={450}
          className="w-full h-auto object-contain cursor-pointer"
          onClick={() => setIndex(0)}
        />
      </div>

      {/* THUMBNAILS */}
      {images.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {images.map((src, i) => (
            <Image
              key={i}
              src={src}
              alt={`Thumbnail ${i + 1}`}
              width={120}
              height={90}
              className="object-contain border border-gray-300 rounded-md cursor-pointer p-1 bg-white"
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
        slides={slides}
      />
    </section>
  );
}
