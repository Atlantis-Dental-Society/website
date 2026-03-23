"use client";

import { useState } from "react";
import Image from "next/image";

interface PhotoGalleryProps {
  photos: { id: string; url: string }[];
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selected, setSelected] = useState<number | null>(null);

  if (photos.length === 0) return null;

  return (
    <>
      {/* Thumbnail grid */}
      <div className={`grid gap-2 ${photos.length === 1 ? "grid-cols-1" : photos.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
        {photos.map((photo, idx) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setSelected(idx)}
            className="relative aspect-[4/3] overflow-hidden rounded-xl cursor-pointer group"
          >
            <Image
              src={photo.url}
              alt=""
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selected !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <button
            type="button"
            className="absolute top-6 right-6 text-white/80 hover:text-white text-3xl font-light z-10"
            onClick={() => setSelected(null)}
          >
            &times;
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl font-light z-10 px-3"
                onClick={(e) => { e.stopPropagation(); setSelected((selected - 1 + photos.length) % photos.length); }}
              >
                &#8249;
              </button>
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl font-light z-10 px-3"
                onClick={(e) => { e.stopPropagation(); setSelected((selected + 1) % photos.length); }}
              >
                &#8250;
              </button>
            </>
          )}

          <div className="relative max-w-4xl max-h-[85vh] w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <Image
              src={photos[selected].url}
              alt=""
              width={1200}
              height={800}
              className="object-contain w-full h-full max-h-[85vh] rounded-lg"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {selected + 1} / {photos.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
