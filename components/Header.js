'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { FaWhatsapp } from 'react-icons/fa6';

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header>
      <Link href="/" className="brand">
        <span>✦</span> Evermoss
      </Link>
      <button className="menu" onClick={() => setOpen(!open)} aria-label="Menu">
        ☰
      </button>
      <nav className={open ? 'open' : ''}>
        <Link href="/" className={isActive('/') ? 'active' : ''}>
          Home
        </Link>
        <Link href="/products" className={isActive('/products') ? 'active' : ''}>
          Products
        </Link>
        <Link href="/contact" className={isActive('/contact') ? 'active' : ''}>
          Contact
        </Link>
        <a className="nav-cta" href="https://wa.me/94720295492" target="_blank" rel="noopener noreferrer">
          <FaWhatsapp /> WhatsApp us
        </a>
      </nav>
    </header>
  );
}

