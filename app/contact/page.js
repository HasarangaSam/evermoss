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
      q: "Can I request a custom arrangement?",
      a: "Yes! We create custom arrangements based on your preferred style, colours, size, and space. Share your ideas with us through WhatsApp and we will help create a design that matches your vision.",
    },
    {
      q: "Do you offer Cash on Delivery (COD)?",
      a: "Yes, Cash on Delivery is available for eligible orders. Contact us to confirm availability for your location and order.",
    },
    {
      q: "Where can I use Evermoss arrangements?",
      a: "Our arrangements are perfect for homes, offices, cafés, reception areas, bedrooms, and special occasions. They are designed to add a natural and elegant touch to different spaces.",
    },
    {
      q: "How can I place an order?",
      a: "You can place an order by contacting us through WhatsApp or social media. Choose from our collection or share your custom design idea with us.",
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
                    href="https://wa.me/94711056002"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +94 71 105 6002
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
                    href="https://maps.google.com/?q=Kirindiwela,Gampaha"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Kirindiwela, Gampaha, Sri Lanka
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
                Discover answers to the most common questions about Evermoss
                creations.
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
              src="https://www.google.com/maps?q=Kirindiwela,Gampaha&output=embed"
              loading="lazy"
            />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
