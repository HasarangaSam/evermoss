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
  const headerRef = useRef(null);
  const dropdownRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const categoryParam = searchParams.get("category");

  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  // Close mobile navbar and dropdown on touch/click outside header
  useEffect(() => {
    function handleClickOutside(event) {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setOpen(false);
        setDropdownOpen(false);
      } else if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    }

    if (open || dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open, dropdownOpen]);

  // Close menus on path change and track navigation path history for scroll restoration
  useEffect(() => {
    if (typeof window !== "undefined") {
      const prevPath = sessionStorage.getItem("current_path") || "";
      if (prevPath && prevPath !== pathname) {
        sessionStorage.setItem("last_visited_path", prevPath);
      }
      sessionStorage.setItem("current_path", pathname);
    }
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
  const isFlowerActive =
    pathname === "/products" && categoryParam === "Flower Arrangements";
  const isLeafActive =
    pathname === "/products" && categoryParam === "Leaf Arrangements";

  const handleNavCategoryClick = () => {
    setOpen(false);
    setDropdownOpen(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("from_product_detail");
      sessionStorage.setItem("products_scroll_y", "0");
      // Always scroll to top smoothly — even when re-clicking the same active category
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      // Dispatch a custom event so the product grid can react even if the URL param hasn't changed
      window.dispatchEvent(new CustomEvent("evermoss:category-nav"));
    }
  };

  return (
    <header ref={headerRef}>
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
            <FaChevronDown
              className={`nav-arrow-icon ${dropdownOpen ? "rotated" : ""}`}
            />
          </button>

          <div className={`nav-dropdown-menu ${dropdownOpen ? "show" : ""}`}>
            <Link
              href="/products"
              className={`dropdown-menu-item ${isAllProductsActive ? "active" : ""}`}
              onClick={handleNavCategoryClick}
            >
              All Products
            </Link>
            <Link
              href="/products?category=Flower%20Arrangements"
              className={`dropdown-menu-item ${isFlowerActive ? "active" : ""}`}
              onClick={handleNavCategoryClick}
            >
              Flower Arrangements
            </Link>
            <Link
              href="/products?category=Leaf%20Arrangements"
              className={`dropdown-menu-item ${isLeafActive ? "active" : ""}`}
              onClick={handleNavCategoryClick}
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
          <FaWhatsapp /> WhatsApp Us
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
