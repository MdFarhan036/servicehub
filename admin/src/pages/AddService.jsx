import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getImageUrl } from "../utils/imageUrl";

/* =========================================
   SLUG
========================================= */

const slugify = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

/* =========================================
   COMPONENT
========================================= */

export default function AddService() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    price: "",
    category_id: "",
    description: "",

    image: null,
    image_url: "",

    images: [],
    image_urls: [],

    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    canonical_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingImage, setDeletingImage] = useState(null);

  /* =========================================
     LOAD
  ========================================= */

  useEffect(() => {
    fetchCategories();

    if (id) {
      fetchService();
    }
  }, [id]);

  /* =========================================
     FETCH CATEGORIES
  ========================================= */

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");

      setCategories(res.data || []);
    } catch (err) {
      console.error("Categories error:", err);
    }
  };

  /* =========================================
     FETCH SERVICE
  ========================================= */

  const fetchService = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/services/${id}`);

      const data = res.data || {};

      let existingImages = [];

      if (Array.isArray(data.images)) {
        existingImages = data.images;
      } else if (typeof data.images === "string") {
        try {
          existingImages = JSON.parse(data.images);
        } catch {
          existingImages = [];
        }
      }

      if (
        existingImages.length === 0 &&
        data.image
      ) {
        existingImages = [data.image];
      }

      setForm({
        title: data.title || "",
        slug: data.slug || "",
        price: data.price || "",
        category_id: data.category_id || "",
        description: data.description || "",

        image: null,

        image_url:
          data.image_url ||
          data.image ||
          "",

        images: [],

        image_urls: existingImages,

        meta_title:
          data.meta_title ||
          data.title ||
          "",

        meta_description:
          data.meta_description ||
          "",

        meta_keywords:
          data.meta_keywords ||
          "",

        canonical_url:
          data.canonical_url ||
          "",
      });
    } catch (err) {
      console.error(
        "Service loading error:",
        err
      );

      alert("Failed to load service");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     TITLE
  ========================================= */

  const handleTitleChange = (e) => {
    const title = e.target.value;

    setForm((prev) => ({
      ...prev,
      title,
      slug: slugify(title),
      meta_title: title,
    }));
  };

  /* =========================================
     NORMAL INPUT
  ========================================= */

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================
     ADD NEW IMAGES
  ========================================= */

  const handleImagesChange = (e) => {
    const files = Array.from(
      e.target.files || []
    );

    if (!files.length) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        ...files,
      ],
    }));

    e.target.value = "";
  };

  /* =========================================
     REMOVE NEW IMAGE
  ========================================= */

  const removeNewImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter(
        (_, i) => i !== index
      ),
    }));
  };

  /* =========================================
     EXISTING IMAGE PATH
  ========================================= */

  const getExistingImagePath = (image) => {
    if (typeof image === "string") {
      return image;
    }

    return (
      image?.image ||
      image?.image_url ||
      image?.path ||
      ""
    );
  };

  /* =========================================
     DELETE EXISTING IMAGE
  ========================================= */

  const deleteExistingImage = async (
    image,
    index
  ) => {
    if (!id) return;

    if (
      !window.confirm(
        "Are you sure you want to delete this image?"
      )
    ) {
      return;
    }

    try {
      setDeletingImage(index);

      const imagePath =
        getExistingImagePath(image);

      if (!imagePath) {
        alert("Invalid image");
        return;
      }

      /*
       * IMPORTANT
       * Backend route:
       *
       * DELETE /services/:id/image
       */

      await API.delete(
        `/services/${id}/image`,
        {
          data: {
            image: imagePath,
          },
        }
      );

      /*
       * Remove image from UI
       */

      setForm((prev) => ({
        ...prev,
        image_urls:
          prev.image_urls.filter(
            (_, i) => i !== index
          ),
      }));

    } catch (err) {
      console.error(
        "Delete image error:",
        err
      );

      alert(
        err.response?.data?.msg ||
          "Failed to delete image"
      );
    } finally {
      setDeletingImage(null);
    }
  };

  /* =========================================
     SAVE
  ========================================= */

  const save = async () => {
    if (!form.title.trim()) {
      alert("Title required");
      return;
    }

    try {
      setSaving(true);

      const fd = new FormData();

      /* BASIC */

      fd.append("title", form.title);
      fd.append("slug", form.slug);
      fd.append("price", form.price);
      fd.append(
        "category_id",
        form.category_id
      );
      fd.append(
        "description",
        form.description
      );

      /* SEO */

      fd.append(
        "meta_title",
        form.meta_title
      );

      fd.append(
        "meta_description",
        form.meta_description
      );

      fd.append(
        "meta_keywords",
        form.meta_keywords
      );

      fd.append(
        "canonical_url",
        form.canonical_url
      );

      /*
       * EXISTING IMAGES
       *
       * Send only images which
       * still exist.
       */

      fd.append(
        "image_urls",
        JSON.stringify(
          form.image_urls.map(
            getExistingImagePath
          )
        )
      );

      /*
       * NEW IMAGES
       */

      form.images.forEach((file) => {
        fd.append("images", file);
      });

      /* OLD SINGLE IMAGE */

      if (form.image) {
        fd.append(
          "image",
          form.image
        );
      }

      /* API */

      if (isEdit) {
        await API.put(
          `/services/${id}`,
          fd,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );
      } else {
        await API.post(
          "/services",
          fd,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );
      }

      alert(
        isEdit
          ? "Service updated successfully"
          : "Service added successfully"
      );

      navigate("/services");

    } catch (err) {
      console.error(
        "Save service error:",
        err
      );

      alert(
        err.response?.data?.msg ||
          "Save failed"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="loader">
        Loading...
      </div>
    );
  }

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="page">

      <Helmet>
        <title>
          {form.meta_title || "Service"}
        </title>

        <meta
          name="description"
          content={
            form.meta_description
          }
        />
      </Helmet>

      {/* HEADER */}

      <div className="page-header">
        <h1>
          {isEdit
            ? "Edit Service"
            : "Add Service"}
        </h1>
      </div>

      <div className="card-form">

        {/* =================================
            BASIC
        ================================= */}

        <div className="form-group">
          <label>Title</label>

          <input
            value={form.title}
            onChange={
              handleTitleChange
            }
            placeholder="e.g. Website Development"
          />
        </div>

        <div className="form-group">
          <label>Slug</label>

          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Price</label>

          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Category</label>

          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
          >
            <option value="">
              Select Category
            </option>

            {categories.map((c) => (
              <option
                key={c.id}
                value={c.id}
              >
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* =================================
            DESCRIPTION
        ================================= */}

        <div className="form-group">
          <label>
            Description (HTML allowed)
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="<p>Enter HTML here</p>"
            rows={8}
          />
        </div>

        {/* PREVIEW */}

        <div className="form-group">
          <label>Preview</label>

          <div
            className="html-preview"
            style={{
              border:
                "1px solid #ccc",
              padding: "10px",
              minHeight: "80px",
              backgroundColor:
                "#fafafa",
            }}
            dangerouslySetInnerHTML={{
              __html:
                form.description,
            }}
          />
        </div>

        {/* =================================
            EXISTING IMAGES
        ================================= */}

        {isEdit && (
          <div className="form-group">

            <label>
              Existing Images
            </label>

            {form.image_urls?.length >
            0 ? (
              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  flexWrap: "wrap",
                  marginTop: "10px",
                }}
              >
                {form.image_urls.map(
                  (img, i) => {

                    const imagePath =
                      getExistingImagePath(
                        img
                      );

                    return (
                      <div
                        key={`${imagePath}-${i}`}
                        style={{
                          position:
                            "relative",
                          width:
                            "120px",
                        }}
                      >

                        <img
                          src={getImageUrl(
                            imagePath
                          )}
                          alt={`Service ${
                            i + 1
                          }`}
                          onError={(
                            e
                          ) => {
                            e.currentTarget.onerror =
                              null;

                            e.currentTarget.src =
                              "/placeholder.jpg";
                          }}
                          style={{
                            width:
                              "120px",
                            height:
                              "100px",
                            objectFit:
                              "cover",
                            borderRadius:
                              "8px",
                            border:
                              "1px solid #ddd",
                          }}
                        />

                        <button
                          type="button"
                          disabled={
                            deletingImage ===
                            i
                          }
                          onClick={() =>
                            deleteExistingImage(
                              img,
                              i
                            )
                          }
                          style={{
                            marginTop:
                              "6px",
                            width:
                              "100%",
                            padding:
                              "6px",
                            border:
                              "none",
                            borderRadius:
                              "5px",
                            cursor:
                              "pointer",
                            background:
                              "#dc3545",
                            color:
                              "#fff",
                          }}
                        >
                          {deletingImage ===
                          i
                            ? "Deleting..."
                            : "Delete Image"}
                        </button>

                      </div>
                    );
                  }
                )}
              </div>
            ) : (
              <p>
                No existing images
              </p>
            )}

          </div>
        )}

        {/* =================================
            ADD MORE IMAGES
        ================================= */}

        <div className="form-group">

          <label>
            {isEdit
              ? "Add More Images"
              : "Service Images"}
          </label>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={
              handleImagesChange
            }
          />

          {/* NEW IMAGE PREVIEW */}

          {form.images.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap:
                  "wrap",
                gap: "15px",
                marginTop:
                  "15px",
              }}
            >
              {form.images.map(
                (
                  file,
                  index
                ) => (
                  <div
                    key={index}
                    style={{
                      width:
                        "120px",
                    }}
                  >

                    <img
                      src={URL.createObjectURL(
                        file
                      )}
                      alt={
                        file.name
                      }
                      style={{
                        width:
                          "120px",
                        height:
                          "100px",
                        objectFit:
                          "cover",
                        borderRadius:
                          "8px",
                        border:
                          "1px solid #ddd",
                      }}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeNewImage(
                          index
                        )
                      }
                      style={{
                        marginTop:
                          "6px",
                        width:
                          "100%",
                        padding:
                          "6px",
                        border:
                          "none",
                        borderRadius:
                          "5px",
                        cursor:
                          "pointer",
                        background:
                          "#6c757d",
                        color:
                          "#fff",
                      }}
                    >
                      Remove
                    </button>

                  </div>
                )
              )}
            </div>
          )}

        </div>

        {/* =================================
            SEO
        ================================= */}

        <h3
          style={{
            marginTop: 20,
          }}
        >
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
            placeholder={`/service/${form.slug}`}
          />
        </div>

        {/* GOOGLE PREVIEW */}

        <h3
          style={{
            marginTop: 20,
          }}
        >
          Google Preview
        </h3>

        <div className="seo-preview">

          <p className="seo-title">
            {form.meta_title ||
              "Service Title"}
          </p>

          <p className="seo-url">
            {form.canonical_url ||
              `https://yourdomain.com/service/${form.slug}`}
          </p>

          <p className="seo-desc">
            {form.meta_description ||
              "Your service description will appear here..."}
          </p>

        </div>

        {/* ACTIONS */}

        <div className="form-actions">

          <button
            type="button"
            className="btn-primary"
            onClick={save}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : isEdit
              ? "Update Service"
              : "Save"}
          </button>

          <button
            type="button"
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