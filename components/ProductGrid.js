"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products = [] }) {
  const [order, setOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;

  // Reset page when products change
  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  // Sort products
  const sorted = useMemo(() => {
    const copy = [...products];

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
  }, [products, order]);

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
        <p>
          Showing {paginatedProducts.length} of {products.length}{" "}
          {products.length === 1 ? "piece" : "pieces"} to make a space feel
          special
        </p>

        <label>
          Sort by{" "}
          <select
            value={order}
            onChange={(e) => {
              setOrder(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="newest">Latest additions</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </label>
      </div>

      {paginatedProducts.length > 0 ? (
        <div className="grid full-grid product-grid-mobile">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.slug} p={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">No products available yet.</div>
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
