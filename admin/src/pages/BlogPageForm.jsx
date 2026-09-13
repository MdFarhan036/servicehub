import {
  useEffect,
  useState
} from "react";

import api from "../services/api";
import {
  useNavigate
} from "react-router-dom";

export default function BlogPageForm() {
  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      hero_title: "",
      hero_subtitle:
        "",
      newsletter_title:
        "",
      newsletter_subtitle:
        ""
    });

  useEffect(() => {
    loadData();
  }, []);

  const loadData =
    async () => {
      try {
        const res =
          await api.get(
            "/admin/blog-page"
          );

        if (
          res.data
        ) {
          setForm(
            res.data
          );
        }
      } catch (err) {
        console.log(err);
      }
    };

  const handleChange = (
    e
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    });
  };

  const save = async () => {
    try {
      await api.put(
        "/admin/blog-page",
        form
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
      <h2>
        Edit Blog Page
      </h2>

      <h3>
        Hero Section
      </h3>

      <input
        name="hero_title"
        value={
          form.hero_title
        }
        onChange={
          handleChange
        }
        placeholder="Hero Title"
      />

      <textarea
        name="hero_subtitle"
        value={
          form.hero_subtitle
        }
        onChange={
          handleChange
        }
        placeholder="Hero Subtitle"
      />

      <h3>
        Newsletter Section
      </h3>

      <input
        name="newsletter_title"
        value={
          form.newsletter_title
        }
        onChange={
          handleChange
        }
        placeholder="Newsletter Title"
      />

      <textarea
        name="newsletter_subtitle"
        value={
          form.newsletter_subtitle
        }
        onChange={
          handleChange
        }
        placeholder="Newsletter Subtitle"
      />

      <button
        onClick={save}
      >
        Save
      </button>
    </div>
  );
}