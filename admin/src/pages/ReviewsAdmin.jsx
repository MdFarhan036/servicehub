import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ReviewsAdmin() {
  const [pageData, setPageData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const [pageRes, reviewRes] = await Promise.all([
        api.get("/admin/reviews-page"),
        api.get("/admin/reviews")
      ]);

      setPageData(pageRes.data);
      setReviews(reviewRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteReview = async (id) => {
    if (!window.confirm("Delete review?")) return;

    await api.delete(`/admin/reviews/${id}`);
    loadData();
  };

  return (
    <div className="reviews-admin">
      <div className="header">
        <h2>Reviews Management</h2>

        <div className="actions">
          <button
            className="btn primary"
            onClick={() => navigate("/admin/reviews-page/edit")}
          >
            Edit Page Settings
          </button>

          <button
            className="btn"
            onClick={() => navigate("/admin/reviews/create")}
          >
            Add Review
          </button>
        </div>
      </div>

      {/* PAGE SETTINGS */}
      <div className="card">
        <h3>{pageData?.hero_title}</h3>
        <p>{pageData?.hero_subtitle}</p>

        <h4>Overall Rating: {pageData?.overall_rating}</h4>
        <p>{pageData?.total_reviews_text}</p>

        <h4>CTA</h4>
        <p>{pageData?.cta_title}</p>
        <p>{pageData?.cta_subtitle}</p>
      </div>

      {/* REVIEWS TABLE */}
      <div className="card">
        <h3>Customer Reviews</h3>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Service</th>
              <th>Rating</th>
              <th>Category</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <td>{review.name}</td>
                <td>{review.service}</td>
                <td>{review.rating}</td>
                <td>{review.category}</td>
                <td>{review.review_date}</td>

                <td>
                  <button
                    onClick={() =>
                      navigate(`/admin/reviews/edit/${review.id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteReview(review.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}