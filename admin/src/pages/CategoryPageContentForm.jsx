import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const initialForm = {
  category_id: "",
  about_title: "",
  about_description: "",
  why_choose_title: "",
  why_choose_description: "",
  faq_question_1: "",
  faq_answer_1: "",
  faq_question_2: "",
  faq_answer_2: "",
  seo_title: "",
  seo_description: "",
  seo_keywords: ""
};

export default function CategoryPageContentForm() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const loadExistingContent = async (categoryId) => {
    try {
      const res = await api.get(
        `/category-page/${categoryId}`
      );

      if (res.data) {
        setForm({
          ...initialForm,
          ...res.data
        });
      } else {
        setForm({
          ...initialForm,
          category_id: categoryId
        });
      }

    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;

    setForm({
      ...initialForm,
      category_id: categoryId
    });

    if (categoryId) {
      loadExistingContent(categoryId);
    }
  };

  const save = async () => {
    if (!form.category_id) {
      alert("Please select category");
      return;
    }

    try {
      setLoading(true);

      await api.post(
        "/category-page",
        form
      );

      alert(
        "Category page content saved successfully"
      );

      navigate(
        "/admin/category-page-content"
      );

    } catch (err) {
      console.log(err);
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <h2>
        Category Page SEO Content
      </h2>

      {/* Category */}
      <div className="form-group">
        <label>Select Category</label>
        <select
          name="category_id"
          value={form.category_id}
          onChange={handleCategoryChange}
        >
          <option value="">
            Select Category
          </option>

          {categories.map((cat) => (
            <option
              key={cat.id}
              value={cat.id}
            >
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* About */}
      <h3>About Section</h3>

      <input
        name="about_title"
        placeholder="About Title"
        value={form.about_title}
        onChange={handleChange}
      />

      <textarea
        name="about_description"
        placeholder="About Description"
        value={form.about_description}
        onChange={handleChange}
      />

      {/* Why Choose */}
      <h3>Why Choose Us</h3>

      <input
        name="why_choose_title"
        placeholder="Why Choose Title"
        value={form.why_choose_title}
        onChange={handleChange}
      />

      <textarea
        name="why_choose_description"
        placeholder="Why Choose Description"
        value={form.why_choose_description}
        onChange={handleChange}
      />

      {/* FAQ */}
      <h3>FAQ Section</h3>

      <input
        name="faq_question_1"
        placeholder="FAQ Question 1"
        value={form.faq_question_1}
        onChange={handleChange}
      />

      <textarea
        name="faq_answer_1"
        placeholder="FAQ Answer 1"
        value={form.faq_answer_1}
        onChange={handleChange}
      />

      <input
        name="faq_question_2"
        placeholder="FAQ Question 2"
        value={form.faq_question_2}
        onChange={handleChange}
      />

      <textarea
        name="faq_answer_2"
        placeholder="FAQ Answer 2"
        value={form.faq_answer_2}
        onChange={handleChange}
      />

      {/* SEO */}
      <h3>SEO Settings</h3>

      <input
        name="seo_title"
        placeholder="SEO Title"
        value={form.seo_title}
        onChange={handleChange}
      />

      <textarea
        name="seo_description"
        placeholder="SEO Description"
        value={form.seo_description}
        onChange={handleChange}
      />

      <input
        name="seo_keywords"
        placeholder="SEO Keywords"
        value={form.seo_keywords}
        onChange={handleChange}
      />

      <button
        onClick={save}
        disabled={loading}
      >
        {loading
          ? "Saving..."
          : "Save Content"}
      </button>
    </div>
  );
}