import {
  useEffect,
  useState
} from "react";

import api from "../services/api";
import {
  useNavigate
} from "react-router-dom";

const BASE_URL =
  (
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api"
  ).replace("/api", "");

export default function BlogsAdmin() {
  const [pageData, setPageData] =
    useState(null);

  const [blogs, setBlogs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const navigate =
    useNavigate();

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
        api.get(
          "/admin/blog-page"
        ),
        api.get(
          "/admin/blogs"
        )
      ]);

      setPageData(
        pageRes.data
      );

      setBlogs(
        blogRes.data || []
      );

    } catch (err) {
      console.log(
        "Failed to load blogs",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog =
    async (id) => {
      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this blog?"
        );

      if (
        !confirmDelete
      )
        return;

      try {
        await api.delete(
          `/admin/blogs/${id}`
        );

        setBlogs(
          (
            prev
          ) =>
            prev.filter(
              (
                blog
              ) =>
                blog.id !==
                id
            )
        );

      } catch (err) {
        console.log(
          "Delete failed",
          err
        );

        alert(
          "Failed to delete blog"
        );
      }
    };

  const getImageUrl = (
    path
  ) => {
    if (!path)
      return "/placeholder.jpg";

    return `${BASE_URL}${
      path.startsWith("/")
        ? ""
        : "/"
    }${path}`;
  };

  if (loading) {
    return (
      <p>
        Loading
        blogs...
      </p>
    );
  }

  return (
    <div className="blogs-admin">
      {/* HEADER */}
      <div className="header">
        <h2>
          Blogs Management
        </h2>

        <div className="actions">
          <button
            className="btn primary"
            onClick={() =>
              navigate(
                "/blog-page/edit"
              )
            }
          >
            Edit Page Settings
          </button>

          <button
            className="btn"
            onClick={() =>
              navigate(
                "/blogs/create"
              )
            }
          >
            Add Blog
          </button>
        </div>
      </div>

      {/* PAGE SETTINGS */}
      <div className="card">
        <h3>
          {
            pageData?.hero_title ||
            "No hero title added"
          }
        </h3>

        <p>
          {
            pageData?.hero_subtitle ||
            "No hero subtitle added"
          }
        </p>

        <h4>
          Newsletter Section
        </h4>

        <p>
          {
            pageData?.newsletter_title ||
            "No newsletter title"
          }
        </p>

        <p>
          {
            pageData?.newsletter_subtitle ||
            "No newsletter subtitle"
          }
        </p>
      </div>

      {/* BLOG LIST */}
      <div className="card">
        <h3>
          All Blogs
        </h3>

        {blogs.length ===
        0 ? (
          <p>
            No blogs found
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>
                  Image
                </th>
                <th>
                  Title
                </th>
                <th>
                  Category
                </th>
                <th>
                  Author
                </th>
                <th>
                  Date
                </th>
                <th>
                  Featured
                </th>
                <th>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {blogs.map(
                (
                  blog
                ) => (
                  <tr
                    key={
                      blog.id
                    }
                  >
                    <td>
                      <img
                        src={getImageUrl(
                          blog.image
                        )}
                        width="60"
                        alt={
                          blog.title
                        }
                      />
                    </td>

                    <td>
                      {
                        blog.title
                      }
                    </td>

                    <td>
                      {
                        blog.category
                      }
                    </td>

                    <td>
                      {
                        blog.author
                      }
                    </td>

                    <td>
                      {
                        blog.publish_date
                      }
                    </td>

                    <td>
                      {blog.is_featured
                        ? "Yes"
                        : "No"}
                    </td>

                    <td>
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/blogs/edit/${blog.id}`
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteBlog(
                            blog.id
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