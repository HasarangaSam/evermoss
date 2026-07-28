"use client";

import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductGallery({ images = [], name }) {
  const photos = images.map((img) => img.url).filter(Boolean);

  const [active, setActive] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const imgRef = useRef(null);
  const isControlHoveredRef = useRef(false);

  const resetZoom = useCallback(() => {
    setIsZoomed(false);
    if (imgRef.current) {
      imgRef.current.style.transform = "scale(1)";
      imgRef.current.style.transformOrigin = "center center";
    }
  }, []);

  // Reset gallery when product changes
  useEffect(() => {
    setActive(0);
    resetZoom();
  }, [images, resetZoom]);

  // Reset zoom when switching images
  useEffect(() => {
    resetZoom();
  }, [active, resetZoom]);

  if (!photos.length) return null;

  function change(step, e) {
    if (e) e.stopPropagation();
    resetZoom();
    setActive((current) => (current + step + photos.length) % photos.length);
  }

  function handleSelectThumbnail(index, e) {
    if (e) e.stopPropagation();
    resetZoom();
    setActive(index);
    isControlHoveredRef.current = true;
  }

  // Toggle zoom on click
  function handleClick(e) {
    if (isControlHoveredRef.current) return;

    if (isZoomed) {
      resetZoom();
    } else {
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      const rawX = ((e.clientX - left) / width) * 100;
      const rawY = ((e.clientY - top) / height) * 100;
      const x = Math.max(8, Math.min(92, rawX));
      const y = Math.max(8, Math.min(92, rawY));

      setIsZoomed(true);
      if (imgRef.current) {
        imgRef.current.style.transformOrigin = `${x}% ${y}%`;
        imgRef.current.style.transform = "scale(1.75)";
      }
    }
  }

  // Pan while zoomed in by moving mouse
  function handleMouseMove(e) {
    if (!isZoomed) return;
    if (isControlHoveredRef.current) return;

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const rawX = ((e.clientX - left) / width) * 100;
    const rawY = ((e.clientY - top) / height) * 100;
    const x = Math.max(8, Math.min(92, rawX));
    const y = Math.max(8, Math.min(92, rawY));

    if (imgRef.current) {
      imgRef.current.style.transformOrigin = `${x}% ${y}%`;
    }
  }

  function handleMouseLeave() {
    isControlHoveredRef.current = false;
    // Keep zoom when mouse leaves — only reset on explicit click-out
  }

  function handleControlEnter(e) {
    if (e) e.stopPropagation();
    isControlHoveredRef.current = true;
  }

  function handleControlLeave(e) {
    if (e) e.stopPropagation();
    isControlHoveredRef.current = false;
  }

  return (
    <div className="product-gallery">
      <div className="gallery-frame">
        <div
          className={`gallery-zoom-container${isZoomed ? " zoomed" : ""}`}
          onClick={handleClick}
          onMouseMove={handleMouseMove}
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
              onClick={(e) => change(-1, e)}
              onMouseEnter={handleControlEnter}
              onMouseLeave={handleControlLeave}
              aria-label="Previous photo"
            >
              <ChevronLeft />
            </button>

            <button
              className="gallery-arrow next"
              onClick={(e) => change(1, e)}
              onMouseEnter={handleControlEnter}
              onMouseLeave={handleControlLeave}
              aria-label="Next photo"
            >
              <ChevronRight />
            </button>

            <span
              className="gallery-count"
              onMouseEnter={handleControlEnter}
              onMouseLeave={handleControlLeave}
            >
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
              onClick={(e) => handleSelectThumbnail(index, e)}
              onMouseEnter={handleControlEnter}
              onMouseLeave={handleControlLeave}
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
