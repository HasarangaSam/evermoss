import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import ScrollReveal from "@/components/ScrollReveal";
import { getProducts } from "@/lib/products";

export const metadata = { title: "Products | Evermoss" };

// Cache page data and refresh every 60 seconds
export const revalidate = 60;

export default async function Products() {
  const products = await getProducts();

  return (
    <>
      <Header />

      <main className="inner">
        <ScrollReveal className="reveal-fade-up">
          <div className="page-intro">
            <p className="eyebrow">Our Products</p>

            <h1>
              Little arrangements,
              <br />
              beautifully made.
            </h1>

            <p>
              Thoughtfully handcrafted pieces to bring warmth, colour and a
              touch of nature into your home.
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
