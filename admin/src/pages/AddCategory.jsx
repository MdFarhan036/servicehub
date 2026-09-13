import { useEffect, useState } from "react";
import API from "../services/api";
import {
  useNavigate,
  useParams
} from "react-router-dom";
import { Helmet } from "react-helmet-async";

/* SLUG GENERATOR */
const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

const BASE_URL =
  import.meta.env
    .VITE_BASE_URL ||
  "http://localhost:5000";

export default function AddCategory() {
  const [form, setForm] =
    useState({
      name: "",
      slug: "",
      description: "",
      meta_title: "",
      meta_description:
        "",
      meta_keywords:
        "",
      canonical_url:
        ""
    });

  const [image, setImage] =
    useState(null);

  const [preview,
    setPreview] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  const navigate =
    useNavigate();

  const { id } =
    useParams();

  /* LOAD EDIT DATA */
  useEffect(() => {
    if (!id) return;

    const load =
      async () => {
        try {
          setLoading(
            true
          );

          const res =
            await API.get(
              `/categories/${id}`
            );

          setForm(
            res.data
          );

          if (
            res.data
              .image
          ) {
            setPreview(
              `${BASE_URL}${res.data.image}`
            );
          }

        } catch (
          err
        ) {
          console.log(
            err
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    load();
  }, [id]);

  /* AUTO SLUG */
  const handleNameChange =
    (e) => {
      const name =
        e.target
          .value;

      setForm({
        ...form,
        name,
        slug:
          slugify(
            name
          ),
        meta_title:
          name
      });
    };

  /* TEXT INPUT */
  const handleChange =
    (e) => {
      setForm({
        ...form,
        [e.target.name]:
          e.target
            .value
      });
    };

  /* IMAGE */
  const handleImage =
    (e) => {
      const file =
        e.target
          .files[0];

      if (
        file
      ) {
        setImage(
          file
        );

        setPreview(
          URL.createObjectURL(
            file
          )
        );
      }
    };

  /* SAVE */
  const save =
    async () => {
      if (
        !form.name.trim()
      ) {
        alert(
          "Category name required"
        );
        return;
      }

      try {
        const formData =
          new FormData();

        Object.keys(
          form
        ).forEach(
          (key) => {
            formData.append(
              key,
              form[
                key
              ]
            );
          }
        );

        if (
          image
        ) {
          formData.append(
            "image",
            image
          );
        }

        if (id) {
          await API.put(
            `/categories/${id}`,
            formData
          );
        } else {
          await API.post(
            "/categories",
            formData
          );
        }

        alert(
          `Category ${
            id
              ? "updated"
              : "created"
          } successfully`
        );

        navigate(
          "/categories"
        );

      } catch (
        err
      ) {
        console.log(
          err
        );
        alert(
          "Save failed"
        );
      }
    };

  if (loading) {
    return (
      <div className="loader">
        Loading...
      </div>
    );
  }

  return (
    <div className="page">
      <Helmet>
        <title>
          {id
            ? "Edit Category"
            : "Add Category"}
        </title>
      </Helmet>

      <div className="page-header">
        <h1>
          {id
            ? "Edit Category"
            : "Add Category"}
        </h1>
      </div>

      <div className="card-form">

        {/* NAME */}
        <div className="form-group">
          <label>
            Category Name
          </label>

          <input
            value={
              form.name
            }
            onChange={
              handleNameChange
            }
            placeholder="Category name"
          />
        </div>

        {/* SLUG */}
        <div className="form-group">
          <label>
            Slug
          </label>

          <input
            name="slug"
            value={
              form.slug
            }
            onChange={
              handleChange
            }
          />
        </div>

        {/* IMAGE */}
        <div className="form-group">
          <label>
            Category Image
          </label>

          <input
            type="file"
            onChange={
              handleImage
            }
          />

          {preview && (
            <img
              src={
                preview
              }
              alt="preview"
              style={{
                width:
                  "120px",
                marginTop:
                  "10px",
                borderRadius:
                  "10px"
              }}
            />
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="form-group">
          <label>
            Description
          </label>

          <textarea
            name="description"
            value={
              form.description
            }
            onChange={
              handleChange
            }
            rows="5"
            placeholder="Category description"
          />
        </div>

        {/* SEO */}
        <h3>
          SEO Settings
        </h3>

        <div className="form-group">
          <label>
            Meta Title
          </label>

          <input
            name="meta_title"
            value={
              form.meta_title
            }
            onChange={
              handleChange
            }
          />
        </div>

        <div className="form-group">
          <label>
            Meta Description
          </label>

          <textarea
            name="meta_description"
            value={
              form.meta_description
            }
            onChange={
              handleChange
            }
          />
        </div>

        <div className="form-group">
          <label>
            Meta Keywords
          </label>

          <input
            name="meta_keywords"
            value={
              form.meta_keywords
            }
            onChange={
              handleChange
            }
          />
        </div>

        <div className="form-group">
          <label>
            Canonical URL
          </label>

          <input
            name="canonical_url"
            value={
              form.canonical_url
            }
            onChange={
              handleChange
            }
          />
        </div>

        {/* ACTIONS */}
        <div className="form-actions">
          <button
            className="btn-primary"
            onClick={
              save
            }
          >
            Save
          </button>

          <button
            className="btn-secondary"
            onClick={() =>
              navigate(-1)
            }
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}