"use client";

import { useEffect, useState } from "react";
import { Eye, Plus, X, Edit, Trash2, Lock, LogOut } from "lucide-react";

const blank = {
  code: "",
  name: "",
  slug: "",
  description: "",
  customDesign: false,
  price: "",
  images: ["", "", "", ""],
};

export default function Admin() {
  const [isAuthorized, setIsAuthorized] = useState(null);

  // Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Dashboard states
  const [form, setForm] = useState(blank);
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("");

  const set = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  // Check if authenticated on load
  async function checkAuth() {
    try {
      const r = await fetch("/api/admin/check-auth");
      const data = await r.json();
      if (r.ok && data.authorized) {
        setIsAuthorized(true);
        load();
      } else {
        setIsAuthorized(false);
      }
    } catch (err) {
      console.error("Failed to verify session:", err);
      setIsAuthorized(false);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginMsg("");
    setLoggingIn(true);

    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await r.json();
      if (r.ok && data.ok) {
        setIsAuthorized(true);
        load();
      } else {
        setLoginMsg(data.error || "Invalid credentials.");
      }
    } catch (err) {
      setLoginMsg("Network error. Please try again.");
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    try {
      const r = await fetch("/api/admin/logout", { method: "POST" });
      if (r.ok) {
        setIsAuthorized(false);
        setEmail("");
        setPassword("");
        setLoginMsg("");
        setItems([]);
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  async function load() {
    try {
      const r = await fetch("/api/products", { cache: "no-store" });
      if (r.ok) {
        setItems(await r.json());
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  }

  function handleUpload(index, file) {
    if (!file) return;
    if (file.size > 3.5 * 1024 * 1024) {
      setMsg("Please choose an image smaller than 3.5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => {
        const copy = [...current.images];
        copy[index] = reader.result;
        return { ...current, images: copy };
      });
      setMsg("");
    };
    reader.readAsDataURL(file);
  }

  function handleRemove(index) {
    setForm((current) => {
      const copy = [...current.images];
      copy[index] = "";
      return { ...current, images: copy };
    });
  }

  async function save(e) {
    e.preventDefault();
    setMsg("Saving…");

    const activeImages = form.images.filter(Boolean);
    if (activeImages.length === 0) {
      setMsg("Please upload at least one product image.");
      return;
    }

    const payload = {
      ...form,
      images: activeImages,
    };

    try {
      const r = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (r.ok) {
        setMsg("Product saved successfully.");
        setForm(blank);
        load();
      } else {
        const errData = await r.json();
        setMsg(
          errData.error ||
            "Could not save. Please check authorization or fields.",
        );
        if (r.status === 401) {
          setIsAuthorized(false);
        }
      }
    } catch (error) {
      setMsg("Network or database error. Please try again.");
    }
  }

  async function remove(slug) {
    if (!confirm("Delete this product?")) return;
    try {
      const r = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (r.ok) {
        load();
      } else {
        const errData = await r.json();
        setMsg(errData.error || "Could not delete product.");
        if (r.status === 401) {
          setIsAuthorized(false);
        }
      }
    } catch (error) {
      setMsg("Error deleting product.");
    }
  }

  function edit(p) {
    let initialImages = ["", "", "", ""];
    if (Array.isArray(p.images)) {
      p.images.forEach((img, i) => {
        if (i < 4) initialImages[i] = img;
      });
    } else if (p.image) {
      initialImages[0] = p.image;
    }

    setForm({
      code: p.code || "",
      name: p.name || "",
      slug: p.slug || "",
      description: p.description || "",
      customDesign: Boolean(p.customDesign),
      price: p.price || "",
      images: initialImages,
    });
    setMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // 1. Loading State
  if (isAuthorized === null) {
    return (
      <div className="admin-loading-screen">
        <div className="spinner"></div>
        <p>Verifying secure session...</p>
      </div>
    );
  }

  // 2. Unauthenticated State (Login Screen)
  if (isAuthorized === false) {
    return (
      <div className="admin-login-layout">
        <div className="login-card">
          <div className="login-icon-header">
            <Lock size={26} />
          </div>
          <h2>Evermoss Admin Portal</h2>
          <p className="login-subtitle">
            Sign in to manage your green collection
          </p>

          <form className="login-form-fields" onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              className="login-submit-btn"
              type="submit"
              disabled={loggingIn}
            >
              {loggingIn ? "Authenticating..." : "Secure Sign In"}
            </button>

            {loginMsg && <p className="login-error-message">{loginMsg}</p>}
          </form>
        </div>
      </div>
    );
  }

  // 3. Authenticated State (Dashboard)
  return (
    <main className="admin-container">
      {/* Admin Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <p className="admin-eyebrow">Evermoss Dashboard</p>
          <h1>Product Management</h1>
        </div>
        <div className="admin-header-right">
          <a href="/products" target="_blank" className="admin-nav-link">
            <Eye size={16} /> View Storefront
          </a>
          <button onClick={handleLogout} className="admin-logout-btn">
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </header>

      {/* Stats Cards Row */}
      <div className="admin-stats-row">
        <div className="stat-card">
          <span className="stat-label">Total Products</span>
          <span className="stat-value">{items.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Custom Designs</span>
          <span className="stat-value">
            {items.filter((p) => p.customDesign).length}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Secure Status</span>
          <span className="stat-value text-success">Protected</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="admin-grid">
        {/* Form Card */}
        <div className="admin-card form-card">
          <h2>{form.slug ? "Edit Product Details" : "Add New Product"}</h2>
          <form className="admin-form-redesign" onSubmit={save}>
            <div className="input-row">
              <div className="input-group">
                <label htmlFor="prod-code">Product Code</label>
                <input
                  id="prod-code"
                  value={form.code}
                  onChange={(e) => set("code", e.target.value.toUpperCase())}
                  placeholder="e.g. EM-004"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="prod-name">Product Name</label>
                <input
                  id="prod-name"
                  value={form.name}
                  onChange={(e) => {
                    set("name", e.target.value);
                    if (!form.slug) {
                      set(
                        "slug",
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-"),
                      );
                    }
                  }}
                  placeholder="e.g. Daisy"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="prod-desc">Description</label>
              <textarea
                id="prod-desc"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Describe the floral arrangement..."
                rows="4"
                required
              />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label htmlFor="prod-price">Price (Rs.)</label>
                <input
                  id="prod-price"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="e.g. 3900"
                  type="number"
                  min="1"
                  required
                />
              </div>

              <div className="input-group checkbox-group-container">
                <label className="check-label-redesign">
                  <input
                    type="checkbox"
                    checked={form.customDesign}
                    onChange={(e) => set("customDesign", e.target.checked)}
                  />
                  <span>Custom design available</span>
                </label>
              </div>
            </div>

            {/* Multiple Product Images */}
            <div className="images-upload-section">
              <label className="section-label">
                Product Images (Upload up to 4)
              </label>
              <div className="image-slots-grid">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="image-slot-wrapper">
                    <span className="slot-badge">
                      {index === 0 ? "Main" : `Img ${index + 1}`}
                    </span>
                    {form.images[index] ? (
                      <div className="image-preview-slot">
                        <img
                          src={form.images[index]}
                          alt={`Preview ${index + 1}`}
                        />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => handleRemove(index)}
                          title="Remove image"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor={`image-upload-${index}`}
                        className="image-upload-placeholder"
                      >
                        <input
                          type="file"
                          id={`image-upload-${index}`}
                          style={{ display: "none" }}
                          accept="image/png,image/jpeg,image/webp"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUpload(index, file);
                          }}
                        />
                        <Plus size={18} />
                        <span>Upload</span>
                      </label>
                    )}
                  </div>
                ))}
              </div>
              <small className="help-text">
                JPG, PNG or WebP files supported (Max 3.5MB each).
              </small>
            </div>

            <div className="form-actions">
              <button className="admin-btn-primary" type="submit">
                {form.slug ? "Save Product" : "Add Product"}
              </button>
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => {
                  setForm(blank);
                  setMsg("");
                }}
              >
                Clear Form
              </button>
            </div>

            {msg && (
              <p
                className={`status-message ${msg.includes("successfully") ? "success" : "error"}`}
              >
                {msg}
              </p>
            )}
          </form>
        </div>

        {/* List Card */}
        <div className="admin-card list-card">
          <h2>Published Products</h2>
          <div className="admin-products-list">
            {items.length === 0 ? (
              <div className="empty-state">
                No products found. Start by adding one.
              </div>
            ) : (
              items.map((p) => {
                const displayImage =
                  p.images?.[0] ||
                  p.image ||
                  "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&q=85";
                return (
                  <div key={p.slug} className="product-list-item">
                    <div className="item-thumbnail">
                      <img src={displayImage} alt={p.name} />
                    </div>
                    <div className="item-details">
                      <span className="item-code">{p.code}</span>
                      <h3>{p.name}</h3>
                      <span className="item-price">
                        Rs. {Number(p.price).toLocaleString()}
                      </span>
                    </div>
                    <div className="item-actions">
                      <button
                        className="action-edit-btn"
                        onClick={() => edit(p)}
                        title="Edit product"
                      >
                        <Edit size={15} />
                      </button>
                      <button
                        className="action-delete-btn"
                        onClick={() => remove(p.slug)}
                        title="Delete product"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
