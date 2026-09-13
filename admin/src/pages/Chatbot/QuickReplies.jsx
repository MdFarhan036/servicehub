import { useEffect, useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiMessageCircle,
} from "react-icons/fi";
import API from "../../services/api";
import "./QuickReplies.css";

export default function QuickReplies() {
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

  // --------------------------------------------------
  // FETCH QUICK REPLIES
  // --------------------------------------------------

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

  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  function resetForm() {
    setForm({
      label: "",
      message: "",
      category: "general",
      is_active: 1,
      sort_order: 0,
    });

    setEditingId(null);
  }

  function openAddModal() {
    resetForm();
    setShowModal(true);
  }

  function openEditModal(item) {
    setEditingId(item.id);

    setForm({
      label: item.label || "",
      message: item.message || "",
      category: item.category || "general",
      is_active: item.is_active ?? 1,
      sort_order: item.sort_order ?? 0,
    });

    setShowModal(true);
  }

  function closeModal() {
    if (saving) return;

    setShowModal(false);
    resetForm();
  }

  function handleChange(e) {
    const { name, value, type, checked } =
      e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
            ? 1
            : 0
          : value,
    }));
  }

  // --------------------------------------------------
  // SAVE
  // --------------------------------------------------

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
      resetForm();

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

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

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

  // --------------------------------------------------
  // TOGGLE STATUS
  // --------------------------------------------------

  async function toggleStatus(item) {
    try {
      setError("");
      setSuccess("");

      await API.put(
        `/chatbot/quick-replies/${item.id}`,
        {
          label: item.label,
          message: item.message,
          category: item.category || "general",
          is_active: item.is_active ? 0 : 1,
          sort_order: item.sort_order || 0,
        }
      );

      setSuccess(
        "Quick reply status updated."
      );

      await fetchQuickReplies();

    } catch (err) {
      console.error(
        "Toggle quick reply error:",
        err
      );

      setError(
        "Failed to update quick reply status."
      );
    }
  }

  return (
    <div className="chatbot-management-page">

      {/* HEADER */}
      <div className="chatbot-page-header">

        <div>
          <h1>Quick Replies</h1>

          <p>
            Manage the quick reply options
            shown in the customer chatbot.
          </p>
        </div>

        <button
          className="chatbot-primary-btn"
          onClick={openAddModal}
        >
          <FiPlus />
          Add Quick Reply
        </button>

      </div>

      {/* ALERTS */}

      {error && (
        <div className="chatbot-alert chatbot-alert-error">
          {error}

          <button
            onClick={() => setError("")}
          >
            <FiX />
          </button>
        </div>
      )}

      {success && (
        <div className="chatbot-alert chatbot-alert-success">
          <FiCheck />

          <span>{success}</span>

          <button
            onClick={() => setSuccess("")}
          >
            <FiX />
          </button>
        </div>
      )}

      {/* CONTENT */}

      <div className="chatbot-card">

        <div className="chatbot-card-header">

          <div className="chatbot-card-title">
            <FiMessageCircle />

            <div>
              <h2>Quick Reply Options</h2>

              <span>
                {quickReplies.length} options
              </span>
            </div>
          </div>

        </div>

        {/* LOADING */}

        {loading ? (
          <div className="chatbot-table-loading">
            Loading quick replies...
          </div>
        ) : quickReplies.length === 0 ? (
          <div className="chatbot-empty-state">

            <FiMessageCircle />

            <h3>
              No quick replies found
            </h3>

            <p>
              Add your first quick reply
              for the chatbot.
            </p>

            <button
              className="chatbot-primary-btn"
              onClick={openAddModal}
            >
              <FiPlus />
              Add Quick Reply
            </button>

          </div>
        ) : (
          <div className="chatbot-table-wrapper">

            <table className="chatbot-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Label</th>
                  <th>Message</th>
                  <th>Category</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {quickReplies.map(
                  (item, index) => (
                    <tr key={item.id}>

                      <td>
                        {index + 1}
                      </td>

                      <td>
                        <div className="quick-reply-label">
                          {item.label}
                        </div>
                      </td>

                      <td>
                        <div className="quick-reply-message">
                          {item.message}
                        </div>
                      </td>

                      <td>
                        <span className="quick-reply-category">
                          {item.category ||
                            "general"}
                        </span>
                      </td>

                      <td>
                        {item.sort_order}
                      </td>

                      <td>

                        <button
                          className={
                            item.is_active
                              ? "status-badge active"
                              : "status-badge inactive"
                          }
                          onClick={() =>
                            toggleStatus(item)
                          }
                        >
                          {item.is_active
                            ? "Active"
                            : "Inactive"}
                        </button>

                      </td>

                      <td>

                        <div className="quick-reply-actions">

                          <button
                            className="edit-btn"
                            title="Edit"
                            onClick={() =>
                              openEditModal(item)
                            }
                          >
                            <FiEdit2 />
                          </button>

                          <button
                            className="delete-btn"
                            title="Delete"
                            onClick={() =>
                              handleDelete(
                                item.id
                              )
                            }
                          >
                            <FiTrash2 />
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* MODAL */}

      {showModal && (
        <div
          className="chatbot-modal-overlay"
          onMouseDown={closeModal}
        >

          <div
            className="chatbot-modal"
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >

            <div className="chatbot-modal-header">

              <div>
                <h2>
                  {editingId
                    ? "Edit Quick Reply"
                    : "Add Quick Reply"}
                </h2>

                <p>
                  Configure the chatbot
                  quick reply option.
                </p>
              </div>

              <button
                className="modal-close-btn"
                onClick={closeModal}
              >
                <FiX />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="chatbot-form"
            >

              {/* LABEL */}

              <div className="chatbot-form-group">

                <label>
                  Label
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="label"
                  value={form.label}
                  onChange={handleChange}
                  placeholder="e.g. Book a Service"
                  maxLength={255}
                />

              </div>

              {/* MESSAGE */}

              <div className="chatbot-form-group">

                <label>
                  Message
                  <span>*</span>
                </label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Message sent to the chatbot"
                  rows={4}
                  maxLength={500}
                />

              </div>

              {/* CATEGORY */}

              <div className="chatbot-form-row">

                <div className="chatbot-form-group">

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

                {/* SORT ORDER */}

                <div className="chatbot-form-group">

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

              {/* ACTIVE */}

              <label className="chatbot-checkbox">

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

              {/* ACTIONS */}

              <div className="chatbot-modal-actions">

                <button
                  type="button"
                  className="chatbot-secondary-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="chatbot-primary-btn"
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