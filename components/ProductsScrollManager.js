"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ProductsScrollManager() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Save scroll position when user scrolls on /products
    const handleScroll = () => {
      if (window.location.pathname === "/products") {
        sessionStorage.setItem("products_scroll_y", window.scrollY.toString());
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const currentPath = window.location.pathname;
    const lastPath = sessionStorage.getItem("last_visited_path") || "";

    // Check if user came from a product detail page (e.g. /products/bella)
    const isFromProductDetail =
      lastPath.startsWith("/products/") && lastPath !== "/products";

    const savedScrollY = sessionStorage.getItem("products_scroll_y");

    if (isFromProductDetail && savedScrollY !== null) {
      // Returning from product detail page -> restore scrolled position
      const scrollY = parseInt(savedScrollY, 10);
      window.scrollTo({
        top: scrollY,
        left: 0,
        behavior: "instant",
      });
    } else {
      // Arriving from a different page (Home, Contact, etc.) -> force scroll to top
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }

    // Record current path for next navigation
    sessionStorage.setItem("last_visited_path", currentPath);
  }, [pathname, searchParams]);

  return null;
}
