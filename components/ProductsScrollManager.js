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

    // Disable browser's automatic scroll restoration on popstate for products page
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const lastPath = sessionStorage.getItem("last_visited_path") || "";
    const currentPathInStorage = sessionStorage.getItem("current_path") || "";

    // Check if user came from a product detail page (e.g. /products/bella)
    const isFromProductDetail =
      (lastPath.startsWith("/products/") && lastPath !== "/products") ||
      (currentPathInStorage.startsWith("/products/") &&
        currentPathInStorage !== "/products");

    const savedScrollY = sessionStorage.getItem("products_scroll_y");

    if (isFromProductDetail && savedScrollY !== null) {
      // Returning from product detail page -> restore scrolled position after DOM render
      const scrollY = parseInt(savedScrollY, 10);
      const timer = setTimeout(() => {
        window.scrollTo({
          top: scrollY,
          left: 0,
          behavior: "instant",
        });
      }, 50);
      return () => clearTimeout(timer);
    } else {
      // Arriving from a different page (Home, Contact, etc.) -> force scroll to top
      sessionStorage.setItem("products_scroll_y", "0");
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  }, [pathname, searchParams]);

  return null;
}

