import { useState } from "react";
import { useTechnicianAuth } from "../../../context/TechnicianAuthContext";
import StatusBadge from "../../../components/common/StatusBadge/StatusBadge";
import Button from "../../../components/common/Button/Button";
import "./Profile.css";

export default function Profile() {
  const { technician } = useTechnicianAuth();

  const [editing, setEditing] = useState(false);

  if (!technician) {
    return (
      <div className="profile-page">
        <div className="card">
          Loading profile...
        </div>
      </div>
    );
  }

  const t = technician;

  return (
    <div className="profile-page">

      {/* PROFILE HEADER */}
      <div className="profile-header card">

        <div className="profile-avatar">
          {t.name?.charAt(0).toUpperCase()}
        </div>

        <div className="profile-header-info">
          <h2>{t.name}</h2>

          <p className="text-gray">
            {t.specialization || "Technician"}
            {t.experience
              ? ` · ${t.experience} experience`
              : ""}
          </p>

          <StatusBadge
            status={t.status || "active"}
          />
        </div>

        <Button
          variant="secondary"
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Cancel" : "Edit Profile"}
        </Button>

      </div>


      {/* PROFILE GRID */}
      <div className="profile-grid">

        {/* CONTACT */}
        <div className="card profile-block">

          <h4>Contact Information</h4>

          <div className="profile-row">
            <span>Email</span>
            <span>{t.email || "-"}</span>
          </div>

          <div className="profile-row">
            <span>Phone</span>
            <span>{t.phone || "-"}</span>
          </div>

          <div className="profile-row">
            <span>City</span>
            <span>{t.city || "-"}</span>
          </div>

        </div>


        {/* PROFESSIONAL INFORMATION */}
        <div className="card profile-block">

          <h4>Professional Information</h4>

          <div className="profile-row">
            <span>Specialization</span>
            <span>
              {t.specialization || "-"}
            </span>
          </div>

          <div className="profile-row">
            <span>Experience</span>
            <span>
              {t.experience || "-"}
            </span>
          </div>

          <div className="profile-row">
            <span>Role</span>
            <span>
              {t.role || "technician"}
            </span>
          </div>

        </div>


        {/* ACCOUNT */}
        <div className="card profile-block">

          <h4>Account Information</h4>

          <div className="profile-row">
            <span>Account ID</span>
            <span>#{t.id}</span>
          </div>

          <div className="profile-row">
            <span>Status</span>
            <StatusBadge
              status={t.status || "active"}
            />
          </div>

        </div>

      </div>


      {/* EDIT SECTION */}
      {editing && (
        <div className="card profile-edit-block">

          <h4>Edit Profile</h4>

          <p className="text-gray">
            Profile editing can be connected to the technician
            update API here.
          </p>

          <Button
            variant="secondary"
            onClick={() => setEditing(false)}
          >
            Close
          </Button>

        </div>
      )}

    </div>
  );
}