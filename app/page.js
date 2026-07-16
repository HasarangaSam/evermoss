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
  Sparkles,
  ChevronDown,
  PhoneCall,
  Truck,
} from "lucide-react";

import Image from "next/image";
import ScrollToTop from "@/components/ScrollToTop";

export default async function Home() {
  const products = await getProducts();

  const testimonials = [
    {
      text: "“Such a pretty arrangement, it made my coffee table feel instantly more special and brought a sense of peace to the room.”",
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
      <ScrollToTop />
      <Header />
      <main className="home-main">
        {/* Full Viewport Size Hero Image with NO content overlays */}
        <ScrollReveal className="reveal-fade-up">
          <section className="full-hero-showcase">
            <Image
              src="/78a0917d-fde1-4784-8849-ecef9860ad3a.png"
              alt="Evermoss botanical plants showcase"
              fill
              priority
              sizes="100vw"
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
                Handcrafted Artificial Flower & Plant Arrangements
              </h2>

              <p className="hero-desc centered">
                Beautifully handcrafted arrangements designed to bring warmth,
                greenery, and timeless elegance to your home, workspace, café,
                or special moments.
              </p>

              {/* Custom Design Callout Banner */}
              <div className="custom-designs-callout centered">
                <Sparkles size={16} className="sparkle-icon" />
                <span>
                  Custom arrangements available to match your space ✨
                </span>
              </div>

              <p className="hero-quote-text centered">
                A little greenery, a little calm — handcrafted just for you.
              </p>
              <div className="heart-divider-small centered">♡</div>

              <div className="hero-actions-container centered">
                <Link href="/products" className="button primary-btn">
                  Explore our products
                </Link>
                <a
                  href="https://wa.me/94711056002?text=Hi%20Evermoss!%20I'm%20interested%20in%20a%20custom%20arrangement."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link"
                >
                  Custom arrangement &rarr;
                </a>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* 2. How It Works Section */}
        <section className="core-highlights-section">
          <div className="highlights-section-heading">
            <h2>How Evermoss Works</h2>
            <p>
              From your order to your doorstep, every arrangement is
              thoughtfully handcrafted with care.
            </p>
          </div>

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

        {/* 3. Why Choose Evermoss Section */}
        <section className="why-choose-section">
          <ScrollReveal className="reveal-fade-up">
            <div className="why-header">
              <p className="eyebrow">Why Evermoss</p>
              <h2>Designed with nature, made with care.</h2>
              <p>
                Every arrangement is thoughtfully created to bring warmth,
                beauty, and a peaceful touch of nature into your everyday
                spaces.
              </p>
            </div>
          </ScrollReveal>

          <div className="why-grid">
            <ScrollReveal className="reveal-fade-up" delay={100}>
              <div className="why-card">
                <div className="why-icon">
                  <Sprout size={26} />
                </div>
                <h3>Handcrafted With Love</h3>
                <p>
                  Every arrangement is carefully handmade with attention to
                  small details.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal className="reveal-fade-up" delay={200}>
              <div className="why-card">
                <div className="why-icon">
                  <Gift size={26} />
                </div>
                <h3>Perfect For Every Moment</h3>
                <p>
                  Beautiful gifts for birthdays, housewarmings, celebrations, or
                  simply making someone smile.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal className="reveal-fade-up" delay={300}>
              <div className="why-card">
                <div className="why-icon">
                  <HomeIcon size={26} />
                </div>
                <h3>Beautiful In Any Space</h3>
                <p>
                  Designed for homes, offices, cafés, reception areas, and
                  modern interiors.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal className="reveal-fade-up" delay={400}>
              <div className="why-card">
                <div className="why-icon">
                  <Truck size={26} />
                </div>
                <h3>Careful & Safe Delivery</h3>
                <p>
                  Safely packaged and delivered with care. Cash on Delivery is
                  available for your convenience.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* 4. Brand Story Section */}
        <section className="story-redesign-section">
          <div className="story-split-grid">
            <ScrollReveal className="reveal-fade-up">
              <div className="story-img-container">
                <img src="./brand.png" alt="Botanical details arrangement" />
              </div>
            </ScrollReveal>

            <ScrollReveal className="reveal-fade-up" delay={150}>
              <div className="story-text-container">
                <p className="eyebrow">Made for daily peace</p>
                <h2>More than just greens in a room.</h2>
                <p>
                  Evermoss creates handcrafted artificial flower and plant
                  arrangements that add a natural touch to your favourite
                  spaces. From cosy homes to professional workspaces, each
                  design is made to bring beauty, warmth, and a calming
                  atmosphere.
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
                <h2>Explore Our Collection</h2>
              </div>
              <Link href="/products" className="text-link">
                View all products &rarr;
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid featured-products-grid">
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
                      <Image
                        src={t.image}
                        alt={t.name}
                        width={80}
                        height={80}
                        loading="lazy"
                      />
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
              Explore our handcrafted arrangements or create a custom design
              that matches your space and style.
            </p>
            <Link href="/contact" className="button primary-btn">
              Get in Touch
            </Link>
          </ScrollReveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
