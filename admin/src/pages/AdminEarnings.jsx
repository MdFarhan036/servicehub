import { useEffect, useState } from "react";

import {
  FiDollarSign,
  FiTrendingUp,
  FiUsers,
  FiBriefcase,
} from "react-icons/fi";


import "./AdminEarnings.css";
import API from "../services/api";


export default function AdminEarnings() {

  const [summary, setSummary] =
    useState(null);

  const [technicians, setTechnicians] =
    useState([]);

  const [earnings, setEarnings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /*
  ==========================================
  FETCH ADMIN EARNINGS DATA
  ==========================================
  */

  const fetchEarnings = async () => {

    try {

      setLoading(true);
      setError("");


      const [
        summaryRes,
        techniciansRes,
        historyRes,
      ] = await Promise.all([

        API.get(
          "/admin/earnings/summary"
        ),

        API.get(
          "/admin/earnings/technicians"
        ),

        API.get(
          "/admin/earnings/history"
        ),

      ]);


      setSummary(
        summaryRes.data.summary
      );


      setTechnicians(
        techniciansRes.data.technicians || []
      );


      setEarnings(
        historyRes.data.earnings || []
      );


    } catch (err) {

      console.error(
        "Failed to load admin earnings:",
        err
      );


      setError(

        err.response?.data?.message ||

        err.response?.data?.msg ||

        "Failed to load earnings."

      );


    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchEarnings();

  }, []);


  /*
  ==========================================
  FORMAT CURRENCY
  ==========================================
  */

  const formatCurrency =
    (amount) => {

      return new Intl.NumberFormat(
        "en-IN",
        {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 2,
        }
      ).format(
        Number(amount || 0)
      );

    };


  return (

    <div className="admin-earnings-page">


      <h1 className="admin-earnings-title">

        Earnings Dashboard

      </h1>


      {/* LOADING */}

      {loading && (

        <div className="earnings-loading">

          Loading earnings...

        </div>

      )}


      {/* ERROR */}

      {!loading && error && (

        <div className="earnings-error">

          {error}

        </div>

      )}


      {!loading && !error && (

        <>


          {/* =====================================
              SUMMARY CARDS
          ====================================== */}

          <div className="admin-earnings-summary">


            {/* TOTAL REVENUE */}

            <div className="card admin-earning-card">

              <FiDollarSign
                className="admin-earning-icon"
              />


              <div>

                <p className="admin-earning-value">

                  {formatCurrency(
                    summary?.total_revenue
                  )}

                </p>


                <span>

                  Total Revenue

                </span>

              </div>

            </div>


            {/* ADMIN PROFIT */}

            <div className="card admin-earning-card">

              <FiTrendingUp
                className="admin-earning-icon"
              />


              <div>

                <p className="admin-earning-value">

                  {formatCurrency(
                    summary?.total_admin_earnings
                  )}

                </p>


                <span>

                  Admin Earnings

                </span>

              </div>

            </div>


            {/* TECHNICIAN PAYOUT */}

            <div className="card admin-earning-card">

              <FiUsers
                className="admin-earning-icon"
              />


              <div>

                <p className="admin-earning-value">

                  {formatCurrency(
                    summary?.total_technician_earnings
                  )}

                </p>


                <span>

                  Technician Payout

                </span>

              </div>

            </div>


            {/* COMPLETED JOBS */}

            <div className="card admin-earning-card">

              <FiBriefcase
                className="admin-earning-icon"
              />


              <div>

                <p className="admin-earning-value">

                  {summary?.total_completed_jobs || 0}

                </p>


                <span>

                  Completed Jobs

                </span>

              </div>

            </div>


          </div>


          {/* =====================================
              THIS MONTH
          ====================================== */}

          <div className="card monthly-earning-card">

            <div>

              <h3>

                This Month's Admin Earnings

              </h3>


              <p>

                {formatCurrency(
                  summary?.this_month_admin_earnings
                )}

              </p>

            </div>

          </div>


          {/* =====================================
              TECHNICIAN REPORT
          ====================================== */}

          <div className="card admin-table-wrap">

            <h2>

              Technician Earnings

            </h2>


            <table className="admin-earnings-table">

              <thead>

                <tr>

                  <th>
                    Technician
                  </th>

                  <th>
                    Completed Jobs
                  </th>

                  <th>
                    Booking Revenue
                  </th>

                  <th>
                    Technician Earnings
                  </th>

                  <th>
                    Admin Earnings
                  </th>

                </tr>

              </thead>


              <tbody>


                {technicians.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="empty-row"
                    >

                      No technician earnings found.

                    </td>

                  </tr>

                ) : (

                  technicians.map(
                    (technician) => (

                      <tr
                        key={
                          technician.technician_id
                        }
                      >

                        <td>

                          {
                            technician.technician_name
                          }

                        </td>


                        <td>

                          {
                            technician.completed_jobs
                          }

                        </td>


                        <td>

                          {formatCurrency(
                            technician.total_booking_amount
                          )}

                        </td>


                        <td>

                          {formatCurrency(
                            technician.technician_earnings
                          )}

                        </td>


                        <td className="admin-profit">

                          {formatCurrency(
                            technician.admin_earnings
                          )}

                        </td>


                      </tr>

                    )
                  )

                )}


              </tbody>

            </table>

          </div>


          {/* =====================================
              BOOKING EARNINGS HISTORY
          ====================================== */}

          <div className="card admin-table-wrap">

            <h2>

              Earnings History

            </h2>


            <table className="admin-earnings-table">

              <thead>

                <tr>

                  <th>
                    Booking
                  </th>

                  <th>
                    Service
                  </th>

                  <th>
                    Technician
                  </th>

                  <th>
                    Total Amount
                  </th>

                  <th>
                    Commission
                  </th>

                  <th>
                    Technician
                  </th>

                  <th>
                    Admin
                  </th>

                  <th>
                    Date
                  </th>

                </tr>

              </thead>


              <tbody>


                {earnings.length === 0 ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="empty-row"
                    >

                      No earnings history found.

                    </td>

                  </tr>

                ) : (

                  earnings.map(
                    (earning) => (

                      <tr
                        key={
                          earning.booking_id
                        }
                      >

                        <td>

                          #{earning.booking_id}

                        </td>


                        <td>

                          {
                            earning.service_name ||
                            "-"
                          }

                        </td>


                        <td>

                          {
                            earning.technician_name ||
                            "-"
                          }

                        </td>


                        <td>

                          {formatCurrency(
                            earning.total_amount
                          )}

                        </td>


                        <td>

                          {
                            earning.commission_percent
                          }%

                        </td>


                        <td>

                          {formatCurrency(
                            earning.technician_earning
                          )}

                        </td>


                        <td className="admin-profit">

                          {formatCurrency(
                            earning.admin_earning
                          )}

                        </td>


                        <td>

                          {earning.completed_at

                            ? new Date(
                                earning.completed_at
                              ).toLocaleDateString(
                                "en-IN"
                              )

                            : "-"
                          }

                        </td>


                      </tr>

                    )
                  )

                )}


              </tbody>

            </table>

          </div>


        </>

      )}


    </div>

  );

}