"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductGallery({ images = [], name }) {
  const photos = images.map((img) => img.url).filter(Boolean);

  const [active, setActive] = useState(0);
  const imgRef = useRef(null);

  // Reset gallery when product changes
  useEffect(() => {
    setActive(0);
  }, [images]);

  // Reset zoom when switching images
  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.style.transform = "scale(1)";
      imgRef.current.style.transformOrigin = "center center";
    }
  }, [active]);

  if (!photos.length) return null;

  function change(step) {
    setActive((current) => (current + step + photos.length) % photos.length);
  }

  function handleMouseMove(e) {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    if (imgRef.current) {
      imgRef.current.style.transformOrigin = `${x}% ${y}%`;
    }
  }

  function handleMouseEnter() {
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (imgRef.current) {
      imgRef.current.style.transform = "scale(2)";
    }
  }

  function handleMouseLeave() {
    if (imgRef.current) {
      imgRef.current.style.transform = "scale(1)";
      imgRef.current.style.transformOrigin = "center center";
    }
  }

  return (
    <div className="product-gallery">
      <div className="gallery-frame">
        <div
          className="gallery-zoom-container"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Image
            ref={imgRef}
            src={photos[active]}
            alt={`${name} image ${active + 1}`}
            width={1200}
            height={900}
            priority={active === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={85}
          />
        </div>

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
              <Image
                src={image}
                alt={`${name} thumbnail ${index + 1}`}
                width={220}
                height={220}
                loading="lazy"
                sizes="(max-width: 768px) 20vw, 10vw"
                quality={70}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
