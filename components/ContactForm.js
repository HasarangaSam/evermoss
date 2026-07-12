"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",

    // Honeypot field
    website: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function submit(e) {
    e.preventDefault();

    setStatus("Sending…");

    try {
      const r = await fetch("/api/contact", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      const result = await r.json();

      if (r.ok) {
        setStatus("Thank you — your message is on its way.");

        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          website: "",
        });
      } else {
        setStatus(
          result.error || "Something went wrong. Please WhatsApp us instead.",
        );
      }
    } catch (err) {
      setStatus("Something went wrong. Please WhatsApp us instead.");
    }
  }

  return (
    <form onSubmit={submit} className="contact-form">
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Your name"
        required
      />

      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email address"
        required
      />

      <input
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone number (optional)"
      />

      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="How can we help?"
        required
        rows="5"
      />

      {/* 
        Honeypot field
        Invisible to real users.
        Bots usually fill this.
      */}
      <input
        type="text"
        name="website"
        value={formData.website}
        onChange={handleChange}
        autoComplete="off"
        tabIndex="-1"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          opacity: 0,
        }}
      />

      <button type="submit">Send message</button>

      {status && <p>{status}</p>}
    </form>
  );
}
