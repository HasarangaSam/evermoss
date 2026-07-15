"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  Plus,
  X,
  Edit,
  Trash2,
  Lock,
  LogOut,
  MessageSquare,
} from "lucide-react";

const blank = {
  _id: "",
  code: "",
  name: "",
  slug: "",
  description: "",
  customDesign: false,
  price: "",
  images: [null, null, null, null],
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
  const [messagesCount, setMessagesCount] = useState(0);
  const [msg, setMsg] = useState("");

  const set = (key, value) =>
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

  // ==========================
  // AUTH CHECK
  // ==========================

  async function checkAuth() {
    try {
      const r = await fetch("/api/admin/check-auth");

      const data = await r.json();

      if (r.ok && data.authorized) {
        setIsAuthorized(true);
        load();
        loadMessagesCount();
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error("Auth error:", error);

      setIsAuthorized(false);
    }
  }
  async function loadMessagesCount() {
    try {
      const r = await fetch("/api/admin/messages");

      if (r.ok) {
        const data = await r.json();

        const unreadCount = data.filter(
          (message) => message.status === "new",
        ).length;

        setMessagesCount(unreadCount);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  // ==========================
  // LOGIN
  // ==========================

  async function handleLogin(e) {
    e.preventDefault();

    setLoginMsg("");
    setLoggingIn(true);

    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await r.json();

      if (r.ok && data.ok) {
        setIsAuthorized(true);
        load();
      } else {
        setLoginMsg(data.error || "Invalid credentials.");
      }
    } catch (error) {
      setLoginMsg("Network error. Please try again.");
    } finally {
      setLoggingIn(false);
    }
  }

  // ==========================
  // LOGOUT
  // ==========================

  async function handleLogout() {
    try {
      const r = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (r.ok) {
        setIsAuthorized(false);
        setEmail("");
        setPassword("");
        setItems([]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // ==========================
  // LOAD PRODUCTS
  // ==========================

  async function load() {
    try {
      const r = await fetch("/api/products", {
        cache: "no-store",
      });

      if (r.ok) {
        setItems(await r.json());
      }
    } catch (error) {
      console.error(error);
    }
  }

  // ==========================
  // IMAGE SELECT
  // ==========================

  function handleUpload(index, file) {
    if (!file) return;

    if (file.size > 3.5 * 1024 * 1024) {
      setMsg("Please choose an image smaller than 3.5 MB.");

      return;
    }

    setForm((current) => {
      const images = [...current.images];

      images[index] = file;

      return {
        ...current,
        images,
      };
    });

    setMsg("");
  }

  // ==========================
  // REMOVE IMAGE
  // ==========================

  function handleRemove(index) {
    setForm((current) => {
      const images = [...current.images];

      images[index] = null;

      return {
        ...current,
        images,
      };
    });
  }

  // ==========================
  // SAVE PRODUCT
  // ==========================

  async function save(e) {
    e.preventDefault();

    setMsg("Saving...");

    const selectedImages = form.images.filter(Boolean);

    if (selectedImages.length === 0) {
      setMsg("Please upload at least one product image.");

      return;
    }

    const formData = new FormData();

    formData.append("_id", form._id);

    formData.append("code", form.code);

    formData.append("name", form.name);

    formData.append("slug", form.slug);

    formData.append("description", form.description);

    formData.append("customDesign", form.customDesign);

    formData.append("price", form.price);

    selectedImages.forEach((image) => {
      if (image instanceof File) {
        formData.append("images", image);
      } else if (typeof image === "string") {
        formData.append("existingImages", image);
      }
    });

    try {
      const r = await fetch("/api/admin/products", {
        method: "POST",

        body: formData,
      });

      if (r.ok) {
        setMsg("Product saved successfully.");

        setForm(blank);

        load();
      } else {
        const data = await r.json();

        setMsg(data.error || "Could not save product.");

        if (r.status === 401) {
          setIsAuthorized(false);
        }
      }
    } catch (error) {
      setMsg("Network or database error.");
    }
  }

  // ==========================
  // DELETE PRODUCT
  // ==========================

  async function remove(id) {
    if (!confirm("Delete this product?")) return;

    try {
      const r = await fetch("/api/admin/products", {
        method: "DELETE",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id,
        }),
      });

      if (r.ok) {
        load();
      }
    } catch (error) {
      setMsg("Error deleting product.");
    }
  }

  // ==========================
  // EDIT PRODUCT
  // ==========================

  function edit(p) {
    let initialImages = [null, null, null, null];

    if (Array.isArray(p.images)) {
      p.images.forEach((img, index) => {
        if (index < 4) {
          if (typeof img === "object") {
            initialImages[index] = img.url;
          } else {
            initialImages[index] = img;
          }
        }
      });
    } else if (p.image) {
      initialImages[0] = p.image;
    }

    setForm({
      _id: p._id,

      code: p.code || "",

      name: p.name || "",

      slug: p.slug || "",

      description: p.description || "",

      customDesign: Boolean(p.customDesign),

      price: p.price || "",

      images: initialImages,
    });

    setMsg("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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

  // 2. Login Screen
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
              <label>Email Address</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button className="login-submit-btn" disabled={loggingIn}>
              {loggingIn ? "Authenticating..." : "Secure Sign In"}
            </button>

            {loginMsg && <p className="login-error-message">{loginMsg}</p>}
          </form>
        </div>
      </div>
    );
  }

  // 3. Dashboard
  return (
    <main className="admin-container">
      <header className="admin-header">
        <div className="admin-header-left">
          <p className="admin-eyebrow">Evermoss Dashboard</p>

          <h1>Product Management</h1>
        </div>

        <div className="admin-header-right">
          <a href="/products" target="_blank" className="admin-nav-link">
            <Eye size={16} />
            View Storefront
          </a>

          <a href="/admin/messages" className="admin-nav-link">
            <MessageSquare size={16} />
            Messages
          </a>

          <button onClick={handleLogout} className="admin-logout-btn">
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </header>

      <div className="admin-stats-row">
        <div className="stat-card">
          {" "}
          <span className="stat-label">Total Products</span>{" "}
          <span className="stat-value">{items.length}</span>{" "}
        </div>
        <div className="stat-card">
          <span className="stat-label">Unread Messages</span>

          <span className="stat-value">{messagesCount}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Secure Status</span>

          <span className="stat-value text-success">Protected</span>
        </div>
      </div>

      <div className="admin-grid">
        {/* FORM */}

        <div className="admin-card form-card">
          <h2>{form.slug ? "Edit Product Details" : "Add New Product"}</h2>

          <form className="admin-form-redesign" onSubmit={save}>
            <div className="input-row">
              <div className="input-group">
                <label>Product Code</label>

                <input
                  value={form.code}
                  onChange={(e) => set("code", e.target.value.toUpperCase())}
                  required
                />
              </div>

              <div className="input-group">
                <label>Product Name</label>

                <input
                  value={form.name}
                  onChange={(e) => {
                    const newName = e.target.value;

                    set("name", newName);

                    set(
                      "slug",
                      newName
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, ""),
                    );
                  }}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Description</label>

              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows="4"
                required
              />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Price (Rs.)</label>

                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
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

            {/* IMAGES */}

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
                          src={
                            form.images[index] instanceof File
                              ? URL.createObjectURL(form.images[index])
                              : form.images[index]
                          }
                          alt="preview"
                        />

                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => handleRemove(index)}
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
                          id={`image-upload-${index}`}
                          type="file"
                          hidden
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

            {msg && <p className="status-message">{msg}</p>}
          </form>
        </div>

        {/* PRODUCT LIST */}

        <div className="admin-card list-card">
          <h2>Published Products</h2>

          <div className="admin-products-list">
            {items.map((p) => {
              const img =
                typeof p.images?.[0] === "object"
                  ? p.images[0].url
                  : p.images?.[0] || p.image;

              return (
                <div key={p._id} className="product-list-item">
                  <div className="item-thumbnail">
                    <img src={img} alt={p.name} />
                  </div>

                  <div className="item-details">
                    <span className="item-code">{p.code}</span>

                    <h3>{p.name}</h3>

                    <span className="item-price">
                      Rs. {Number(p.price).toLocaleString()}
                    </span>
                  </div>

                  <div className="item-actions">
                    <button className="action-edit-btn" onClick={() => edit(p)}>
                      <Edit size={15} />
                    </button>

                    <button
                      className="action-delete-btn"
                      onClick={() => remove(p._id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
