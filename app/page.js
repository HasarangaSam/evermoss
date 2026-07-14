import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import { getProducts } from "@/lib/products";
import {
  Sprout,
  Leaf,
  Gift,
  Home as HomeIcon,
  Building2,
  Coffee,
  Sparkles,
  ChevronDown,
  PhoneCall,
  Truck,
} from "lucide-react";

export default async function Home() {
  const products = await getProducts();

  const testimonials = [
    {
      text: "“Such a pretty arrangement — it made my coffee table feel instantly more special and brought a sense of peace to the room.”",
      name: "Nethmi",
      location: "Gampaha",
      image: "/testimonials/sample.jpg",
    },
    {
      text: "“Beautifully made and full of thoughtful details. It was the loveliest housewarming gift, my friends absolutely loved it.”",
      name: "Shehani",
      location: "Colombo",
      image: "/testimonials/sample1.jpg",
    },
    {
      text: "“I ordered custom arrangements for my office reception. It completely transformed the space and clients always compliment it.”",
      name: "Daham",
      location: "Kandy",
      image: "/testimonials/sample3.jpeg",
    },
    {
      text: "“The detail and craftsmanship are incredible. Highly recommend Evermoss for anyone looking to add high-quality botanical accents.”",
      name: "Hasaranga",
      location: "Negombo",
      image: "/testimonials/sample2.jpeg",
    },
  ];

  return (
    <>
      <Header />
      <main className="home-main">
        {/* Full Viewport Size Hero Image with NO content overlays */}
        <ScrollReveal className="reveal-fade-up">
          <section className="full-hero-showcase">
            <img
              src="/hero.png"
              alt="Evermoss botanical plants showcase"
              className="full-hero-bg-img"
            />

            <div className="hero-scroll-indicator">
              <span className="scroll-text">Scroll to Discover</span>
              <ChevronDown className="scroll-arrow-icon" size={24} />
            </div>
          </section>
        </ScrollReveal>

        {/* 1. Brand Intro Section */}
        <section className="intro-info-section">
          <ScrollReveal className="reveal-fade-up">
            <div className="intro-container-card">
              <div className="brand-logo-area centered">
                <Sprout size={36} className="logo-leaf-icon" />
                <h1 className="hero-brand-title">Evermoss</h1>
                <div className="heart-divider">♡</div>
              </div>

              <h2 className="hero-tagline centered">
                Natural & Handcrafted Plants
              </h2>

              <p className="hero-desc centered">
                For homes, offices, cafés & special moments. Plants that bring
                calm, warmth, and a touch of nature into your space.
              </p>

              {/* Custom Design Callout Banner */}
              <div className="custom-designs-callout centered">
                <Sparkles size={16} className="sparkle-icon" />
                <span>Custom designs available for your space ✨</span>
              </div>

              <p className="hero-quote-text centered">
                A little green, a little peace – made just for you.
              </p>
              <div className="heart-divider-small centered">♡</div>

              <div className="hero-actions-container centered">
                <Link href="/products" className="button primary-btn">
                  Explore our products
                </Link>
                <Link href="/contact" className="text-link">
                  Custom arrangement &rarr;
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* 2. How It Works Section */}
        <section className="core-highlights-section">
          <div className="highlights-grid-container">
            <ScrollReveal className="reveal-fade-up" delay={100}>
              <div className="highlight-column-card">
                <div className="highlight-number">01</div>
                <div className="highlight-icon-box">
                  <PhoneCall size={24} />
                </div>
                <h3>Place Your Order</h3>
                <p>
                  Call or WhatsApp us to place your order. Share your preferred
                  design with us.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal className="reveal-fade-up" delay={200}>
              <div className="highlight-column-card">
                <div className="highlight-number">02</div>
                <div className="highlight-icon-box">
                  <Sprout size={24} />
                </div>
                <h3>Handcrafted With Care</h3>
                <p>
                  Your arrangement is carefully handcrafted with love and ready
                  within 7 days.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal className="reveal-fade-up" delay={300}>
              <div className="highlight-column-card">
                <div className="highlight-number">03</div>
                <div className="highlight-icon-box">
                  <Truck size={24} />
                </div>
                <h3>Delivered to Your Doorstep</h3>
                <p>
                  Once ready, your arrangement is carefully delivered within 2–3
                  business days.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* 3. Brand Story Section */}
        <section className="story-redesign-section">
          <div className="story-split-grid">
            <ScrollReveal
              className="reveal-fade-up"
              className="story-image-reveal"
            >
              <div className="story-img-container">
                <img src="./brand.png" alt="Botanical details arrangement" />
              </div>
            </ScrollReveal>

            <ScrollReveal className="reveal-fade-up" delay={150}>
              <div className="story-text-container">
                <p className="eyebrow">Made for daily peace</p>
                <h2>More than just greens in a room.</h2>
                <p>
                  Evermoss crafts botanical accents and arrangements that
                  breathe life into structural spaces. Each arrangement brings
                  the soothing elements of nature inside to help you relax,
                  breathe, and grow.
                </p>
                <div className="story-badge-floating">
                  <span>Embrace nature in your daily life ♡</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* 5. Featured Products Grid */}
        <section className="collection products-section-home">
          <ScrollReveal className="reveal-fade-up">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Featured Products</p>
                <h2>Find your favourite.</h2>
              </div>
              <Link href="/products" className="text-link">
                View all products &rarr;
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid">
            {products.slice(0, 3).map((p, index) => (
              <ScrollReveal
                key={p.slug}
                className="reveal-fade-up"
                delay={index * 100}
              >
                <ProductCard p={p} />
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* 6. Quote Break */}
        <section className="quote quote-section-redesign">
          <ScrollReveal className="reveal-fade-up">
            <p>“A little green, a little peace.”</p>
            <span>— Evermoss</span>
          </ScrollReveal>
        </section>

        {/* 7. Testimonials Section */}
        <section className="testimonials testimonials-section-home">
          <ScrollReveal className="reveal-fade-up">
            <div className="testimonials-header-centered">
              <p className="eyebrow">Kind words</p>
              <h2>Loved in little corners.</h2>
              <p className="testimonial-intro">
                Every Evermoss arrangement carries a little story. Here are some
                words from our happy customers.
              </p>
            </div>
          </ScrollReveal>

          <div className="new-testimonial-grid">
            {testimonials.map((t, idx) => (
              <ScrollReveal
                key={idx}
                className="reveal-fade-up"
                delay={idx * 120}
              >
                <article className="square-testimonial-card">
                  <div className="card-top-header">
                    <div className="avatar-frame-round">
                      <img src={t.image} alt={t.name} />
                    </div>
                    <div className="avatar-meta-details">
                      <b>{t.name}</b>
                      <small>{t.location}</small>
                      <div
                        className="testimonial-stars"
                        style={{
                          color: "#8c9b3e",
                          fontSize: "11px",
                          letterSpacing: "1.5px",
                          marginTop: "2px",
                        }}
                      >
                        ★★★★★
                      </div>
                    </div>
                  </div>

                  <p className="testimonial-body-text">{t.text}</p>

                  <div className="card-bottom-heart">♡</div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>
        {/* 8. Final CTA Custom Order Section */}
        <section className="testimonials custom-section final-cta-home">
          <ScrollReveal className="reveal-fade-up">
            <p className="eyebrow">Let’s create together</p>
            <h2>Your space, your story.</h2>
            <p className="custom-copy">
              Choose a botanical design from our products list or share your own
              idea. We'll help you make it yours.
            </p>
            <Link href="/contact" className="button primary-btn">
              Request Custom Design
            </Link>
          </ScrollReveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
