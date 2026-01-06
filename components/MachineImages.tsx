'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox, { Slide } from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface Props {
  images: string[];
  videos?: string[];
}

export default function MachineImages({ images, videos }: Props) {
  const [index, setIndex] = useState<number | null>(null);
  const [slides, setSlides] = useState<Slide[]>(() => {
    const imageSlides = images.map((src) => ({ type: 'image' as const, src }));
    const videoSlides = videos?.map((url) => {
      const videoId = url.includes('youtube.com')
        ? url.split('v=')[1]?.split('&')[0]
        : url.split('/').pop();
      return {
        type: 'video' as const,
        src: `https://www.youtube.com/embed/${videoId}`,
      };
    }) ?? [];
    return [...imageSlides, ...videoSlides];
  });

  return (
    <section className="mt-6">
      {/* HERO IMAGE */}
      <div className="max-w-2xl mb-4 border border-gray-200 rounded p-2 bg-gray-50">
        {slides[0] && slides[0].type === 'image' ? (
          <Image
            src={slides[0].src as string}
            alt="Machine image"
            width={700}
            height={450}
            className="object-contain w-full h-auto cursor-pointer rounded"
            onClick={() => setIndex(0)}
          />
        ) : (
          <div
            className="w-full aspect-video bg-black flex items-center justify-center cursor-pointer rounded"
            onClick={() => setIndex(0)}
          >
            <iframe
              src={slides[0].src as string}
              title="Machine Video"
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        )}
      </div>

      {/* THUMBNAILS */}
      {slides.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {slides.map((slide, i) => (
            <div
              key={i}
              className="border border-gray-300 rounded p-1 cursor-pointer bg-white"
              onClick={() => setIndex(i)}
            >
              {slide.type === 'image' ? (
                <Image
                  src={slide.src as string}
                  alt={`Thumbnail ${i + 1}`}
                  width={120}
                  height={90}
                  className="object-contain w-24 h-20"
                />
              ) : (
                <div className="w-24 h-20 bg-black flex items-center justify-center text-white text-xs">
                  Video
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* LIGHTBOX */}
      <Lightbox
        open={index !== null}
        close={() => setIndex(null)}
        slides={slides}
        index={index ?? 0}
      />
    </section>
  );
}
