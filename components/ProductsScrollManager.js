"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ProductsScrollManager() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevSearchParamsRef = useRef(searchParams.toString());

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Save scroll position when user scrolls on /products
    const handleScroll = () => {
      if (window.location.pathname === "/products") {
        sessionStorage.setItem("products_scroll_y", window.scrollY.toString());
      }
    };

    // Intercept clicks on links navigating to a product detail page (/products/[slug])
    const handleClick = (e) => {
      const anchor = e.target.closest("a");
      if (anchor) {
        const href = anchor.getAttribute("href") || "";
        if (href.startsWith("/products/") && href !== "/products") {
          sessionStorage.setItem("products_scroll_y", window.scrollY.toString());
          sessionStorage.setItem("from_product_detail", "true");
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Disable browser's automatic scroll restoration on popstate for products page
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const currentSearchParamsString = searchParams.toString();
    const searchParamsChanged = prevSearchParamsRef.current !== currentSearchParamsString;
    prevSearchParamsRef.current = currentSearchParamsString;

    const lastPath = sessionStorage.getItem("last_visited_path") || "";
    const currentPathInStorage = sessionStorage.getItem("current_path") || "";

    const isFromDetailFlag = sessionStorage.getItem("from_product_detail") === "true";
    const isFromProductDetail =
      !searchParamsChanged &&
      (isFromDetailFlag ||
        (lastPath.startsWith("/products/") && lastPath !== "/products") ||
        (currentPathInStorage.startsWith("/products/") &&
          currentPathInStorage !== "/products"));

    const savedScrollY = sessionStorage.getItem("products_scroll_y");

    if (isFromProductDetail && savedScrollY !== null) {
      sessionStorage.removeItem("from_product_detail");
      const scrollY = parseInt(savedScrollY, 10);

      // Instant scroll immediately + fallback timeouts for Next.js async component render
      window.scrollTo({
        top: scrollY,
        left: 0,
        behavior: "instant",
      });

      const t1 = setTimeout(() => {
        window.scrollTo({
          top: scrollY,
          left: 0,
          behavior: "instant",
        });
      }, 40);

      const t2 = setTimeout(() => {
        window.scrollTo({
          top: scrollY,
          left: 0,
          behavior: "instant",
        });
      }, 150);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      // Category change or arriving from another page -> force scroll to top
      sessionStorage.removeItem("from_product_detail");
      sessionStorage.setItem("products_scroll_y", "0");
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [pathname, searchParams]);

  return null;
}

