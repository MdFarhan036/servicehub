import { useEffect, useState } from "react";

import {
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiCreditCard,
  FiClock,
} from "react-icons/fi";

import API from "../services/api";

import "./AdminWithdrawals.css";


export default function AdminWithdrawals() {

  const [withdrawals, setWithdrawals] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState(null);


  /*
  ==========================================
  FETCH WITHDRAWALS
  ==========================================
  */

  const fetchWithdrawals = async () => {

    try {

      setLoading(true);

      setError("");


      const res =
        await API.get(
          "/admin/withdrawals"
        );


      setWithdrawals(
        res.data.withdrawals || []
      );

    } catch (err) {

      console.error(
        "Failed to load withdrawals:",
        err
      );


      setError(

        err.response?.data?.message ||

        err.response?.data?.msg ||

        "Failed to load withdrawal requests."

      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchWithdrawals();

  }, []);


  /*
  ==========================================
  APPROVE WITHDRAWAL
  ==========================================
  */

  const approveWithdrawal =
    async (id) => {

      try {

        setActionLoading(id);


        await API.put(
          `/admin/withdrawals/${id}/approve`
        );


        await fetchWithdrawals();

      } catch (err) {

        alert(

          err.response?.data?.msg ||

          "Failed to approve withdrawal."

        );

      } finally {

        setActionLoading(null);

      }

    };


  /*
  ==========================================
  REJECT WITHDRAWAL
  ==========================================
  */

  const rejectWithdrawal =
    async (id) => {

      const reason =
        window.prompt(
          "Enter rejection reason:"
        );


      if (
        reason === null
      ) {
        return;
      }


      try {

        setActionLoading(id);


        await API.put(
          `/admin/withdrawals/${id}/reject`,
          {
            reason,
          }
        );


        await fetchWithdrawals();

      } catch (err) {

        alert(

          err.response?.data?.msg ||

          "Failed to reject withdrawal."

        );

      } finally {

        setActionLoading(null);

      }

    };


  /*
  ==========================================
  MARK AS PAID
  ==========================================
  */

  const markAsPaid =
    async (id) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to mark this withdrawal as paid?"
        );


      if (!confirmed) {
        return;
      }


      try {

        setActionLoading(id);


        await API.put(
          `/admin/withdrawals/${id}/paid`
        );


        await fetchWithdrawals();

      } catch (err) {

        alert(

          err.response?.data?.msg ||

          "Failed to mark withdrawal as paid."

        );

      } finally {

        setActionLoading(null);

      }

    };


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


  /*
  ==========================================
  STATUS BADGE
  ==========================================
  */

  const getStatusClass =
    (status) => {

      switch (
        status
      ) {

        case "pending":
          return "status-pending";

        case "approved":
          return "status-approved";

        case "paid":
          return "status-paid";

        case "rejected":
          return "status-rejected";

        default:
          return "";

      }

    };


  return (

    <div className="admin-withdrawals-page">


      {/* =====================================
          PAGE HEADER
      ====================================== */}

      <div className="withdrawals-header">

        <div>

          <h1>

            Withdrawal Requests

          </h1>


          <p>

            Manage technician withdrawal requests.

          </p>

        </div>


        <button
          className="refresh-btn"
          onClick={fetchWithdrawals}
        >

          <FiRefreshCw />

          Refresh

        </button>

      </div>


      {/* LOADING */}

      {loading && (

        <div className="withdrawals-loading">

          Loading withdrawal requests...

        </div>

      )}


      {/* ERROR */}

      {!loading && error && (

        <div className="withdrawals-error">

          {error}

        </div>

      )}


      {/* =====================================
          WITHDRAWALS TABLE
      ====================================== */}

      {!loading && !error && (

        <div className="card withdrawals-table-wrap">

          <table className="withdrawals-table">

            <thead>

              <tr>

                <th>
                  ID
                </th>

                <th>
                  Technician
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Payment Method
                </th>

                <th>
                  Account Details
                </th>

                <th>
                  Requested Date
                </th>

                <th>
                  Status
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>


              {withdrawals.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="empty-row"
                  >

                    No withdrawal requests found.

                  </td>

                </tr>

              ) : (

                withdrawals.map(
                  (withdrawal) => (

                    <tr
                      key={withdrawal.id}
                    >

                      <td>

                        #{withdrawal.id}

                      </td>


                      <td>

                        <strong>

                          {
                            withdrawal.technician_name ||
                            "Unknown"
                          }

                        </strong>


                        <br />


                        <small>

                          {
                            withdrawal.technician_email ||
                            ""
                          }

                        </small>

                      </td>


                      <td className="withdrawal-amount">

                        {formatCurrency(
                          withdrawal.amount
                        )}

                      </td>


                      <td>

                        {
                          withdrawal.payment_method ||
                          "-"
                        }

                      </td>


                      <td className="account-details">

                        {
                          withdrawal.account_details ||
                          "-"
                        }

                      </td>


                      <td>

                        {
                          withdrawal.requested_at

                            ? new Date(
                                withdrawal.requested_at
                              ).toLocaleDateString(
                                "en-IN"
                              )

                            : "-"
                        }

                      </td>


                      <td>

                        <span
                          className={

                            `withdrawal-status ${

                              getStatusClass(
                                withdrawal.status
                              )

                            }`

                          }
                        >

                          {
                            withdrawal.status
                          }

                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="withdrawal-actions">


                          {/* PENDING */}

                          {withdrawal.status ===
                            "pending" && (

                              <>

                                <button
                                  className="action-btn approve-btn"
                                  disabled={
                                    actionLoading ===
                                    withdrawal.id
                                  }
                                  onClick={() =>
                                    approveWithdrawal(
                                      withdrawal.id
                                    )
                                  }
                                >

                                  <FiCheckCircle />

                                  Approve

                                </button>


                                <button
                                  className="action-btn reject-btn"
                                  disabled={
                                    actionLoading ===
                                    withdrawal.id
                                  }
                                  onClick={() =>
                                    rejectWithdrawal(
                                      withdrawal.id
                                    )
                                  }
                                >

                                  <FiXCircle />

                                  Reject

                                </button>

                              </>

                            )}


                          {/* APPROVED */}

                          {withdrawal.status ===
                            "approved" && (

                              <button
                                className="action-btn paid-btn"
                                disabled={
                                  actionLoading ===
                                  withdrawal.id
                                }
                                onClick={() =>
                                  markAsPaid(
                                    withdrawal.id
                                  )
                                }
                              >

                                <FiCreditCard />

                                Mark Paid

                              </button>

                            )}


                          {/* PAID */}

                          {withdrawal.status ===
                            "paid" && (

                              <span className="completed-action">

                                <FiCheckCircle />

                                Paid

                              </span>

                            )}


                          {/* REJECTED */}

                          {withdrawal.status ===
                            "rejected" && (

                              <span className="rejected-action">

                                <FiXCircle />

                                Rejected

                              </span>

                            )}


                        </div>

                      </td>

                    </tr>

                  )
                )

              )}


            </tbody>

          </table>

        </div>

      )}


    </div>

  );

}