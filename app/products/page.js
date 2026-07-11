import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/products";
export const metadata = { title: "Collection | Evermoss" };
export default async function Products() {
  const products = await getProducts();
  return (
    <>
      <Header />
      <main className="inner">
        <div className="page-intro">
          <p className="eyebrow">The Evermoss collection</p>
          <h1>
            Little arrangements,
            <br />
            beautifully made.
          </h1>
          <p>
            Thoughtfully handcrafted pieces to bring warmth, colour and a touch
            of nature into your home.
          </p>
        </div>
        <ProductGrid products={products} />
      </main>
      <Footer />
    </>
  );
}
