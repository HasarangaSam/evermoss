import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import ScrollReveal from "@/components/ScrollReveal";
import { getProducts } from "@/lib/products";

export const metadata = {
  title: "Natural & Artificial Flower Arrangements & Gifts | Evermoss",

  description:
    "Explore Evermoss handcrafted artificial flower arrangements, elegant home decor pieces, and thoughtful gifts designed to bring timeless beauty to every space.",

  keywords: [
    "artificial flowers Sri Lanka",
    "flower arrangements Sri Lanka",
    "home decor Sri Lanka",
    "flower gifts",
    "Evermoss products",
  ],

  openGraph: {
    title: "Natural & Artificial Flower Arrangements & Gifts | Evermoss",

    description:
      "Discover beautiful handcrafted flower arrangements and decorative pieces from Evermoss.",

    type: "website",

    images: [
      {
        url: "/favicon.png",
        width: 1200,
        height: 630,
        alt: "Evermoss Flower Collection",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Natural & Artificial Flower Arrangements & Gifts | Evermoss",

    description:
      "Discover beautiful handcrafted flower arrangements and decorative pieces from Evermoss.",

    images: ["/favicon.png"],
  },
};

// Cache page data and refresh every 60 seconds
export const revalidate = 60;

export default async function Products() {
  const products = await getProducts();

  return (
    <>
      <Header />

      <main className="inner">
        <ScrollReveal className="reveal-fade-up">
          <div className="page-intro products-page-intro">
            <p className="eyebrow">Our Products</p>

            <h1>
              Little arrangements,
              <br />
              beautifully made.
            </h1>

            <p>
              Thoughtfully handcrafted pieces to bring timeless beauty, warmth,
              colour and a touch of nature into your home.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal className="reveal-fade-up" delay={150}>
          <ProductGrid products={products} />
        </ScrollReveal>
      </main>

      <Footer />
    </>
  );
}
