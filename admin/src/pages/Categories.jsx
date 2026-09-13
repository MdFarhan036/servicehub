import { useEffect, useState } from "react";
import API from "../services/api";
import DataTable from "./DataTable";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const BASE_URL =
  import.meta.env.VITE_BASE_URL ||
  "http://localhost:5000";

export default function Categories() {
  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const navigate =
    useNavigate();

  /* LOAD */
  const load = async () => {
    try {
      setLoading(true);

      const res =
        await API.get(
          "/categories"
        );

      setCategories(
        res.data || []
      );

    } catch (err) {
      console.error(err);
      alert(
        "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* DELETE */
  const del = async (id) => {
    if (
      !window.confirm(
        "Delete this category?"
      )
    )
      return;

    try {
      await API.delete(
        `/categories/${id}`
      );

      setCategories((prev) =>
        prev.filter(
          (c) => c.id !== id
        )
      );

    } catch (err) {
      console.error(err);
      alert(
        "Delete failed"
      );
    }
  };

  /* TABLE COLUMNS */
  const columns = [
    {
      key: "id",
      label: "ID"
    },
    {
      key: "image",
      label: "Image"
    },
    {
      key: "name",
      label:
        "Category Name"
    },
    {
      key: "slug",
      label: "Slug"
    },
    {
      key:
        "description",
      label:
        "Description"
    },
    {
      key:
        "meta_title",
      label:
        "Meta Title"
    },
    {
      key:
        "actions",
      label:
        "Actions"
    }
  ];

  /* TABLE DATA */
  const tableData =
    categories.map((c) => ({
      ...c,

      image: c.image ? (
        <img
          src={`${BASE_URL}${c.image}`}
          alt={c.name}
          style={{
            width: "60px",
            height: "60px",
            objectFit:
              "cover",
            borderRadius:
              "8px"
          }}
        />
      ) : (
        "No Image"
      ),

      description:
        c.description
          ? c.description
              .replace(
                /<[^>]*>?/gm,
                ""
              )
              .substring(
                0,
                80
              ) + "..."
          : "-",

      actions: (
        <div className="actions">
          <button
            onClick={() =>
              navigate(
                `/categories/edit/${c.id}`
              )
            }
            className="btn-primary"
          >
            Edit
          </button>

          <button
            onClick={() =>
              del(c.id)
            }
            className="btn-secondary"
          >
            Delete
          </button>
        </div>
      )
    }));

  return (
    <div className="page">
      <Helmet>
        <title>
          Categories |
          Admin Panel
        </title>

        <meta
          name="description"
          content="Manage service categories"
        />
      </Helmet>

      <div className="page-header">
        <h1>
          Categories
        </h1>

        <button
          onClick={() =>
            navigate(
              "/categories/add"
            )
          }
          className="btn-primary"
        >
          + Add Category
        </button>
      </div>

      <div className="card-form">
        {loading ? (
          <div className="loader">
            Loading...
          </div>
        ) : categories.length ===
          0 ? (
          <div
            style={{
              textAlign:
                "center",
              padding:
                "20px"
            }}
          >
            No categories
            found
          </div>
        ) : (
          <DataTable
            data={
              tableData
            }
            columns={
              columns
            }
          />
        )}
      </div>
    </div>
  );
}