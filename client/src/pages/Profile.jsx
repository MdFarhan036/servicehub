import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { getImageUrl } from "../utils/imageUrl";
import "./profile.css";

export default function Profile() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
    image: "",
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =========================================
     LOAD PROFILE
  ========================================= */

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/auth/customer/profile");

      const profile = res.data || {};

      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
        pincode: profile.pincode || "",
        image: profile.image || "",
      });
    } catch (err) {
      console.error("Profile loading error:", err);

      // Fallback to authenticated user data
      if (user) {
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          pincode: user.pincode || "",
          image: user.image || "",
        });
      }

      setError(
        err.response?.data?.msg ||
        "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  /* =========================================
     HANDLE INPUT
  ========================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================
     IMAGE UPLOAD
  ========================================= */

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Preview only
    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  /* =========================================
     SAVE PROFILE
  ========================================= */

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const payload = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        pincode: formData.pincode,
      };

      /*
       * If your backend supports profile image
       * upload as Base64, this can also be sent.
       */
      if (formData.image) {
        payload.image = formData.image;
      }

      const res = await API.put(
        "/auth/customer/profile",
        payload
      );

      const updatedProfile =
        res.data?.user ||
        res.data ||
        formData;

      setFormData({
        name: updatedProfile.name || "",
        email:
          updatedProfile.email ||
          formData.email ||
          "",
        phone:
          updatedProfile.phone ||
          "",
        address:
          updatedProfile.address ||
          "",
        pincode:
          updatedProfile.pincode ||
          "",
        image:
          updatedProfile.image ||
          "",
      });

      setEditing(false);

      setMessage(
        "Profile updated successfully."
      );
    } catch (err) {
      console.error(
        "Profile update error:",
        err
      );

      setError(
        err.response?.data?.msg ||
        "Failed to update profile"
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
      <div className="profile-container">
        <div className="profile-box">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  /* =========================================
     IMAGE
  ========================================= */

  const profileImage =
    formData.image
      ? formData.image.startsWith("data:")
        ? formData.image
        : getImageUrl(formData.image)
      : "/placeholder.jpg";

  return (
    <div className="profile-container">

      <div className="profile-box">

        {/* HEADER */}
        <div className="profile-header">

          <h2>
            Profile Details
          </h2>

          {!editing ? (
            <button
              type="button"
              onClick={() => {
                setMessage("");
                setError("");
                setEditing(true);
              }}
              className="btn-edit"
            >
              Edit Profile
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              className="btn-save"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          )}

        </div>

        {/* MESSAGE */}
        {message && (
          <div className="success">
            {message}
          </div>
        )}

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {/* IMAGE */}
        <div className="profile-image-section">

          <div className="avatar-wrapper">

            <img
              src={profileImage}
              alt="Profile"
              className="profile-image"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "/placeholder.jpg";
              }}
            />

            {editing && (
              <label className="upload-btn">

                Change

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageUpload
                  }
                  hidden
                />

              </label>
            )}

          </div>

        </div>

        {/* FORM */}
        <div className="profile-grid">

          {/* NAME */}
          <div className="field">

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              disabled={!editing}
              onChange={handleChange}
            />

          </div>

          {/* EMAIL */}
          <div className="field">

            <label>
              Email
            </label>

            <input
              type="email"
              value={formData.email}
              disabled
            />

          </div>

          {/* PHONE */}
          <div className="field">

            <label>
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              disabled={!editing}
              onChange={handleChange}
            />

          </div>

          {/* PINCODE */}
          <div className="field">

            <label>
              Pincode
            </label>

            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              disabled={!editing}
              onChange={handleChange}
            />

          </div>

          {/* ADDRESS */}
          <div className="field full-width">

            <label>
              Address
            </label>

            <textarea
              name="address"
              value={formData.address}
              disabled={!editing}
              onChange={handleChange}
            />

          </div>

        </div>

      </div>

    </div>
  );
}