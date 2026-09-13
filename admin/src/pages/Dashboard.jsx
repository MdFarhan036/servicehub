import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    services: 0,
    bookings: 0,
    comments: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // ✅ run all requests in parallel (faster)
        const [s, b, c] = await Promise.all([
          API.get("/services"),
          API.get("/bookings"),
          API.get("/comments"),
        ]);

        setStats({
          services: s.data.length,
          bookings: b.data.length,
          comments: c.data.length,
        });
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <div className="text-center mt-20">Loading dashboard...</div>;
  }

  return (
    <div>
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Services" value={stats.services} color="blue" />
        <Card title="Bookings" value={stats.bookings} color="green" />
        <Card title="Comments" value={stats.comments} color="purple" />
      </div>
    </div>
  );
}

/* 🔥 Reusable Card Component */
function Card({ title, value, color }) {
  const colors = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h2 className="text-2xl font-bold">{value}</h2>
        </div>

        <div className={`w-10 h-10 ${colors[color]} rounded-full`} />
      </div>
    </div>
  );
}