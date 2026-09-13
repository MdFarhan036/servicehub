import { useEffect, useState } from "react";
import api from "../services/api";
import { Helmet } from "react-helmet-async";

export default function Comments() {
  const [data, setData] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  /* FETCH REVIEWS */
  const fetchData =
    async () => {
      try {
        setLoading(true);

        const res =
          await api.get(
            "/admin/comments"
          );

        setData(
          res.data || []
        );

      } catch (err) {
        console.error(err);
        alert(
          "Failed to load reviews"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, []);

  /* DELETE REVIEW */
  const remove =
    async (id) => {
      if (
        !window.confirm(
          "Delete this review?"
        )
      )
        return;

      try {
        await api.delete(
          `/admin/comments/${id}`
        );

        setData((prev) =>
          prev.filter(
            (item) =>
              item.id !== id
          )
        );

      } catch (err) {
        console.error(err);
        alert(
          "Delete failed"
        );
      }
    };

  /* APPROVE / REJECT */
  const toggleStatus =
    async (review) => {
      try {
        await api.put(
          `/admin/comments/${review.id}`,
          {
            is_approved:
              review.is_approved
                ? 0
                : 1
          }
        );

        setData((prev) =>
          prev.map((item) =>
            item.id ===
            review.id
              ? {
                  ...item,
                  is_approved:
                    item.is_approved
                      ? 0
                      : 1
                }
              : item
          )
        );

      } catch (err) {
        console.error(err);
        alert(
          "Status update failed"
        );
      }
    };

  /* STAR RATING */
  const renderStars =
    (rating) => {
      return "⭐".repeat(
        rating || 0
      );
    };

  /* SEARCH */
  const filtered =
    data.filter(
      (item) =>
        item.comment
          ?.toLowerCase()
          ?.includes(
            search.toLowerCase()
          ) ||
        item.user_name
          ?.toLowerCase()
          ?.includes(
            search.toLowerCase()
          ) ||
        item.service_title
          ?.toLowerCase()
          ?.includes(
            search.toLowerCase()
          )
    );

  return (
    <div className="page">
      <Helmet>
        <title>
          Reviews Management
        </title>
      </Helmet>

      {/* HEADER */}
      <div className="page-header">
        <h1>
          Customer Reviews
        </h1>
      </div>

      {/* SEARCH */}
      <input
        className="search-input"
        placeholder="Search reviews..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
      />

      {/* TABLE */}
      <div className="card-form">

        {loading && (
          <div className="loader">
            Loading...
          </div>
        )}

        {!loading &&
          filtered.length ===
            0 && (
            <div
              style={{
                textAlign:
                  "center",
                padding: 20
              }}
            >
              No reviews found
            </div>
          )}

        {!loading &&
          filtered.length >
            0 && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Service</th>
                  <th>Rating</th>
                  <th>Review</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map(
                  (review) => (
                    <tr
                      key={
                        review.id
                      }
                    >
                      <td>
                        {
                          review.id
                        }
                      </td>

                      <td>
                        {review.user_name ||
                          "User"}
                      </td>

                      <td>
                        {review.service_title ||
                          "-"}
                      </td>

                      <td>
                        {renderStars(
                          review.rating
                        )}
                      </td>

                      <td
                        style={{
                          maxWidth:
                            "300px"
                        }}
                      >
                        {review.comment
                          ?.length >
                        80
                          ? review.comment.substring(
                              0,
                              80
                            ) +
                            "..."
                          : review.comment}
                      </td>

                      <td>
                        <span
                          className={
                            review.is_approved
                              ? "status active"
                              : "status inactive"
                          }
                        >
                          {review.is_approved
                            ? "Approved"
                            : "Pending"}
                        </span>
                      </td>

                      <td className="actions">
                        <button
                          className="btn-primary"
                          onClick={() =>
                            toggleStatus(
                              review
                            )
                          }
                        >
                          {review.is_approved
                            ? "Reject"
                            : "Approve"}
                        </button>

                        <button
                          className="btn-secondary"
                          onClick={() =>
                            remove(
                              review.id
                            )
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}

      </div>
    </div>
  );
}