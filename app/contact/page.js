import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import SocialButtons from "@/components/SocialButtons";
import ScrollReveal from "@/components/ScrollReveal";
import { MessageSquare, Mail, MapPin } from "lucide-react";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata = {
  title: "Contact | Evermoss",
};

export default function Contact() {
  const faqs = [
    {
      q: "Can I request a custom floral arrangement design?",
      a: "Yes, absolutely! We specialize in custom-made arrangements tailored to your style, color scheme, and container preferences. Send us a message on WhatsApp or through this contact form with your ideas, and we will collaborate to bring your vision to life.",
    },
    {
      q: "Do you deliver island-wide?",
      a: "To ensure our delicate arrangements arrive fresh and in perfect condition, we currently deliver primarily within Gampaha, Colombo, and immediate surrounding areas. For bulk custom orders or special events outside these locations, please get in touch directly to discuss options.",
    },
    {
      q: "How should I care for my flowers and plants?",
      a: "Every Evermoss arrangement is delivered with a specific care instruction tag. Generally, fresh flowers should be kept out of direct sunlight and drafts with fresh water added daily. Potted plants thrive best in bright, indirect light and require watering only when the top soil layer feels completely dry.",
    },
    {
      q: "How long do the floral arrangements last?",
      a: "Fresh floral arrangements typically maintain their beauty for 5 to 10 days depending on care and environment. Our dried, preserved collections and terrariums are designed to last for months, or even years, with virtually no maintenance required.",
    },
  ];

  return (
    <>
      <ScrollToTop />
      <Header />

      <main className="inner">
        {/* Intro */}
        <ScrollReveal className="reveal-fade-up">
          <div className="page-intro contact-intro-section">
            <p className="eyebrow">Let’s connect</p>
            <h1>We’d love to hear from you.</h1>
            <p>
              Have a question about our collections, need custom
              recommendations, or want to discuss an event? Drop us a line
              below.
            </p>
          </div>
        </ScrollReveal>

        {/* Contact Layout */}
        <section className="contact-redesign-layout">
          {/* Left Column */}
          <div className="contact-info-cards">
            <ScrollReveal className="reveal-fade-up">
              <div className="info-card-item">
                <div className="info-card-icon">
                  <MessageSquare size={20} />
                </div>
                <div className="info-card-details">
                  <span>WhatsApp Enquiry</span>
                  <a
                    href="https://wa.me/94720295492"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +94 72 029 5492
                  </a>
                  <p>Mon - Sun, 8:00 AM - 8:00 PM</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal className="reveal-fade-up" delay={100}>
              <div className="info-card-item">
                <div className="info-card-icon">
                  <Mail size={20} />
                </div>
                <div className="info-card-details">
                  <span>Email Support</span>
                  <a href="mailto:info.evermoss@gmail.com">
                    info.evermoss@gmail.com
                  </a>
                  <p>We usually reply within 24 hours.</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal className="reveal-fade-up" delay={200}>
              <div className="info-card-item">
                <div className="info-card-icon">
                  <MapPin size={20} />
                </div>
                <div className="info-card-details">
                  <span>Our Location</span>
                  <a
                    href="https://maps.google.com/?q=Gampaha"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Gampaha, Sri Lanka
                  </a>
                  <p>Visits by appointment only.</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal className="reveal-fade-up" delay={300}>
              <div className="info-card-item social-card-item">
                <div className="info-card-details">
                  <span>Connect With Us</span>
                  <p className="social-sub">
                    Follow our green journey on social media
                  </p>
                  <SocialButtons />
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column */}
          <ScrollReveal className="reveal-fade-up" delay={150}>
            <div className="contact-form-card">
              <h2>Send Us a Message</h2>
              <p className="form-subtitle">
                Fill in the fields below, and our team will get back to you
                shortly.
              </p>
              <ContactForm />
            </div>
          </ScrollReveal>
        </section>

        {/* FAQ */}
        <section className="faq-section">
          <ScrollReveal className="reveal-fade-up">
            <div className="faq-header">
              <p className="eyebrow">Common Questions</p>
              <h2>Frequently Asked Questions</h2>
              <p>
                Everything you need to know about our handcrafted floral
                arrangements and care guides.
              </p>
            </div>
          </ScrollReveal>

          <div className="faq-accordion-list">
            {faqs.map((faq, idx) => (
              <ScrollReveal
                key={idx}
                className="reveal-fade-up"
                delay={idx * 80}
              >
                <details className="faq-accordion-item">
                  <summary className="faq-summary-title">{faq.q}</summary>
                  <div className="faq-answer-content">
                    <p>{faq.a}</p>
                  </div>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Map - left unchanged */}
        <section className="contact-map-section">
          <div className="map-card">
            <div className="map-header">
              <MapPin size={18} />
              <span>Location Map</span>
            </div>

            <iframe
              className="redesigned-map"
              title="Evermoss location"
              src="https://www.google.com/maps?q=Gampaha&output=embed"
              loading="lazy"
            />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
