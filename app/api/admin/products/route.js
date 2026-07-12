import { db } from '@/lib/db';
import { authorized } from '@/lib/auth';

export async function POST(req) {
  try {
    if (!(await authorized(req))) {
      return Response.json({ error: 'Unauthorized. Please login again.' }, { status: 401 });
    }

    const p = await req.json();
    
    // Support both images array and backward-compatible single image field
    let images = [];
    if (Array.isArray(p.images)) {
      images = p.images.map(img => typeof img === 'string' ? img.trim() : '').filter(Boolean);
    } else if (typeof p.image === 'string' && p.image.trim()) {
      images = [p.image.trim()];
    }

    if (!p.code?.trim() || !p.name?.trim() || !p.description?.trim() || !Number(p.price) || images.length === 0) {
      return Response.json({ error: 'Complete all required fields and upload at least one image' }, { status: 400 });
    }

    // Verify format: data URL or external URL (HTTP/HTTPS)
    for (const img of images) {
      if (!img.startsWith('data:image/') && !img.startsWith('http://') && !img.startsWith('https://')) {
        return Response.json({ error: 'Invalid image format. Must be a base64 data URL or external HTTP/HTTPS URL' }, { status: 400 });
      }
    }

    const product = {
      code: p.code.trim(),
      name: p.name.trim(),
      slug: (p.slug || p.name).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      description: p.description.trim(),
      customDesign: Boolean(p.customDesign),
      price: Number(p.price),
      image: images[0] || '', // Backwards compatibility for single image field
      images: images.slice(0, 4), // Store up to 4 images
      updatedAt: new Date()
    };

    await (await db()).collection('products').updateOne(
      { slug: product.slug },
      { $set: product, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );

    return Response.json({ ok: true });
  } catch (error) {
    console.error('Failed to save product:', error);
    return Response.json({ error: 'Database or server error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    if (!(await authorized(req))) {
      return Response.json({ error: 'Unauthorized. Please login again.' }, { status: 401 });
    }

    const { slug } = await req.json();
    await (await db()).collection('products').deleteOne({ slug });
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return Response.json({ error: 'Database or server error' }, { status: 500 });
  }
}
