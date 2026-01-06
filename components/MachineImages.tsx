'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import Video from 'yet-another-react-lightbox/plugins/video';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/video.css';

interface Props {
  images: string[];
  videos?: string[];
}

interface Slide {
  type: 'image' | 'video';
  src: string;
}

export default function MachineImages({ images, videos }: Props) {
  const [index, setIndex] = useState<number | null>(null);

  const slides: Slide[] = [
    ...images.map((src) => ({ type: 'image', src })),
    ...(videos?.map((url) => {
      const videoId = url.includes('youtube.com')
        ? url.split('v=')[1]?.split('&')[0]
        : url.split('/').pop();
      return {
        type: 'video',
        src: `https://www.youtube.com/embed/${videoId}`,
      };
    }) ?? []),
  ];

  return (
    <section className="mt-6">
      {/* HERO IMAGE / VIDEO */}
      <div className="max-w-2xl mb-4 border border-gray-200 rounded p-2 bg-gray-50">
        {slides[0] && slides[0].type === 'image' ? (
          <Image
            src={slides[0].src}
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
              src={slides[0].src}
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
                  src={slide.src}
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
        slides={slides.map((s) =>
          s.type === 'image'
            ? { type: 'image', src: s.src }
            : { type: 'video', src: s.src }
        )}
        index={index ?? 0}
        plugins={[Video]}
      />
    </section>
  );
}
