"use client";

import { useEffect, useMemo, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import { FaChevronDown, FaCheck } from "react-icons/fa6";

const SORT_OPTIONS = [
  { value: "newest", label: "Latest additions" },
  { value: "low", label: "Price: low to high" },
  { value: "high", label: "Price: high to low" },
];

function ProductGridContent({ products = [] }) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";

  const [order, setOrder] = useState("newest");
  const [category, setCategory] = useState(categoryParam);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  const itemsPerPage = 12;

  // Sync state with URL category parameter
  useEffect(() => {
    setCategory(categoryParam);
    setCurrentPage(1);
  }, [categoryParam]);

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

  const activeSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === order)?.label || "Latest additions";

  // Sort products
  const sorted = useMemo(() => {
    const copy = products.filter(
      (product) => category === "all" || product.category === category,
    );

    if (order === "low") {
      return copy.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (order === "high") {
      return copy.sort((a, b) => Number(b.price) - Number(a.price));
    }

    // Newest products first
    return copy.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [products, order, category]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sorted.slice(start, start + itemsPerPage);
  }, [sorted, currentPage]);

  function handlePageChange(pageNumber) {
    setCurrentPage(pageNumber);

    const intro = document.querySelector(".page-intro");

    if (intro) {
      intro.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      window.scrollTo({
        top: 0,
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
                <span>{activeSortLabel}</span>
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

      {paginatedProducts.length > 0 ? (
        <div className="grid full-grid product-grid-mobile">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.slug} p={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">No products found in this category yet.</div>
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
                  className={`pagination-btn num-btn ${
                    currentPage === page ? "active" : ""
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


