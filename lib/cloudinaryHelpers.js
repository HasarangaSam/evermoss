import cloudinary from "./cloudinary.js";

// Upload Buffer to Cloudinary
export function uploadImage(buffer, folder = "evermoss/products") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [
          {
            width: 1200,
            height: 1200,
            crop: "limit",
          },
          {
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id, // <-- fixed
          });
        }
      },
    );

    stream.end(buffer);
  });
}

// Delete image from Cloudinary
export async function deleteImage(publicId) {
  if (!publicId) return;

  return cloudinary.uploader.destroy(publicId);
}
