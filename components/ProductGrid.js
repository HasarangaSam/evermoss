"use client";

import { useEffect, useMemo, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import { FaChevronDown, FaCheck, FaMagnifyingGlass, FaXmark } from "react-icons/fa6";

const SORT_OPTIONS = [
  { value: "newest", label: "Latest additions", mobileLabel: "Latest" },
  { value: "low", label: "Price: low to high", mobileLabel: "Price ↑" },
  { value: "high", label: "Price: high to low", mobileLabel: "Price ↓" },
];

function ProductGridContent({ products = [] }) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";
  const urlSearchParam = searchParams.get("q") || searchParams.get("search") || "";

  const [order, setOrder] = useState("newest");
  const [category, setCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(urlSearchParam);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  const itemsPerPage = 16;

  // Sync state with URL search query & category parameters and restore pagination page if returning from detail page
  useEffect(() => {
    if (typeof window === "undefined") return;

    const lastPath = sessionStorage.getItem("last_visited_path") || "";
    const currentPathInStorage = sessionStorage.getItem("current_path") || "";

    const isFromProductDetail =
      (lastPath.startsWith("/products/") && lastPath !== "/products") ||
      (currentPathInStorage.startsWith("/products/") &&
        currentPathInStorage !== "/products");

    if (isFromProductDetail) {
      const savedPage = sessionStorage.getItem("products_current_page");
      if (savedPage) {
        const pageNum = parseInt(savedPage, 10);
        if (!isNaN(pageNum) && pageNum > 0) {
          setCurrentPage(pageNum);
          setCategory(categoryParam);
          setSearchQuery(urlSearchParam);
          return;
        }
      }
    }

    setCategory(categoryParam);
    setSearchQuery(urlSearchParam);
    setCurrentPage(1);
    sessionStorage.setItem("products_current_page", "1");

    // Smooth scroll to top when switching categories or search
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [categoryParam, urlSearchParam]);


  // Update URL search query string parameter seamlessly
  function updateUrlSearch(newQuery) {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (newQuery.trim()) {
      params.set("q", newQuery.trim());
    } else {
      params.delete("q");
    }
    const queryString = params.toString();
    const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }

  function handleSearchChange(e) {
    const val = e.target.value;
    setSearchQuery(val);
    setCurrentPage(1);
    sessionStorage.setItem("products_current_page", "1");
    updateUrlSearch(val);
  }

  function handleClearSearch() {
    setSearchQuery("");
    setCurrentPage(1);
    sessionStorage.setItem("products_current_page", "1");
    updateUrlSearch("");
  }

  // Close sort dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const activeSort = SORT_OPTIONS.find((opt) => opt.value === order);
  const activeSortLabel = activeSort?.label || "Latest additions";
  const activeMobileLabel = activeSort?.mobileLabel || "Latest";

  // Filter & sort products
  const sorted = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      if (!matchesCategory) return false;

      if (!q) return true;

      const nameMatch = product.name ? product.name.toLowerCase().includes(q) : false;
      const codeMatch = product.code ? product.code.toLowerCase().includes(q) : false;
      const descMatch = product.description ? product.description.toLowerCase().includes(q) : false;

      return nameMatch || codeMatch || descMatch;
    });

    if (order === "low") {
      return filtered.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (order === "high") {
      return filtered.sort((a, b) => Number(b.price) - Number(a.price));
    }

    // Newest products first
    return filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [products, order, category, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sorted.slice(start, start + itemsPerPage);
  }, [sorted, currentPage]);

  function handlePageChange(pageNumber) {
    setCurrentPage(pageNumber);

    if (typeof window !== "undefined") {
      sessionStorage.setItem("products_current_page", pageNumber.toString());
      sessionStorage.setItem("products_scroll_y", "0");
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }

  return (
    <>
      <div className="shop-toolbar">
        <div className="category-title-heading">
          <span className="category-badge">Category</span>
          <h2 className="current-category-name">
            {category === "all" ? "All Arrangements" : category}
          </h2>
        </div>

        <div className="shop-controls">
          <div className="product-search-wrapper">
            <FaMagnifyingGlass className="search-icon" />
            <input
              type="text"
              className="product-search-input"
              placeholder="Search products, codes..."
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Search products"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <FaXmark />
              </button>
            )}
          </div>

          <div className="theme-sort-container" ref={sortRef}>
            <span className="select-label-text">Sort by</span>

            <div className="custom-dropdown-wrapper">
              <button
                type="button"
                className={`custom-sort-trigger ${sortOpen ? "open" : ""}`}
                onClick={() => setSortOpen((prev) => !prev)}
                aria-expanded={sortOpen}
                aria-label="Sort products menu"
              >
                <span className="sort-label-desktop">{activeSortLabel}</span>
                <span className="sort-label-mobile">{activeMobileLabel}</span>
                <FaChevronDown className={`sort-chevron ${sortOpen ? "rotated" : ""}`} />
              </button>

              {sortOpen && (
                <div className="custom-sort-menu">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`custom-sort-item ${order === opt.value ? "selected" : ""}`}
                      onClick={() => {
                        setOrder(opt.value);
                        setCurrentPage(1);
                        setSortOpen(false);
                        if (typeof window !== "undefined") {
                          sessionStorage.setItem("products_current_page", "1");
                          sessionStorage.setItem("products_scroll_y", "0");
                          window.scrollTo({
                            top: 0,
                            left: 0,
                            behavior: "smooth",
                          });
                        }
                      }}
                    >
                      <span>{opt.label}</span>
                      {order === opt.value && <FaCheck className="sort-check-icon" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {searchQuery && (
        <div className="search-results-info">
          <span>
            Found <strong>{sorted.length}</strong> {sorted.length === 1 ? "arrangement" : "arrangements"} matching &ldquo;<strong>{searchQuery}</strong>&rdquo;
          </span>
        </div>
      )}


      {paginatedProducts.length > 0 ? (
        <div className="grid full-grid product-grid-mobile">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.slug} p={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state product-empty-state">
          <div className="empty-icon-wrap">
            <FaMagnifyingGlass className="empty-search-icon" />
          </div>
          <h3>No matching arrangements</h3>
          <p>
            {searchQuery
              ? `We couldn't find anything matching "${searchQuery}". Try checking for spelling or search another keyword.`
              : "No products found in this category yet."}
          </p>
          {searchQuery && (
            <button
              type="button"
              className="clear-search-action-btn"
              onClick={handleClearSearch}
            >
              Clear Search & View All
            </button>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="pagination-btn arrow-btn"
            aria-label="Previous Page"
          >
            &larr; Prev
          </button>

          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`pagination-btn num-btn ${currentPage === page ? "active" : ""
                    }`}
                  aria-label={`Go to Page ${page}`}
                >
                  {page}
                </button>
              ),
            )}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="pagination-btn arrow-btn"
            aria-label="Next Page"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </>
  );
}

export default function ProductGrid(props) {
  return (
    <Suspense fallback={null}>
      <ProductGridContent {...props} />
    </Suspense>
  );
}



