import {
  FiBriefcase,
  FiCheckCircle,
  FiDollarSign,
  FiStar
} from "react-icons/fi";

import { jobsData } from "../../../data/jobsData";
import JobCard from "../../../components/jobs/JobCard/JobCard";

import {
  useTechnicianAuth
} from "../../../context/TechnicianAuthContext";

import "./Dashboard.css";

export default function Dashboard() {

  const {
    technician,
    loading
  } = useTechnicianAuth();


  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="loader">
        Loading dashboard...
      </div>
    );
  }


  /* =========================
     TECHNICIAN
  ========================= */

  const technicianName =
    technician?.name || "Technician";

  const firstName =
    technicianName.split(" ")[0];


  /*
   * Rating is not currently available
   * in your users table.
   *
   * Keep 0 until rating is added
   * through the jobs/reviews backend.
   */
  const rating =
    technician?.rating ?? 0;


  /* =========================
     JOB STATS
  ========================= */

  const activeJobs = jobsData.filter(
    (j) =>
      j.status === "In Progress" ||
      j.status === "Pending"
  );


  const completed = jobsData.filter(
    (j) => j.status === "Completed"
  ).length;


  const totalEarnings = jobsData
    .filter((j) => j.status === "Completed")
    .reduce(
      (sum, j) => sum + Number(j.price || 0),
      0
    );


  /* =========================
     STATS
  ========================= */

  const stats = [
    {
      label: "Active Jobs",
      value: activeJobs.length,
      icon: FiBriefcase,
      color: "info"
    },
    {
      label: "Completed",
      value: completed,
      icon: FiCheckCircle,
      color: "success"
    },
    {
      label: "Earnings (Job total)",
      value: `₹${totalEarnings}`,
      icon: FiDollarSign,
      color: "primary"
    },
    {
      label: "Rating",
      value: rating,
      icon: FiStar,
      color: "warning"
    }
  ];


  return (
    <div>

      {/* =========================
          WELCOME
      ========================= */}

      <div className="dash-welcome">

        <h1>
          Welcome back, {firstName} 👋
        </h1>

        <p className="text-gray">
          Here's what's happening with your jobs today.
        </p>

      </div>


      {/* =========================
          STATS
      ========================= */}

      <div className="stats-grid">

        {stats.map((s) => {

          const Icon = s.icon;

          return (
            <div
              className="stat-card card"
              key={s.label}
            >

              <div
                className={`stat-icon stat-${s.color}`}
              >
                <Icon />
              </div>

              <div>

                <p className="stat-value">
                  {s.value}
                </p>

                <p className="stat-label">
                  {s.label}
                </p>

              </div>

            </div>
          );

        })}

      </div>


      {/* =========================
          RECENT JOBS
      ========================= */}

      <div className="dash-section">

        <div className="dash-section-head">

          <h3>
            Recent Jobs
          </h3>

        </div>


        {jobsData.length > 0 ? (

          jobsData
            .slice(0, 3)
            .map((job) => (
              <JobCard
                key={job.id}
                job={job}
              />
            ))

        ) : (

          <div className="empty-state">
            No jobs available.
          </div>

        )}

      </div>

    </div>
  );
}