import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import ScrollReveal from "@/components/ScrollReveal";
import { getProducts } from "@/lib/products";

export const metadata = {
  title: "Artificial Flower & Plant Arrangements | Evermoss Sri Lanka",

  description:
    "Explore Evermoss handcrafted artificial flower and plant arrangements in Sri Lanka. Discover elegant home decor pieces, custom designs, and thoughtful gifts made to add beauty, greenery, and warmth to any space.",

  keywords: [
    "artificial flowers Sri Lanka",
    "artificial plants Sri Lanka",
    "handcrafted flower arrangements Sri Lanka",
    "custom flower arrangements Sri Lanka",
    "home decor gifts Sri Lanka",
    "office decor Sri Lanka",
    "cafe decoration Sri Lanka",
    "Evermoss products",
  ],

  openGraph: {
    title: "Handcrafted Artificial Flower & Plant Arrangements | Evermoss",

    description:
      "Discover beautiful artificial flower arrangements, plant decor, custom designs, and thoughtful gifts handcrafted by Evermoss Sri Lanka.",

    type: "website",

    images: [
      {
        url: "/favicon.png",
        width: 1200,
        height: 630,
        alt: "Evermoss handcrafted artificial flower and plant arrangements",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Handcrafted Artificial Flower & Plant Arrangements | Evermoss",

    description:
      "Explore elegant artificial flower arrangements, custom designs, and home decor gifts from Evermoss Sri Lanka.",

    images: ["/favicon.png"],
  },
};

// Cache page data and refresh every 1 hour
export const revalidate = 3600;

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
