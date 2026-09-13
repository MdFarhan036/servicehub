import { useEffect, useState } from "react";

import JobCard from "../../../components/jobs/JobCard/JobCard";
import API from "../../../services/api";

import "./Jobs.css";


/* =========================
   STATUS FILTERS
========================= */

const filters = [
  "All",
  "Pending",
  "Assigned",
  "In Progress",
  "Completed",
  "Cancelled"
];


/* =========================
   NORMALIZE STATUS
========================= */

const normalizeStatus = (status) => {
  return String(status || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_");
};


export default function Jobs() {

  const [active, setActive] = useState("All");

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  /* =========================
     FETCH TECHNICIAN JOBS
  ========================= */

  const fetchJobs = async () => {

    try {

      setLoading(true);
      setError("");

      const res = await API.get(
        "/bookings/technician/my-jobs"
      );


      /*
        Backend may return:

        []

        OR

        {
          jobs: []
        }
      */

      const jobData =
        Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.jobs)
            ? res.data.jobs
            : [];


      setJobs(jobData);

    } catch (err) {

      console.error(
        "Failed to load technician jobs:",
        err
      );


      setError(
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "Failed to load jobs."
      );


      setJobs([]);

    } finally {

      setLoading(false);

    }
  };


  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {

    fetchJobs();

  }, []);


  /* =========================
     STATUS FILTER
  ========================= */

  const filtered = jobs.filter((job) => {

    const status = normalizeStatus(
      job.status
    );


    if (active === "All") {
      return true;
    }


    switch (active) {

      case "Pending":
        return status === "pending";


      case "Assigned":
        return status === "assigned";


      case "In Progress":
        return status === "in_progress";


      case "Completed":
        return status === "completed";


      case "Cancelled":
        return (
          status === "cancelled" ||
          status === "canceled"
        );


      default:
        return true;

    }

  });


  /* =========================
     RENDER
  ========================= */

  return (
    <div className="jobs">

      {/* =========================
          HEADER
      ========================= */}

      <div className="jobs-header">

        <div>

          <h1 className="jobs-title">
            My Jobs
          </h1>

          <p className="jobs-subtitle">
            Manage your assigned bookings
          </p>

        </div>


        <button
          type="button"
          className="jobs-refresh"
          onClick={fetchJobs}
          disabled={loading}
        >
          {loading
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>


      {/* =========================
          FILTERS
      ========================= */}

      <div className="jobs-filters">

        {filters.map((filter) => (

          <button
            key={filter}
            type="button"
            className={`filter-chip ${
              active === filter
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActive(filter)
            }
          >
            {filter}
          </button>

        ))}

      </div>


      {/* =========================
          LOADING
      ========================= */}

      {loading && (

        <div className="jobs-loading">
          Loading jobs...
        </div>

      )}


      {/* =========================
          ERROR
      ========================= */}

      {!loading && error && (

        <div className="jobs-error">

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={fetchJobs}
          >
            Try Again
          </button>

        </div>

      )}


      {/* =========================
          JOBS
      ========================= */}

      {!loading && !error && (

        <div className="jobs-list">

          {filtered.length === 0 ? (

            <p className="text-gray">
              No jobs found for this filter.
            </p>

          ) : (

            filtered.map((job) => (

              <JobCard
                key={
                  job.id ||
                  job.booking_id
                }
                job={job}
              />

            ))

          )}

        </div>

      )}

    </div>
  );
}