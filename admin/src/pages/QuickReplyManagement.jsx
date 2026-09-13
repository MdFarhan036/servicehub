import { useEffect, useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
} from "react-icons/fi";

import API from "../services/api";
import "./QuickReplyManagement.css";

export default function QuickReplyManagement() {
  const [quickReplies, setQuickReplies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    label: "",
    message: "",
    category: "general",
    is_active: 1,
    sort_order: 0,
  });

  // ==========================================================
  // FETCH QUICK REPLIES
  // ==========================================================

  useEffect(() => {
    fetchQuickReplies();
  }, []);

  async function fetchQuickReplies() {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/chatbot/quick-replies"
      );

      setQuickReplies(
        response.data?.data || []
      );

    } catch (err) {
      console.error(
        "Fetch quick replies error:",
        err
      );

      setError(
        "Failed to load quick replies."
      );

    } finally {
      setLoading(false);
    }
  }

  // ==========================================================
  // FORM
  // ==========================================================

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked ? 1 : 0
          : value,
    }));
  }

  // ==========================================================
  // OPEN ADD
  // ==========================================================

  function openAddModal() {
    setEditingId(null);

    setForm({
      label: "",
      message: "",
      category: "general",
      is_active: 1,
      sort_order: 0,
    });

    setError("");
    setShowModal(true);
  }

  // ==========================================================
  // OPEN EDIT
  // ==========================================================

  function openEditModal(reply) {
    setEditingId(reply.id);

    setForm({
      label: reply.label || "",
      message: reply.message || "",
      category: reply.category || "general",
      is_active: reply.is_active ?? 1,
      sort_order: reply.sort_order ?? 0,
    });

    setError("");
    setShowModal(true);
  }

  // ==========================================================
  // CLOSE MODAL
  // ==========================================================

  function closeModal() {
    if (saving) return;

    setShowModal(false);
    setEditingId(null);
  }

  // ==========================================================
  // SAVE
  // ==========================================================

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.label.trim()) {
      setError("Label is required.");
      return;
    }

    if (!form.message.trim()) {
      setError("Message is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        label: form.label.trim(),
        message: form.message.trim(),
        category:
          form.category.trim() || "general",
        is_active: Number(form.is_active),
        sort_order: Number(form.sort_order) || 0,
      };

      if (editingId) {
        await API.put(
          `/chatbot/quick-replies/${editingId}`,
          payload
        );

        setSuccess(
          "Quick reply updated successfully."
        );
      } else {
        await API.post(
          "/chatbot/quick-replies",
          payload
        );

        setSuccess(
          "Quick reply added successfully."
        );
      }

      setShowModal(false);
      setEditingId(null);

      await fetchQuickReplies();

    } catch (err) {
      console.error(
        "Save quick reply error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to save quick reply."
      );

    } finally {
      setSaving(false);
    }
  }

  // ==========================================================
  // DELETE
  // ==========================================================

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this quick reply?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await API.delete(
        `/chatbot/quick-replies/${id}`
      );

      setSuccess(
        "Quick reply deleted successfully."
      );

      await fetchQuickReplies();

    } catch (err) {
      console.error(
        "Delete quick reply error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to delete quick reply."
      );
    }
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="quick-reply-management">

      {/* HEADER */}
      <div className="qr-page-header">

        <div>
          <h2>Quick Replies</h2>

          <p>
            Manage the buttons shown inside
            the chatbot.
          </p>
        </div>

        <button
          className="qr-add-btn"
          onClick={openAddModal}
        >
          <FiPlus />
          Add Quick Reply
        </button>

      </div>

      {/* SUCCESS */}
      {success && (
        <div className="qr-alert qr-success">
          <FiCheck />
          {success}
        </div>
      )}

      {/* ERROR */}
      {error && !showModal && (
        <div className="qr-alert qr-error">
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className="qr-card">

        {loading ? (
          <div className="qr-loading">
            Loading quick replies...
          </div>
        ) : quickReplies.length === 0 ? (
          <div className="qr-empty">
            <h3>No quick replies found</h3>

            <p>
              Add your first chatbot quick reply.
            </p>

            <button
              className="qr-add-btn"
              onClick={openAddModal}
            >
              <FiPlus />
              Add Quick Reply
            </button>
          </div>
        ) : (
          <div className="qr-table-wrapper">

            <table className="qr-table">

              <thead>
                <tr>
                  <th>Label</th>
                  <th>Message</th>
                  <th>Category</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {quickReplies.map((reply) => (
                  <tr key={reply.id}>

                    <td>
                      <strong>
                        {reply.label}
                      </strong>
                    </td>

                    <td>
                      <span className="qr-message">
                        {reply.message}
                      </span>
                    </td>

                    <td>
                      <span className="qr-category">
                        {reply.category ||
                          "general"}
                      </span>
                    </td>

                    <td>
                      {reply.sort_order}
                    </td>

                    <td>
                      <span
                        className={
                          Number(
                            reply.is_active
                          ) === 1
                            ? "qr-status active"
                            : "qr-status inactive"
                        }
                      >
                        {Number(
                          reply.is_active
                        ) === 1
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <div className="qr-actions">

                        <button
                          className="qr-edit-btn"
                          onClick={() =>
                            openEditModal(reply)
                          }
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          className="qr-delete-btn"
                          onClick={() =>
                            handleDelete(reply.id)
                          }
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="qr-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget &&
              !saving
            ) {
              closeModal();
            }
          }}
        >

          <div className="qr-modal">

            {/* MODAL HEADER */}
            <div className="qr-modal-header">

              <div>
                <h3>
                  {editingId
                    ? "Edit Quick Reply"
                    : "Add Quick Reply"}
                </h3>

                <p>
                  Configure the chatbot button.
                </p>
              </div>

              <button
                className="qr-modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                <FiX />
              </button>

            </div>

            {/* MODAL ERROR */}
            {error && (
              <div className="qr-alert qr-error">
                {error}
              </div>
            )}

            {/* FORM */}
            <form
              className="qr-form"
              onSubmit={handleSubmit}
            >

              <div className="qr-form-group">

                <label>
                  Button Label
                </label>

                <input
                  type="text"
                  name="label"
                  value={form.label}
                  onChange={handleChange}
                  placeholder="e.g. Our Services"
                  maxLength={255}
                />

              </div>

              <div className="qr-form-group">

                <label>
                  Message
                </label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Message sent to the chatbot..."
                  rows="4"
                />

              </div>

              <div className="qr-form-grid">

                <div className="qr-form-group">

                  <label>
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="general"
                  />

                </div>

                <div className="qr-form-group">

                  <label>
                    Sort Order
                  </label>

                  <input
                    type="number"
                    name="sort_order"
                    value={form.sort_order}
                    onChange={handleChange}
                    min="0"
                  />

                </div>

              </div>

              <label className="qr-checkbox">

                <input
                  type="checkbox"
                  name="is_active"
                  checked={
                    Number(form.is_active) === 1
                  }
                  onChange={handleChange}
                />

                <span>
                  Active
                </span>

              </label>

              {/* FORM ACTIONS */}
              <div className="qr-form-actions">

                <button
                  type="button"
                  className="qr-cancel-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="qr-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Quick Reply"
                    : "Add Quick Reply"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}