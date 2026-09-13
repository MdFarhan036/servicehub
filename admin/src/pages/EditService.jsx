import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import "./serviceForm.css";

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    category_id: "",
    city: "",
    is_popular: 0,
    is_daily_deal: 0,
    daily_deal_price: "",
  });

  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  /* =========================================
     IMAGE URL
  ========================================= */

  const BASE_URL = (
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api"
  ).replace("/api", "");

  const getImageUrl = (img) => {
    if (!img) return "/placeholder.jpg";

    if (img.startsWith("http")) {
      return img;
    }

    return `${BASE_URL}${img.startsWith("/") ? "" : "/"}${img}`;
  };

  /* =========================================
     LOAD SERVICE
  ========================================= */

  const loadService = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/services/${id}`);

      const service = res.data;

      setFormData({
        title: service.title || "",
        slug: service.slug || "",
        description: service.description || "",
        price: service.price || "",
        category_id: service.category_id || "",
        city: service.city || "",
        is_popular: Number(service.is_popular) || 0,
        is_daily_deal: Number(service.is_daily_deal) || 0,
        daily_deal_price:
          service.daily_deal_price || "",
      });

      /*
       * HANDLE MULTIPLE IMAGE STRUCTURES
       */

      let serviceImages = [];

      if (Array.isArray(service.images)) {
        serviceImages = service.images;
      } else if (service.image) {
        serviceImages = [service.image];
      }

      setImages(
        serviceImages.map((image, index) => ({
          id:
            image?.id ||
            image?.image_id ||
            index,
          path:
            typeof image === "string"
              ? image
              : image?.image ||
                image?.image_url ||
                image?.path ||
                "",
        }))
      );
    } catch (err) {
      console.error(
        "Failed to load service:",
        err
      );

      alert("Failed to load service");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     LOAD CATEGORIES
  ========================================= */

  const loadCategories = async () => {
    try {
      const res =
        await API.get("/categories");

      setCategories(res.data || []);
    } catch (err) {
      console.error(
        "Failed to load categories:",
        err
      );
    }
  };

  useEffect(() => {
    loadService();
    loadCategories();
  }, [id]);

  /* =========================================
     CHANGE FORM
  ========================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================
     NEW IMAGES
  ========================================= */

  const handleImageChange = (e) => {
    const files = Array.from(
      e.target.files || []
    );

    setNewImages((prev) => [
      ...prev,
      ...files,
    ]);
  };

  /* =========================================
     REMOVE NEW IMAGE
  ========================================= */

  const removeNewImage = (index) => {
    setNewImages((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  /* =========================================
     DELETE EXISTING IMAGE
  ========================================= */

  const deleteImage = async (image) => {
    if (
      !window.confirm(
        "Delete this image?"
      )
    ) {
      return;
    }

    try {
      /*
       * IMPORTANT:
       * Backend should provide:
       *
       * DELETE /services/:serviceId/images/:imageId
       */

      await API.delete(
        `/services/${id}/images/${image.id}`
      );

      setImages((prev) =>
        prev.filter(
          (img) =>
            img.id !== image.id
        )
      );

    } catch (err) {
      console.error(
        "Delete image error:",
        err
      );

      alert(
        err.response?.data?.msg ||
          "Failed to delete image"
      );
    }
  };

  /* =========================================
     SAVE SERVICE
  ========================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      /*
       * SERVICE DETAILS
       */

      const serviceData = {
        title: formData.title,
        slug: formData.slug,
        description:
          formData.description,
        price: formData.price,
        category_id:
          formData.category_id,
        city: formData.city,
        is_popular:
          Number(formData.is_popular),
        is_daily_deal:
          Number(formData.is_daily_deal),
        daily_deal_price:
          formData.daily_deal_price,
      };

      await API.put(
        `/services/${id}`,
        serviceData
      );

      /*
       * NEW IMAGES
       */

      if (newImages.length > 0) {
        const imageData =
          new FormData();

        newImages.forEach(
          (file) => {
            imageData.append(
              "images",
              file
            );
          }
        );

        await API.post(
          `/services/${id}/images`,
          imageData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );
      }

      alert(
        "Service updated successfully"
      );

      navigate("/services");

    } catch (err) {
      console.error(
        "Update service error:",
        err
      );

      alert(
        err.response?.data?.msg ||
          "Failed to update service"
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
      <div className="page">
        <div className="loader">
          Loading service...
        </div>
      </div>
    );
  }

  /* =========================================
     UI
  ========================================= */

  return (
    <div className="page">

      {/* HEADER */}

      <div className="page-header">

        <h1>
          Edit Service
        </h1>

        <button
          type="button"
          className="btn-secondary"
          onClick={() =>
            navigate("/services")
          }
        >
          ← Back
        </button>

      </div>

      <div className="card-form">

        <form
          onSubmit={handleSubmit}
        >

          {/* =================================
              BASIC DETAILS
          ================================= */}

          <div className="form-section">

            <h2>
              Service Details
            </h2>

            <div className="form-grid">

              {/* TITLE */}

              <div className="form-group">

                <label>
                  Service Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={
                    formData.title
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

              {/* SLUG */}

              <div className="form-group">

                <label>
                  Slug
                </label>

                <input
                  type="text"
                  name="slug"
                  value={
                    formData.slug
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              {/* PRICE */}

              <div className="form-group">

                <label>
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={
                    formData.price
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

              {/* CITY */}

              <div className="form-group">

                <label>
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={
                    formData.city
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              {/* CATEGORY */}

              <div className="form-group">

                <label>
                  Category
                </label>

                <select
                  name="category_id"
                  value={
                    formData.category_id
                  }
                  onChange={
                    handleChange
                  }
                >

                  <option value="">
                    Select Category
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={
                          category.id
                        }
                        value={
                          category.id
                        }
                      >
                        {
                          category.name
                        }
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* POPULAR */}

              <div className="form-group">

                <label>
                  Popular Service
                </label>

                <select
                  name="is_popular"
                  value={
                    formData.is_popular
                  }
                  onChange={
                    handleChange
                  }
                >

                  <option value={0}>
                    No
                  </option>

                  <option value={1}>
                    Yes
                  </option>

                </select>

              </div>

              {/* DAILY DEAL */}

              <div className="form-group">

                <label>
                  Daily Deal
                </label>

                <select
                  name="is_daily_deal"
                  value={
                    formData.is_daily_deal
                  }
                  onChange={
                    handleChange
                  }
                >

                  <option value={0}>
                    No
                  </option>

                  <option value={1}>
                    Yes
                  </option>

                </select>

              </div>

              {/* DEAL PRICE */}

              <div className="form-group">

                <label>
                  Daily Deal Price
                </label>

                <input
                  type="number"
                  name="daily_deal_price"
                  value={
                    formData.daily_deal_price
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    Number(
                      formData.is_daily_deal
                    ) !== 1
                  }
                />

              </div>

            </div>

          </div>

          {/* =================================
              DESCRIPTION
          ================================= */}

          <div className="form-section">

            <h2>
              Description
            </h2>

            <div className="form-group">

              <textarea
                name="description"
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
                rows="10"
              />

            </div>

          </div>

          {/* =================================
              EXISTING IMAGES
          ================================= */}

          <div className="form-section">

            <h2>
              Service Images
            </h2>

            {images.length > 0 ? (

              <div className="image-grid">

                {images.map(
                  (image) => (

                    <div
                      className="image-item"
                      key={
                        image.id
                      }
                    >

                      <img
                        src={getImageUrl(
                          image.path
                        )}
                        alt="Service"
                        onError={(
                          e
                        ) => {
                          e.currentTarget.onerror =
                            null;

                          e.currentTarget.src =
                            "/placeholder.jpg";
                        }}
                      />

                      <button
                        type="button"
                        className="image-delete-btn"
                        onClick={() =>
                          deleteImage(
                            image
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  )
                )}

              </div>

            ) : (

              <p>
                No images uploaded.
              </p>

            )}

          </div>

          {/* =================================
              ADD NEW IMAGES
          ================================= */}

          <div className="form-section">

            <h2>
              Add New Images
            </h2>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={
                handleImageChange
              }
            />

            {newImages.length >
              0 && (

              <div className="image-grid">

                {newImages.map(
                  (
                    file,
                    index
                  ) => (

                    <div
                      className="image-item"
                      key={
                        index
                      }
                    >

                      <img
                        src={URL.createObjectURL(
                          file
                        )}
                        alt={
                          file.name
                        }
                      />

                      <button
                        type="button"
                        className="image-delete-btn"
                        onClick={() =>
                          removeNewImage(
                            index
                          )
                        }
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
              ACTIONS
          ================================= */}

          <div className="form-actions">

            <button
              type="button"
              className="btn-secondary"
              onClick={() =>
                navigate(
                  "/services"
                )
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}