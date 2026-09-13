import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function BlogForm() {
  const navigate = useNavigate();

  const [categories, setCategories] =
    useState([]);

  const [form, setForm] =
    useState({
      title: "",
      slug: "",
      category: "",
      author: "Admin",
      short_description: "",
      content: "",
      publish_date:
        new Date()
          .toISOString()
          .split("T")[0],
      is_featured: 0,
      image: null,
      seo_title: "",
      seo_description: "",
      seo_keywords: ""
    });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories =
    async () => {
      try {
        const res =
          await api.get(
            "/categories"
          );

        setCategories(
          res.data || []
        );
      } catch (err) {
        console.log(err);
      }
    };

  const generateSlug = (
    text
  ) => {
    return text
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        "-"
      )
      .replace(
        /(^-|-$)/g,
        ""
      );
  };

  const handleChange = (
    e
  ) => {
    const {
      name,
      value,
      type,
      checked
    } = e.target;

    let updatedForm = {
      ...form,
      [name]:
        type === "checkbox"
          ? checked
            ? 1
            : 0
          : value
    };

    if (
      name === "title"
    ) {
      updatedForm.slug =
        generateSlug(
          value
        );

      if (
        !form.seo_title
      ) {
        updatedForm.seo_title =
          value;
      }
    }

    setForm(
      updatedForm
    );
  };

  const save = async () => {
    try {
      const fd =
        new FormData();

      Object.keys(
        form
      ).forEach(
        (key) => {
          if (
            form[key] !== null
          ) {
            fd.append(
              key,
              form[key]
            );
          }
        }
      );

      await api.post(
        "/admin/blogs",
        fd
      );

      navigate(
        "/admin/blogs"
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="form-page">
      <h2>Add Blog</h2>

      <input
        name="title"
        placeholder="Blog Title"
        value={form.title}
        onChange={handleChange}
      />

      <input
        value={form.slug}
        readOnly
        placeholder="Auto Slug"
      />

      {/* CATEGORY DROPDOWN */}
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
      >
        <option value="">
          Select Category
        </option>

        {categories.map(
          (cat) => (
            <option
              key={cat.id}
              value={cat.name}
            >
              {cat.name}
            </option>
          )
        )}
      </select>

      <input
        name="author"
        value={form.author}
        onChange={handleChange}
      />

      <input
        type="date"
        name="publish_date"
        value={form.publish_date}
        onChange={handleChange}
      />

      <input
        type="file"
        onChange={(e) =>
          setForm({
            ...form,
            image:
              e.target.files[0]
          })
        }
      />

      <textarea
        name="short_description"
        placeholder="Short Description"
        value={form.short_description}
        onChange={handleChange}
      />

      {/* HTML CONTENT */}
      <textarea
        name="content"
        placeholder="Write full blog HTML content here"
        value={form.content}
        onChange={handleChange}
        rows="10"
      />

      <label>
        <input
          type="checkbox"
          name="is_featured"
          checked={form.is_featured}
          onChange={handleChange}
        />
        Featured Blog
      </label>

      <h3>SEO Settings</h3>

      <input
        name="seo_title"
        value={form.seo_title}
        onChange={handleChange}
        placeholder="SEO Title"
      />

      <textarea
        name="seo_description"
        value={form.seo_description}
        onChange={handleChange}
        placeholder="SEO Description"
      />

      <input
        name="seo_keywords"
        value={form.seo_keywords}
        onChange={handleChange}
        placeholder="SEO Keywords"
      />

      <button onClick={save}>
        Save Blog
      </button>
    </div>
  );
}