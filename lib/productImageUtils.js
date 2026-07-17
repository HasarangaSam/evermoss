export function normalizeProductImages(images = []) {
  return (images || []).map((img) => {
    if (!img || typeof img !== "object") {
      return img;
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
