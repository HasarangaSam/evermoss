'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState('');

  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget; // Capture form element synchronously before async yield
    setStatus('Sending…');

    const data = Object.fromEntries(new FormData(form));
    
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (r.ok) {
        setStatus('Thank you — your message is on its way.');
        form.reset(); // Safely reset captured form
      } else {
        setStatus('Something went wrong. Please WhatsApp us instead.');
      }
    } catch (err) {
      setStatus('Something went wrong. Please WhatsApp us instead.');
    }
  }

  return (
    <form onSubmit={submit} className="contact-form">
      <input name="name" placeholder="Your name" required />
      <input name="email" type="email" placeholder="Email address" required />
      <input name="phone" placeholder="Phone number (optional)" />
      <textarea name="message" placeholder="How can we help?" required rows="5" />
      <button>Send message</button>
      <p>{status}</p>
    </form>
  );
}

