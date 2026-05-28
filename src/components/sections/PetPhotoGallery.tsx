"use client";

import Image from "next/image";
import { useState } from "react";
import PhotoCarousel, {
  type CarouselPhoto,
} from "@/components/ui/PhotoCarousel";
import { cn } from "@/utils";

interface PetPhotoGalleryProps {
  photos: CarouselPhoto[];
  alt: string;
}

const PetPhotoGallery: React.FC<PetPhotoGalleryProps> = ({ photos, alt }) => {
  const [index, setIndex] = useState(0);

  if (photos.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-gray-100 shadow-lg ring-1 ring-gray-200/70">
        <PhotoCarousel
          photos={photos}
          alt={alt}
          autoplayMs={5000}
          activeIndex={index}
          onActiveIndexChange={setIndex}
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          showDots
        />
      </div>

      {photos.length > 1 && (
        <ul className="grid grid-cols-5 gap-2">
          {photos.map((photo, i) => (
            <li key={photo.id ?? photo.url}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "relative block aspect-square w-full overflow-hidden rounded-xl bg-gray-100 transition-all",
                  i === index
                    ? "ring-2 ring-pink-500 ring-offset-2"
                    : "ring-1 ring-gray-200 hover:ring-pink-300",
                )}
              >
                <Image
                  src={photo.url}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 10vw, 20vw"
                  className={cn(
                    "object-cover transition-opacity",
                    i === index ? "opacity-100" : "opacity-80 hover:opacity-100",
                  )}
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PetPhotoGallery;
