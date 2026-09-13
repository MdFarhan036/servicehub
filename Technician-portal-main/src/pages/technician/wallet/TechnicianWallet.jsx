import { useEffect, useState } from "react";

import "./TechnicianWallet.css";
import API from "../../../services/api";

export default function TechnicianWallet() {
  const [wallet, setWallet] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [accountDetails, setAccountDetails] = useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const loadWallet = async () => {
    try {
      setLoading(true);

      const walletRes =
        await API.get(
          "/technician-withdrawals/wallet",
          {
            withCredentials: true,
          }
        );

      setWallet(
        walletRes.data.wallet
      );

      const historyRes =
        await API.get(
          "/technician-withdrawals/history",
          {
            withCredentials: true,
          }
        );

      setWithdrawals(
        historyRes.data.withdrawals || []
      );

    } catch (error) {

      console.error(
        "Failed to load wallet:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    loadWallet();

  }, []);


  const handleWithdrawal =
    async (e) => {

      e.preventDefault();


      if (
        !amount ||
        Number(amount) <= 0
      ) {

        alert(
          "Enter a valid withdrawal amount"
        );

        return;

      }


      try {

        setSubmitting(true);


        const res =
          await API.post(
            "/technician-withdrawals",
            {

              amount:
                Number(amount),

              payment_method:
                paymentMethod,

              account_details:
                accountDetails,

            },
            {
              withCredentials:
                true,
            }
          );


        alert(
          res.data.msg ||
          "Withdrawal request submitted"
        );


        setAmount("");

        setAccountDetails("");


        await loadWallet();

      } catch (error) {

        console.error(
          "Withdrawal error:",
          error
        );


        alert(
          error.response?.data?.msg ||
          "Failed to submit withdrawal request"
        );

      } finally {

        setSubmitting(false);

      }

    };


  if (loading) {

    return (
      <div className="wallet-page">

        Loading wallet...

      </div>
    );

  }


  return (
    <div className="wallet-page">

      {/* HEADER */}

      <div className="wallet-header">

        <div>

          <h1>
            My Wallet
          </h1>

          <p>
            Manage your earnings and withdrawals.
          </p>

        </div>

      </div>


      {/* WALLET CARDS */}

      <div className="wallet-stats">


        <div className="wallet-card primary">

          <span>
            Available Balance
          </span>

          <h2>
            ₹
            {Number(
              wallet?.availableBalance || 0
            ).toFixed(2)}
          </h2>

        </div>


        <div className="wallet-card">

          <span>
            Total Earned
          </span>

          <h2>
            ₹
            {Number(
              wallet?.totalEarnings || 0
            ).toFixed(2)}
          </h2>

        </div>


        <div className="wallet-card">

          <span>
            Total Withdrawn
          </span>

          <h2>
            ₹
            {Number(
              wallet?.totalWithdrawn || 0
            ).toFixed(2)}
          </h2>

        </div>


        <div className="wallet-card">

          <span>
            Pending Withdrawal
          </span>

          <h2>
            ₹
            {Number(
              wallet?.pendingWithdrawal || 0
            ).toFixed(2)}
          </h2>

        </div>

      </div>


      {/* WITHDRAWAL FORM */}

      <div className="wallet-content">


        <div className="withdraw-section">

          <h2>
            Request Withdrawal
          </h2>


          <form
            onSubmit={
              handleWithdrawal
            }
          >

            <div className="form-group">

              <label>
                Amount
              </label>

              <input
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value
                  )
                }
                placeholder="Enter amount"
              />

            </div>


            <div className="form-group">

              <label>
                Payment Method
              </label>

              <select
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
              >

                <option value="bank">
                  Bank Transfer
                </option>

                <option value="upi">
                  UPI
                </option>

              </select>

            </div>


            <div className="form-group">

              <label>
                Account Details
              </label>

              <textarea
                value={accountDetails}
                onChange={(e) =>
                  setAccountDetails(
                    e.target.value
                  )
                }
                placeholder={
                  paymentMethod === "upi"
                    ? "Enter UPI ID"
                    : "Enter bank account details"
                }
              />

            </div>


            <button
              type="submit"
              disabled={submitting}
            >

              {
                submitting
                  ? "Submitting..."
                  : "Request Withdrawal"
              }

            </button>

          </form>

        </div>


        {/* WITHDRAWAL HISTORY */}

        <div className="withdraw-history">

          <h2>
            Withdrawal History
          </h2>


          {withdrawals.length === 0 ? (

            <div className="empty-state">

              No withdrawal requests found.

            </div>

          ) : (

            <div className="withdraw-table-wrapper">

              <table>

                <thead>

                  <tr>

                    <th>
                      Amount
                    </th>

                    <th>
                      Payment Method
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Requested
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {
                    withdrawals.map(
                      (item) => (

                        <tr
                          key={
                            item.id
                          }
                        >

                          <td>

                            ₹
                            {Number(
                              item.amount
                            ).toFixed(2)}

                          </td>


                          <td>

                            {
                              item.payment_method
                            }

                          </td>


                          <td>

                            <span
                              className={
                                `status ${item.status}`
                              }
                            >

                              {
                                item.status
                              }

                            </span>

                          </td>


                          <td>

                            {
                              item.requested_at
                                ? new Date(
                                    item.requested_at
                                  ).toLocaleDateString()
                                : "-"
                            }

                          </td>

                        </tr>

                      )
                    )
                  }

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}