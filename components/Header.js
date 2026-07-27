"use client";

import Link from "next/link";
import { useState, useRef, useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { FaWhatsapp, FaChevronDown } from "react-icons/fa6";

function HeaderContent() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dropdownRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const categoryParam = searchParams.get("category");

  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close menus on path change
  useEffect(() => {
    setDropdownOpen(false);
    setOpen(false);
  }, [pathname, searchParams]);

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen((prev) => !prev);
  };

  // Desktop hover handlers with a grace-period close delay
  const handleMouseEnter = () => {
    if (typeof window !== "undefined" && window.innerWidth <= 760) return;
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    if (typeof window !== "undefined" && window.innerWidth <= 760) return;
    closeTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };

  const isAllProductsActive = pathname === "/products" && !categoryParam;
  const isFlowerActive = pathname === "/products" && categoryParam === "Flower Arrangements";
  const isLeafActive = pathname === "/products" && categoryParam === "Leaf Arrangements";

  return (
    <header>
      <Link href="/" className="brand">
        <span>✦</span> Evermoss
      </Link>
      <button className="menu" onClick={() => setOpen(!open)} aria-label="Menu">
        ☰
      </button>
      <nav className={open ? "open" : ""}>
        <Link href="/" className={isActive("/") ? "active" : ""}>
          Home
        </Link>
        <div
          ref={dropdownRef}
          className={`nav-dropdown-container ${dropdownOpen ? "dropdown-active" : ""}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            type="button"
            className={`nav-products-btn ${isActive("/products") ? "active" : ""}`}
            onClick={toggleDropdown}
            aria-label="Toggle Products Menu"
            aria-expanded={dropdownOpen}
          >
            <span>Products</span>
            <FaChevronDown className={`nav-arrow-icon ${dropdownOpen ? "rotated" : ""}`} />
          </button>

          <div className={`nav-dropdown-menu ${dropdownOpen ? "show" : ""}`}>
            <Link
              href="/products"
              className={`dropdown-menu-item ${isAllProductsActive ? "active" : ""}`}
              onClick={() => {
                setOpen(false);
                setDropdownOpen(false);
              }}
            >
              All Products
            </Link>
            <Link
              href="/products?category=Flower%20Arrangements"
              className={`dropdown-menu-item ${isFlowerActive ? "active" : ""}`}
              onClick={() => {
                setOpen(false);
                setDropdownOpen(false);
              }}
            >
              Flower Arrangements
            </Link>
            <Link
              href="/products?category=Leaf%20Arrangements"
              className={`dropdown-menu-item ${isLeafActive ? "active" : ""}`}
              onClick={() => {
                setOpen(false);
                setDropdownOpen(false);
              }}
            >
              Leaf Arrangements
            </Link>
          </div>
        </div>
        <Link href="/contact" className={isActive("/contact") ? "active" : ""}>
          Contact
        </Link>
        <a
          className="nav-cta"
          href="https://wa.me/94711056002"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp /> WhatsApp us
        </a>
      </nav>
    </header>
  );
}

export default function Header() {
  return (
    <Suspense
      fallback={
        <header>
          <Link href="/" className="brand">
            <span>✦</span> Evermoss
          </Link>
        </header>
      }
    >
      <HeaderContent />
    </Suspense>
  );
}



