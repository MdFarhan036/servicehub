import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import API from "../../services/api";
import "./ChatbotFAQs.css";

export default function ChatbotFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);

  const [form, setForm] = useState({
    question: "",
    answer: "",
    category: "general",
    keywords: "",
    is_active: 1,
  });

  // ----------------------------------------
  // FETCH FAQS
  // ----------------------------------------

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

  // ----------------------------------------
  // FORM CHANGE
  // ----------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ----------------------------------------
  // OPEN ADD
  // ----------------------------------------

  const openAdd = () => {
    setEditingFaq(null);

    setForm({
      question: "",
      answer: "",
      category: "general",
      keywords: "",
      is_active: 1,
    });

    setShowModal(true);
  };

  // ----------------------------------------
  // OPEN EDIT
  // ----------------------------------------

  const openEdit = (faq) => {
    setEditingFaq(faq);

    setForm({
      question: faq.question || "",
      answer: faq.answer || "",
      category: faq.category || "general",
      keywords: faq.keywords || "",
      is_active: faq.is_active ?? 1,
    });

    setShowModal(true);
  };

  // ----------------------------------------
  // SAVE FAQ
  // ----------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.question.trim() || !form.answer.trim()) {
      alert("Question and answer are required.");
      return;
    }

    try {
      if (editingFaq) {
        await API.put(
          `/chatbot/faqs/${editingFaq.id}`,
          form
        );
      } else {
        await API.post(
          "/chatbot/faqs",
          form
        );
      }

      setShowModal(false);
      fetchFaqs();

    } catch (error) {
      console.error("Failed to save FAQ:", error);

      alert(
        error.response?.data?.message ||
        "Failed to save FAQ"
      );
    }
  };

  // ----------------------------------------
  // DELETE
  // ----------------------------------------

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this FAQ?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/chatbot/faqs/${id}`);

      fetchFaqs();

    } catch (error) {
      console.error("Failed to delete FAQ:", error);

      alert("Failed to delete FAQ");
    }
  };

  // ----------------------------------------
  // SEARCH
  // ----------------------------------------

  const filteredFaqs = faqs.filter((faq) => {
    const value = search.toLowerCase();

    return (
      faq.question?.toLowerCase().includes(value) ||
      faq.answer?.toLowerCase().includes(value) ||
      faq.category?.toLowerCase().includes(value) ||
      faq.keywords?.toLowerCase().includes(value)
    );
  });

  return (
    <div className="chatbot-admin-page">

      {/* HEADER */}

      <div className="chatbot-admin-header">

        <div>
          <h2>Chatbot FAQs</h2>
          <p>
            Manage questions and answers used by the chatbot.
          </p>
        </div>

        <button
          className="chatbot-add-btn"
          onClick={openAdd}
        >
          <FiPlus />
          Add FAQ
        </button>

      </div>

      {/* TOOLBAR */}

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

      </div>

      {/* TABLE */}

      <div className="chatbot-faq-card">

        {loading ? (
          <div className="chatbot-table-loading">
            Loading FAQs...
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="chatbot-empty">
            No FAQs found.
          </div>
        ) : (

          <div className="chatbot-table-wrapper">

            <table className="chatbot-faq-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Question</th>
                  <th>Category</th>
                  <th>Keywords</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredFaqs.map((faq, index) => (

                  <tr key={faq.id}>

                    <td>
                      {index + 1}
                    </td>

                    <td>
                      <div className="faq-question">
                        {faq.question}
                      </div>

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
                      {faq.priority ?? 0}
                    </td>

                    <td>

                      <div className="faq-actions">

                        <button
                          className="faq-edit-btn"
                          onClick={() =>
                            openEdit(faq)
                          }
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          className="faq-delete-btn"
                          onClick={() =>
                            handleDelete(faq.id)
                          }
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

        <div className="chatbot-modal-overlay">

          <div className="chatbot-modal">

            <div className="chatbot-modal-header">

              <h3>
                {editingFaq
                  ? "Edit FAQ"
                  : "Add FAQ"}
              </h3>

              <button
                onClick={() =>
                  setShowModal(false)
                }
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="chatbot-faq-form"
            >

              <div className="form-group">

                <label>
                  Question
                </label>

                <input
                  type="text"
                  name="question"
                  value={form.question}
                  onChange={handleChange}
                  placeholder="Enter question"
                />

              </div>

              <div className="form-group">

                <label>
                  Answer
                </label>

                <textarea
                  name="answer"
                  value={form.answer}
                  onChange={handleChange}
                  placeholder="Enter chatbot answer"
                  rows="5"
                />

              </div>

              <div className="form-row">

                <div className="form-group">

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

                <div className="form-group">

                  <label>
                    Keywords
                  </label>

                  <input
                    type="text"
                    name="keywords"
                    value={form.keywords}
                    onChange={handleChange}
                    placeholder="price, booking, service"
                  />

                </div>

              </div>

              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  name="is_active"
                  value={form.is_active}
                  onChange={handleChange}
                >
                  <option value={1}>
                    Active
                  </option>

                  <option value={0}>
                    Inactive
                  </option>
                </select>

              </div>

              <div className="chatbot-modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                >
                  {editingFaq
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