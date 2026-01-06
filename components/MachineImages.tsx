'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface GalleryItem {
  type: 'image' | 'video';
  src: string; // image URL or YouTube ID
}

interface Props {
  items: GalleryItem[];
}

export default function MachineImages({ items }: Props) {
  const [index, setIndex] = useState<number | null>(null);

  if (!items.length) return null;

  const hero = items[0];

  return (
    <section className="mt-6">
      {/* HERO */}
      <div className="max-w-[700px] mb-4 border border-gray-200 rounded-lg p-3 bg-gray-50">
        {hero.type === 'image' ? (
          <Image
            src={hero.src}
            alt="Machine image"
            width={700}
            height={450}
            className="w-full h-auto object-contain cursor-pointer"
            onClick={() => setIndex(0)}
          />
        ) : (
          <div
            className="relative w-full aspect-video cursor-pointer"
            onClick={() => setIndex(0)}
          >
            <Image
              src={`https://img.youtube.com/vi/${hero.src}/hqdefault.jpg`}
              alt="Machine video"
              fill
              className="object-cover rounded-md"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/60 rounded-full p-4">
                ▶
              </div>
            </div>
          </div>
        )}
      </div>

      {/* THUMBNAILS */}
      {items.length > 1 && (
        <div className="flex gap-3 flex-wrap">
          {items.map((item, i) => (
            <div
              key={i}
              className="relative cursor-pointer border border-gray-300 rounded-md p-1 bg-white"
              onClick={() => setIndex(i)}
            >
              {item.type === 'image' ? (
                <Image
                  src={item.src}
                  alt={`Thumbnail ${i + 1}`}
                  width={120}
                  height={90}
                  className="object-contain"
                />
              ) : (
                <>
                  <Image
                    src={`https://img.youtube.com/vi/${item.src}/hqdefault.jpg`}
                    alt="Video thumbnail"
                    width={120}
                    height={90}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/60 rounded-full px-2 py-1 text-white text-sm">
                      ▶
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* LIGHTBOX */}
      <Lightbox
        open={index !== null}
        close={() => setIndex(null)}
        index={index ?? 0}
        slides={items.map((item) =>
          item.type === 'image'
            ? { src: item.src }
            : {
                type: 'iframe',
                src: `https://www.youtube.com/embed/${item.src}?autoplay=1`,
              }
        )}
      />
    </section>
  );
}
