export function normalizeProductImages(images = []) {
  return (images || []).map((img) => {
    // Older products stored image URLs as strings. Convert them to the same
    // shape used by current products so Next/Image can render them everywhere.
    if (typeof img === "string") {
      return {
        url: img,
        publicId: null,
        public_id: null,
      };
    }

    if (!img || typeof img !== "object") {
      return null;
    }

    const normalized = {
      ...img,
      url: img.url,
      publicId: img.publicId ?? img.public_id ?? null,
      public_id: img.public_id ?? img.publicId ?? null,
    };

    return normalized;
  });
}
