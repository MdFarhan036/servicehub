import { useEffect, useState } from "react";
import { FiBell } from "react-icons/fi";
import API from "../../../services/api";
import "./Notifications.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get(
        "/notifications/technician"
      );

      setNotifications(res.data || []);

    } catch (err) {
      console.error(
        "Failed to load notifications:",
        err
      );

      setError(
        err.response?.data?.msg ||
        "Failed to load notifications."
      );

      setNotifications([]);

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchNotifications();
  }, []);


  const markAsRead = async (id) => {
    try {

      await API.put(
        `/notifications/${id}/read`
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                is_read: 1
              }
            : notification
        )
      );

    } catch (err) {
      console.error(
        "Failed to mark notification as read:",
        err
      );
    }
  };


  const handleNotificationClick = (notification) => {

    if (!notification.is_read) {
      markAsRead(notification.id);
    }

  };


  return (
    <div className="notifications-page">

      <div className="notifications-header">

        <div>
          <h1 className="notif-title">
            Notifications
          </h1>

          <p className="notif-subtitle">
            Stay updated with your latest activities.
          </p>
        </div>

        <button
          type="button"
          className="refresh-btn"
          onClick={fetchNotifications}
        >
          Refresh
        </button>

      </div>


      {/* LOADING */}

      {loading && (
        <div className="notif-loading">
          Loading notifications...
        </div>
      )}


      {/* ERROR */}

      {!loading && error && (
        <div className="notif-error">
          {error}
        </div>
      )}


      {/* NOTIFICATIONS */}

      {!loading && !error && (

        <div className="notif-list">

          {notifications.length === 0 ? (

            <div className="card notif-empty">

              <FiBell />

              <p>
                No notifications yet.
              </p>

            </div>

          ) : (

            notifications.map((n) => (

              <div
                key={n.id}
                className={`card notif-item ${
                  !n.is_read ? "unread" : ""
                }`}
                onClick={() =>
                  handleNotificationClick(n)
                }
              >

                <div className="notif-icon">
                  <FiBell />
                </div>


                <div className="notif-body">

                  <p className="notif-heading">
                    {n.title}
                  </p>

                  <p className="notif-message text-gray">
                    {n.message}
                  </p>

                  <span className="notif-time">
                    {n.created_at
                      ? new Date(
                          n.created_at
                        ).toLocaleString()
                      : ""}
                  </span>

                </div>


                {!n.is_read && (
                  <span className="notif-dot-indicator" />
                )}

              </div>

            ))

          )}

        </div>

      )}

    </div>
  );
}