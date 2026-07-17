import Link from "next/link";
import { notFound } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialButtons from "@/components/SocialButtons";
import ProductGallery from "@/components/ProductGallery";
import ScrollReveal from "@/components/ScrollReveal";
import ScrollToTop from "@/components/ScrollToTop";
import { getProduct, getProducts } from "@/lib/products";

// Revalidate product pages every 5 minutes
export const revalidate = 300;

// Generate product pages during build
export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({
    slug: product.slug,
  }));
}

// ===============================
// SEO METADATA FOR EACH PRODUCT
// ===============================

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found | Evermoss",
    };
  }

  const image = product.images?.[0]?.url || product.image || "";

  return {
    title: `${product.name} | Evermoss`,

    description: product.description,

    openGraph: {
      title: `${product.name} | Evermoss`,

      description: product.description,

      type: "website",

      images: image
        ? [
            {
              url: image,
              width: 800,
              height: 800,
              alt: product.name,
            },
          ]
        : [],
    },

    twitter: {
      card: "summary_large_image",

      title: `${product.name} | Evermoss`,

      description: product.description,

      images: image ? [image] : [],
    },
  };
}

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
        <ScrollReveal className="reveal-fade-up">
          <Link href="/products" className="back">
            ← Back to products
          </Link>
        </ScrollReveal>

        <section className="detail">
          <ScrollReveal className="reveal-fade-up">
            <ProductGallery images={productImages} name={p.name} />
          </ScrollReveal>

          <ScrollReveal className="reveal-fade-up" delay={150}>
            <div className="detail-copy">
              <p className="eyebrow">{p.category}</p>

              {p.code && <span className="product-code">{p.code}</span>}

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
          </ScrollReveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
