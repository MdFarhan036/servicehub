import { useEffect, useState, useMemo } from "react";
import API from "../services/api";

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  const loadContacts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/contact");
      setContacts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  // 🔍 SEARCH + FILTER
  const filteredContacts = useMemo(() => {
    let data = [...contacts];

    if (search) {
      data = data.filter((c) =>
        `${c.name} ${c.email} ${c.message}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (filter === "latest") {
      data.sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      );
    }

    if (filter === "unread") {
      data = data.filter(
        (c) => c.status === "new"
      );
    }

    return data;
  }, [contacts, search, filter]);

  // 📄 PAGINATION
  const totalPages = Math.ceil(
    filteredContacts.length / itemsPerPage
  );

  const currentData = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  const deleteMsg = async (id) => {
    if (!window.confirm("Delete message?")) return;

    try {
      await API.delete(`/contact/${id}`);
      setContacts((prev) =>
        prev.filter((c) => c.id !== id)
      );
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="admin-contacts">
      <h2>Contact Messages</h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="search-box"
      />

      {/* FILTER */}
      <div className="filters">
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? "active" : ""}
        >
          All
        </button>
        <button
          onClick={() => setFilter("latest")}
          className={filter === "latest" ? "active" : ""}
        >
          Latest
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={filter === "unread" ? "active" : ""}
        >
          Unread
        </button>
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : currentData.length === 0 ? (
        <p>No messages found</p>
      ) : (
        <div className="table-wrapper">
          <table className="contacts-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Message</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((c, index) => (
                <tr key={c.id}>
                  <td>
                    {(currentPage - 1) * itemsPerPage +
                      index +
                      1}
                  </td>

                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>

                  <td className="msg-cell">
                    {c.message}
                  </td>

                  <td>
                    {c.created_at
                      ? new Date(
                          c.created_at
                        ).toLocaleString()
                      : "-"}
                  </td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteMsg(c.id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from(
            { length: totalPages },
            (_, i) => (
              <button
                key={i}
                onClick={() =>
                  setCurrentPage(i + 1)
                }
                className={
                  currentPage === i + 1
                    ? "active"
                    : ""
                }
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}