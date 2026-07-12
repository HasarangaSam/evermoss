"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductGallery({ images = [], name }) {
  const photos = images.map((img) => img.url).filter(Boolean);

  const [active, setActive] = useState(0);

  // Reset gallery when product changes
  useEffect(() => {
    setActive(0);
  }, [images]);

  if (!photos.length) return null;

  function change(step) {
    setActive((current) => (current + step + photos.length) % photos.length);
  }

  return (
    <div className="product-gallery">
      <div className="gallery-frame">
        <img
          src={photos[active]}
          alt={`${name} image ${active + 1}`}
          loading="eager"
        />

        {photos.length > 1 && (
          <>
            <button
              className="gallery-arrow previous"
              onClick={() => change(-1)}
              aria-label="Previous photo"
            >
              <ChevronLeft />
            </button>

            <button
              className="gallery-arrow next"
              onClick={() => change(1)}
              aria-label="Next photo"
            >
              <ChevronRight />
            </button>

            <span className="gallery-count">
              {active + 1} / {photos.length}
            </span>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div className="gallery-thumbs">
          {photos.map((image, index) => (
            <button
              key={image}
              className={index === active ? "active" : ""}
              onClick={() => setActive(index)}
              aria-label={`View photo ${index + 1}`}
            >
              <img
                src={image}
                alt={`${name} thumbnail ${index + 1}`}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
