import {
  useEffect,
  useState
} from "react";

import {
  FaCalendarAlt,
  FaUser,
  FaArrowRight
} from "react-icons/fa";

import {
  Link
} from "react-router-dom";

import API from "../services/api";
import { getImageUrl } from "../utils/imageUrl";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================================
     LOAD BLOG DATA
  ========================================= */

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        pageRes,
        blogRes
      ] = await Promise.all([
        API.get("/blogs/page-settings"),
        API.get("/blogs")
      ]);

      setPageData(pageRes.data);

      setBlogs(blogRes.data || []);

    } catch (err) {
      console.error(
        "Error loading blogs:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     FEATURED BLOG
  ========================================= */

  const featuredBlog = blogs.find(
    (blog) =>
      Number(blog.is_featured) === 1
  );

  /* =========================================
     NORMAL BLOGS
  ========================================= */

  const normalBlogs = blogs.filter(
    (blog) =>
      Number(blog.is_featured) !== 1
  );

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <p>Loading blogs...</p>
    );
  }

  return (
    <div className="blogs-page">

      {/* =====================================
          HERO
      ===================================== */}

      <section className="blogs-hero">
        <div className="blogs-overlay">

          <h1>
            {pageData?.hero_title ||
              "Our Blogs"}
          </h1>

          <p>
            {pageData?.hero_subtitle ||
              ""}
          </p>

        </div>
      </section>

      {/* =====================================
          FEATURED BLOG
      ===================================== */}

      {featuredBlog && (
        <section className="featured-blog container">

          {/* IMAGE */}
          <div className="featured-image">
            <img
              src={getImageUrl(
                featuredBlog.image
              )}
              alt={
                featuredBlog.title ||
                "Featured Blog"
              }
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "/placeholder.jpg";
              }}
            />
          </div>

          {/* CONTENT */}
          <div className="featured-content">

            <span>
              Featured Article
            </span>

            <h2>
              {featuredBlog.title}
            </h2>

            <p>
              {
                featuredBlog.short_description
              }
            </p>

            <Link
              to={`/blogs/${featuredBlog.slug}`}
            >
              <button type="button">
                Read More{" "}
                <FaArrowRight />
              </button>
            </Link>

          </div>

        </section>
      )}

      {/* =====================================
          BLOG GRID
      ===================================== */}

      <section className="blog-grid container">

        {normalBlogs.length > 0 ? (
          normalBlogs.map(
            (blog) => (
              <div
                className="blog-card"
                key={blog.id}
              >

                {/* BLOG IMAGE */}
                <img
                  src={getImageUrl(
                    blog.image
                  )}
                  alt={
                    blog.title ||
                    "Blog"
                  }
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "/placeholder.jpg";
                  }}
                />

                {/* BLOG CONTENT */}
                <div className="blog-content">

                  {/* CATEGORY */}
                  {blog.category && (
                    <span className="category-tag">
                      {blog.category}
                    </span>
                  )}

                  {/* TITLE */}
                  <h3>
                    {blog.title}
                  </h3>

                  {/* META */}
                  <div className="blog-meta">

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

                  {/* READ MORE */}
                  <Link
                    to={`/blogs/${blog.slug}`}
                  >
                    <button type="button">
                      Read More{" "}
                      <FaArrowRight />
                    </button>
                  </Link>

                </div>

              </div>
            )
          )
        ) : (
          <p className="no-data">
            No blogs available.
          </p>
        )}

      </section>

      {/* =====================================
          NEWSLETTER
      ===================================== */}

      <section className="blog-newsletter">

        <h2>
          {pageData?.newsletter_title ||
            "Subscribe to Our Newsletter"}
        </h2>

        <p>
          {pageData?.newsletter_subtitle ||
            ""}
        </p>

        <div className="newsletter-box">

          <input
            type="email"
            placeholder="Enter your email"
          />

          <button type="button">
            Subscribe
          </button>

        </div>

      </section>

    </div>
  );
}