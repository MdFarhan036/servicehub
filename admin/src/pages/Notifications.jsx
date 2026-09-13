import { useEffect, useState } from "react";
import {
  FaBell,
  FaCheck,
  FaTrash,
  FaSync,
} from "react-icons/fa";


import "./Notifications.css";
import API from "../services/api";


export default function Notifications() {

  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);


  /*
  ==========================================
  LOAD ADMIN NOTIFICATIONS
  ==========================================
  */

  const loadNotifications =
    async () => {

      try {

        setLoading(true);


        const res =
          await API.get(
            "/notifications/admin",
            {
              withCredentials: true
            }
          );


        setNotifications(
          res.data.notifications || []
        );

      } catch (error) {

        console.error(
          "Load notifications error:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


  useEffect(
    () => {

      loadNotifications();

    },
    []
  );


  /*
  ==========================================
  MARK ONE AS READ
  ==========================================
  */

  const markAsRead =
    async (id) => {

      try {

        await API.put(
          `/notifications/${id}/read`,
          {},
          {
            withCredentials: true
          }
        );


        setNotifications(
          (previous) =>
            previous.map(
              (notification) =>

                notification.id === id

                  ? {
                      ...notification,
                      is_read: 1
                    }

                  : notification
            )
        );

      } catch (error) {

        console.error(
          "Mark read error:",
          error
        );

      }

    };


  /*
  ==========================================
  MARK ALL AS READ
  ==========================================
  */

  const markAllAsRead =
    async () => {

      try {

        setActionLoading(true);


        await API.put(
          "/notifications/admin/read-all",
          {},
          {
            withCredentials: true
          }
        );


        setNotifications(
          (previous) =>
            previous.map(
              (notification) => ({
                ...notification,
                is_read: 1
              })
            )
        );

      } catch (error) {

        console.error(
          "Mark all read error:",
          error
        );

      } finally {

        setActionLoading(false);

      }

    };


  /*
  ==========================================
  DELETE NOTIFICATION
  ==========================================
  */

  const deleteNotification =
    async (id) => {

      const confirmed =
        window.confirm(
          "Delete this notification?"
        );


      if (!confirmed) {
        return;
      }


      try {

        await API.delete(
          `/notifications/${id}`,
          {
            withCredentials: true
          }
        );


        setNotifications(
          (previous) =>
            previous.filter(
              (notification) =>
                notification.id !== id
            )
        );

      } catch (error) {

        console.error(
          "Delete notification error:",
          error
        );

      }

    };


  /*
  ==========================================
  FORMAT DATE
  ==========================================
  */

  const formatDate =
    (date) => {

      if (!date) {
        return "";
      }


      return new Date(
        date
      ).toLocaleString(
        "en-IN",
        {
          dateStyle:
            "medium",

          timeStyle:
            "short"
        }
      );

    };


  /*
  ==========================================
  UNREAD COUNT
  ==========================================
  */

  const unreadCount =
    notifications.filter(
      (notification) =>
        Number(
          notification.is_read
        ) === 0
    ).length;


  /*
  ==========================================
  UI
  ==========================================
  */

  return (

    <div className="notifications-page">

      {/* HEADER */}

      <div className="notifications-header">

        <div>

          <h1>

            <FaBell />

            Notifications

          </h1>


          <p>

            Manage your latest system
            notifications.

          </p>

        </div>


        <div className="notification-actions">

          <button
            className="refresh-btn"
            onClick={
              loadNotifications
            }
            disabled={
              loading
            }
          >

            <FaSync />

            Refresh

          </button>


          {

            unreadCount > 0 && (

              <button
                className="read-all-btn"
                onClick={
                  markAllAsRead
                }
                disabled={
                  actionLoading
                }
              >

                <FaCheck />

                Mark All Read

              </button>

            )

          }

        </div>

      </div>


      {/* SUMMARY */}

      <div className="notification-summary">

        <div className="summary-card">

          <span>

            Total

          </span>


          <strong>

            {
              notifications.length
            }

          </strong>

        </div>


        <div
          className="
          summary-card
          unread-summary
          "
        >

          <span>

            Unread

          </span>


          <strong>

            {
              unreadCount
            }

          </strong>

        </div>

      </div>


      {/* LOADING */}

      {

        loading && (

          <div className="notification-loading">

            Loading notifications...

          </div>

        )

      }


      {/* EMPTY */}

      {

        !loading &&
        notifications.length === 0 && (

          <div className="empty-notifications">

            <FaBell />

            <h3>

              No notifications

            </h3>


            <p>

              You are all caught up.

            </p>

          </div>

        )

      }


      {/* LIST */}

      {

        !loading &&
        notifications.length > 0 && (

          <div className="notifications-list">

            {

              notifications.map(
                (notification) => (

                  <div
                    key={
                      notification.id
                    }
                    className={`
                      notification-item
                      ${
                        Number(
                          notification.is_read
                        ) === 0
                          ? "unread"
                          : ""
                      }
                    `}
                  >

                    <div className="notification-icon">

                      <FaBell />

                    </div>


                    <div className="notification-content">

                      <div className="notification-title-row">

                        <h3>

                          {
                            notification.title
                          }

                        </h3>


                        {

                          Number(
                            notification.is_read
                          ) === 0 && (

                            <span className="unread-badge">

                              New

                            </span>

                          )

                        }

                      </div>


                      <p>

                        {
                          notification.message
                        }

                      </p>


                      <small>

                        {
                          formatDate(
                            notification.created_at
                          )
                        }

                      </small>

                    </div>


                    <div className="notification-item-actions">

                      {

                        Number(
                          notification.is_read
                        ) === 0 && (

                          <button
                            className="icon-action read"
                            title="Mark as read"
                            onClick={
                              () =>
                                markAsRead(
                                  notification.id
                                )
                            }
                          >

                            <FaCheck />

                          </button>

                        )

                      }


                      <button
                        className="icon-action delete"
                        title="Delete notification"
                        onClick={
                          () =>
                            deleteNotification(
                              notification.id
                            )
                        }
                      >

                        <FaTrash />

                      </button>

                    </div>

                  </div>

                )
              )

            }

          </div>

        )

      }

    </div>

  );

}