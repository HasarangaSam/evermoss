import Link from "next/link";
import { notFound } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialButtons from "@/components/SocialButtons";
import ProductGallery from "@/components/ProductGallery";
import ScrollToTop from "@/components/ScrollToTop";
import { getProduct } from "@/lib/products";

export default async function Detail({ params }) {
  const { slug } = await params;

  const p = await getProduct(slug);

  if (!p) {
    return notFound();
  }

  // Support new images array + old image field

  const productImages =
    p.images && p.images.length > 0
      ? p.images
      : p.image
        ? [
            {
              url: p.image,
            },
          ]
        : [];

  return (
    <>
      <ScrollToTop />
      <Header />

      <main className="inner">
        <Link href="/products" className="back">
          ← Back to products
        </Link>

        <section className="detail">
          <ProductGallery images={productImages} name={p.name} />

          <div className="detail-copy">
            <p className="eyebrow">{p.code}</p>

            <h1>{p.name}</h1>

            <h3>Rs. {Number(p.price).toLocaleString()}</h3>

            <p className="product-description">{p.description}</p>

            <div className="care">
              <h4>Arrangement details</h4>

              <p>✦ Handcrafted with care</p>

              {p.customDesign && <p>✦ Custom design available</p>}
            </div>

            <a
              href={`https://wa.me/94711056002?text=${encodeURIComponent(
                `Hi Evermoss, I would like to place an order for ${p.code} | ${p.name}.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="button"
            >
              Order via WhatsApp
            </a>

            <Link href="/products" className="back-light">
              ← Back to products
            </Link>

            <SocialButtons compact />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
