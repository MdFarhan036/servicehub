import { useEffect, useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSearch,
} from "react-icons/fi";
import API from "../services/api";
import "./ChatbotManagement.css";

export default function ChatbotManagement() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    question: "",
    answer: "",
    category: "general",
    keywords: "",
    is_active: 1,
  });

  // --------------------------------------------------
  // FETCH FAQS
  // --------------------------------------------------

  const fetchFaqs = async () => {
    try {
      setLoading(true);

      const response = await API.get("/chatbot/faqs");

      setFaqs(response.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
            ? 1
            : 0
          : value,
    }));
  };

  // --------------------------------------------------
  // OPEN ADD
  // --------------------------------------------------

  const openAddModal = () => {
    setEditingId(null);

    setForm({
      question: "",
      answer: "",
      category: "general",
      keywords: "",
      is_active: 1,
    });

    setShowModal(true);
  };

  // --------------------------------------------------
  // OPEN EDIT
  // --------------------------------------------------

  const openEditModal = (faq) => {
    setEditingId(faq.id);

    setForm({
      question: faq.question || "",
      answer: faq.answer || "",
      category: faq.category || "general",
      keywords: faq.keywords || "",
      is_active: faq.is_active ?? 1,
    });

    setShowModal(true);
  };

  // --------------------------------------------------
  // SAVE
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.question.trim() || !form.answer.trim()) {
      alert("Question and answer are required.");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await API.put(
          `/chatbot/faqs/${editingId}`,
          form
        );
      } else {
        await API.post(
          "/chatbot/faqs",
          form
        );
      }

      setShowModal(false);
      setEditingId(null);

      await fetchFaqs();
    } catch (error) {
      console.error("Failed to save FAQ:", error);

      alert(
        error.response?.data?.message ||
          "Failed to save FAQ"
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this FAQ?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/chatbot/faqs/${id}`);

      setFaqs((prev) =>
        prev.filter((faq) => faq.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete FAQ:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete FAQ"
      );
    }
  };

  // --------------------------------------------------
  // FILTER
  // --------------------------------------------------

  const filteredFaqs = faqs.filter((faq) => {
    const searchText = search.toLowerCase();

    return (
      faq.question
        ?.toLowerCase()
        .includes(searchText) ||
      faq.answer
        ?.toLowerCase()
        .includes(searchText) ||
      faq.category
        ?.toLowerCase()
        .includes(searchText) ||
      faq.keywords
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="chatbot-management">

      {/* HEADER */}

      <div className="chatbot-management-header">

        <div>
          <h1>Chatbot Management</h1>

          <p>
            Manage chatbot FAQs and responses.
          </p>
        </div>

        <button
          className="chatbot-add-btn"
          onClick={openAddModal}
        >
          <FiPlus />
          Add FAQ
        </button>

      </div>

      {/* SEARCH */}

      <div className="chatbot-toolbar">

        <div className="chatbot-search">

          <FiSearch />

          <input
            type="text"
            placeholder="Search FAQs..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="chatbot-count">
          {filteredFaqs.length} FAQ
          {filteredFaqs.length !== 1 ? "s" : ""}
        </div>

      </div>

      {/* TABLE */}

      <div className="chatbot-table-card">

        {loading ? (
          <div className="chatbot-empty">
            Loading FAQs...
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="chatbot-empty">
            <p>No FAQs found.</p>

            <button
              className="chatbot-empty-btn"
              onClick={openAddModal}
            >
              <FiPlus />
              Add First FAQ
            </button>
          </div>
        ) : (
          <div className="chatbot-table-wrapper">

            <table className="chatbot-table">

              <thead>
                <tr>
                  <th>Question</th>
                  <th>Answer</th>
                  <th>Category</th>
                  <th>Keywords</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredFaqs.map((faq) => (
                  <tr key={faq.id}>

                    <td>
                      <div className="faq-question">
                        {faq.question}
                      </div>
                    </td>

                    <td>
                      <div className="faq-answer">
                        {faq.answer}
                      </div>
                    </td>

                    <td>
                      <span className="faq-category">
                        {faq.category || "general"}
                      </span>
                    </td>

                    <td>
                      <div className="faq-keywords">
                        {faq.keywords || "-"}
                      </div>
                    </td>

                    <td>
                      <span
                        className={
                          faq.is_active
                            ? "faq-status active"
                            : "faq-status inactive"
                        }
                      >
                        {faq.is_active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td>

                      <div className="faq-actions">

                        <button
                          className="faq-edit-btn"
                          onClick={() =>
                            openEditModal(faq)
                          }
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          className="faq-delete-btn"
                          onClick={() =>
                            handleDelete(faq.id)
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
          className="chatbot-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget &&
              !saving
            ) {
              setShowModal(false);
            }
          }}
        >

          <div className="chatbot-modal">

            {/* MODAL HEADER */}

            <div className="chatbot-modal-header">

              <div>
                <h2>
                  {editingId
                    ? "Edit FAQ"
                    : "Add FAQ"}
                </h2>

                <p>
                  Configure the chatbot response.
                </p>
              </div>

              <button
                type="button"
                className="chatbot-modal-close"
                onClick={() =>
                  !saving &&
                  setShowModal(false)
                }
              >
                <FiX />
              </button>

            </div>

            {/* FORM */}

            <form
              className="chatbot-form"
              onSubmit={handleSubmit}
            >

              <div className="chatbot-form-group">

                <label>
                  Question
                </label>

                <input
                  type="text"
                  name="question"
                  value={form.question}
                  onChange={handleChange}
                  placeholder="Enter chatbot question"
                  required
                />

              </div>

              <div className="chatbot-form-group">

                <label>
                  Answer
                </label>

                <textarea
                  name="answer"
                  value={form.answer}
                  onChange={handleChange}
                  placeholder="Enter chatbot answer"
                  rows="5"
                  required
                />

              </div>

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

                <div className="chatbot-form-group">

                  <label>
                    Keywords
                  </label>

                  <input
                    type="text"
                    name="keywords"
                    value={form.keywords}
                    onChange={handleChange}
                    placeholder="booking, service, price"
                  />

                </div>

              </div>

              <label className="chatbot-active-toggle">

                <input
                  type="checkbox"
                  name="is_active"
                  checked={Boolean(form.is_active)}
                  onChange={handleChange}
                />

                <span>
                  Active FAQ
                </span>

              </label>

              {/* FOOTER */}

              <div className="chatbot-modal-footer">

                <button
                  type="button"
                  className="chatbot-cancel-btn"
                  disabled={saving}
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="chatbot-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update FAQ"
                    : "Add FAQ"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}