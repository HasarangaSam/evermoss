import test from "node:test";
import assert from "node:assert/strict";
import { normalizeProductImages } from "./productImageUtils.js";

test("normalizeProductImages preserves cloudinary public IDs for both camelCase and snake_case fields", () => {
  const normalized = normalizeProductImages([
    { url: "https://cdn.example.com/a.jpg", publicId: "img-1" },
    { url: "https://cdn.example.com/b.jpg", public_id: "img-2" },
  ]);

  assert.deepEqual(normalized, [
    {
      url: "https://cdn.example.com/a.jpg",
      publicId: "img-1",
      public_id: "img-1",
    },
    {
      url: "https://cdn.example.com/b.jpg",
      publicId: "img-2",
      public_id: "img-2",
    },
  ]);
});

test("normalizeProductImages converts legacy image URL strings to image objects", () => {
  assert.deepEqual(
    normalizeProductImages(["https://cdn.example.com/legacy.jpg"]),
    [
      {
        url: "https://cdn.example.com/legacy.jpg",
        publicId: null,
        public_id: null,
      },
    ],
  );
});
