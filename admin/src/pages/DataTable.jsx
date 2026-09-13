import { useState } from "react";

export default function DataTable({ data, columns }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState(null);
  const [asc, setAsc] = useState(true);

  const perPage = 5;

  // 🔍 SEARCH
  let filtered = data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  // 🔽 SORT
  if (sortKey) {
    filtered.sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return asc ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return asc ? 1 : -1;
      return 0;
    });
  }

  // 📄 PAGINATION
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div>
      {/* SEARCH */}
      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="table-search"
      />

      {/* TABLE */}
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => {
                  setSortKey(col.key);
                  setAsc(!asc);
                }}
              >
                {col.label}
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginated.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={col.key}>{row[col.key]}</td>
              ))}

              <td>{row.actions}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>

        <span>
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}