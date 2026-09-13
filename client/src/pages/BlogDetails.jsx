import {
  useEffect,
  useState
} from "react";

import {
  useParams,
  Link
} from "react-router-dom";

import API from "../services/api";

import { getImageUrl } from "../utils/imageUrl";

import {
  FaCalendarAlt,
  FaUser,
  FaArrowRight,
  FaTag
} from "react-icons/fa";

export default function BlogDetails() {
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    loadBlog();
  }, [slug]);

  /* =========================================
     LOAD BLOG + RELATED BLOGS
  ========================================= */

  const loadBlog = async () => {
    try {
      const [blogRes, relatedRes] = await Promise.all([
        API.get(`/blogs/${slug}`),
        API.get(`/blogs/related/${slug}`)
      ]);

      setBlog(blogRes.data);
      setRelatedBlogs(relatedRes.data || []);

    } catch (err) {
      console.error("Error loading blog:", err);
    }
  };

  /* =========================================
     LOADING
  ========================================= */

  if (!blog) {
    return (
      <p className="blog-loading">
        Loading blog...
      </p>
    );
  }

  return (
    <div className="blog-details-page">

      {/* =====================================
          HERO IMAGE
      ===================================== */}

      <section className="blog-detail-hero">
        <img
          src={getImageUrl(blog.image)}
          alt={blog.title || "Blog"}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/placeholder.jpg";
          }}
        />
      </section>

      {/* =====================================
          CONTENT
      ===================================== */}

      <section className="blog-detail-container">

        {/* MAIN CONTENT */}
        <div className="blog-main-content">

          {/* CATEGORY */}
          {blog.category && (
            <span className="category-badge">
              <FaTag />
              {blog.category}
            </span>
          )}

          {/* TITLE */}
          <h1>
            {blog.title}
          </h1>

          {/* META */}
          <div className="blog-detail-meta">

            {blog.author && (
              <span>
                <FaUser />
                {blog.author}
              </span>
            )}

            {blog.publish_date && (
              <span>
                <FaCalendarAlt />
                {blog.publish_date}
              </span>
            )}

          </div>

          {/* BLOG HTML CONTENT */}
          <div
            className="blog-body"
            dangerouslySetInnerHTML={{
              __html:
                blog.content ||
                "<p>No content available.</p>"
            }}
          />

        </div>

        {/* =================================
            RELATED BLOGS
        ================================= */}

        {relatedBlogs.length > 0 && (
          <div className="blog-sidebar">

            <h3>
              Related Blogs
            </h3>

            {relatedBlogs.map((item) => (

              <div
                className="related-blog-card"
                key={item.id}
              >

                {/* RELATED BLOG IMAGE */}
                {item.image && (
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title || "Blog"}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "/placeholder.jpg";
                    }}
                  />
                )}

                <div className="related-blog-content">

                  <h4>
                    {item.title}
                  </h4>

                  <Link
                    to={`/blogs/${item.slug}`}
                  >
                    Read More
                    <FaArrowRight />
                  </Link>

                </div>

              </div>

            ))}

          </div>
        )}

      </section>

    </div>
  );
}