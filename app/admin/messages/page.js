"use client";

import { ArrowLeft, Trash2, Mail, Eye, X, CheckCheck } from "lucide-react";

import { useEffect, useState } from "react";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [sortOption, setSortOption] = useState("newest");

  // ==========================
  // LOAD MESSAGES
  // ==========================

  async function loadMessages() {
    try {
      const r = await fetch("/api/admin/messages", {
        cache: "no-store",
      });

      if (r.ok) {
        setMessages(await r.json());
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  // ==========================
  // SORT MESSAGES
  // ==========================

  const sortedMessages = [...messages].sort((a, b) => {
    switch (sortOption) {
      case "new":
        return a.status === "new" ? -1 : 1;

      case "read":
        return a.status === "read" ? -1 : 1;

      case "replied":
        return a.status === "replied" ? -1 : 1;

      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);

      case "newest":
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // ==========================
  // UPDATE STATUS
  // ==========================

  async function updateStatus(id, status) {
    try {
      const r = await fetch("/api/admin/messages", {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id,
          status,
        }),
      });

      const data = await r.json();

      console.log("PATCH response:", data);

      if (r.ok) {
        loadMessages();
      } else {
        alert(data.error || "Status update failed");
      }
    } catch (error) {
      console.error("PATCH error:", error);
    }
  }

  // ==========================
  // DELETE MESSAGE
  // ==========================

  async function remove(id) {
    if (!confirm("Delete this message?")) return;

    try {
      const r = await fetch("/api/admin/messages", {
        method: "DELETE",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id,
        }),
      });

      const data = await r.json();

      console.log("DELETE response:", data);

      if (r.ok) {
        setSelectedMessage(null);
        loadMessages();
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (error) {
      console.error("DELETE error:", error);
    }
  }

  return (
    <main className="messages-admin-container">
      <header className="messages-header">
        <a href="/admin" className="admin-nav-link">
          <ArrowLeft size={16} />
          Back Dashboard
        </a>

        <h1>Customer Messages</h1>
      </header>

      <div className="messages-table-card">
        {/* SORT TOOLBAR */}

        <div className="messages-toolbar">
          <span className="toolbar-label">Sort Messages</span>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="message-sort-select"
          >
            <option value="newest">Newest First</option>

            <option value="new">Unread Messages</option>

            <option value="replied">Replied Messages</option>

            <option value="read">Read Messages</option>

            <option value="oldest">Oldest First</option>
          </select>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedMessages.map((msg) => (
              <tr key={msg._id}>
                <td>{msg.name}</td>

                <td>{msg.email}</td>

                <td>{msg.phone || "-"}</td>

                <td className="message-preview">{msg.message}</td>

                <td>
                  <span className={`message-status ${msg.status}`}>
                    {msg.status}
                  </span>
                </td>

                <td>{new Date(msg.createdAt).toLocaleDateString()}</td>

                <td>
                  <div className="message-actions">
                    {/* VIEW MESSAGE */}

                    <button
                      className="view-msg-btn"
                      title="View message"
                      onClick={() => {
                        setSelectedMessage(msg);

                        if (msg.status === "new") {
                          updateStatus(msg._id, "read");
                        }
                      }}
                    >
                      <Eye size={15} />
                    </button>

                    {/* MARK READ */}

                    <button
                      className="read-msg-btn"
                      title="Mark as read"
                      onClick={() => updateStatus(msg._id, "read")}
                    >
                      <CheckCheck size={15} />
                    </button>

                    {/* REPLY */}

                    <a
                      href={`mailto:${msg.email}?subject=Evermoss Inquiry`}
                      className="reply-btn"
                      title="Reply"
                      onClick={() => updateStatus(msg._id, "replied")}
                    >
                      <Mail size={15} />
                    </a>

                    {/* DELETE */}

                    <button
                      className="delete-msg-btn"
                      title="Delete"
                      onClick={() => remove(msg._id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {messages.length === 0 && (
          <p className="empty-state">No customer messages found.</p>
        )}
      </div>

      {/* MESSAGE MODAL */}

      {selectedMessage && (
        <div className="message-modal-overlay">
          <div className="message-modal">
            <button
              className="modal-close-btn"
              onClick={() => setSelectedMessage(null)}
            >
              <X size={18} />
            </button>

            <h2>Customer Message</h2>

            <div className="modal-info">
              <p>
                <strong>Name:</strong> {selectedMessage.name}
              </p>

              <p>
                <strong>Email:</strong> {selectedMessage.email}
              </p>

              <p>
                <strong>Phone:</strong> {selectedMessage.phone || "-"}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedMessage.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="full-message-box">
              <strong>Message</strong>

              <p>{selectedMessage.message}</p>
            </div>

            <div className="modal-actions">
              <a
                href={`mailto:${selectedMessage.email}?subject=Evermoss Inquiry`}
                className="reply-modal-btn"
                onClick={() => updateStatus(selectedMessage._id, "replied")}
              >
                <Mail size={16} />
                Reply
              </a>

              <button
                className="delete-modal-btn"
                onClick={() => remove(selectedMessage._id)}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
