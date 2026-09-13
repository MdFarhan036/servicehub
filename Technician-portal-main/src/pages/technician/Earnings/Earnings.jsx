import {
  useEffect,
  useState,
} from "react";

import {
  FiDollarSign,
  FiTrendingUp,
  FiCalendar,
  FiCreditCard,
  FiArrowUpCircle,
  FiX,
} from "react-icons/fi";

import API from "../../../services/api";

import "./Earnings.css";


export default function Earnings() {

  const [wallet, setWallet] =
    useState(null);

  const [transactions, setTransactions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /*
  ==========================================
  WITHDRAW STATES
  ==========================================
  */

  const [showWithdrawModal, setShowWithdrawModal] =
    useState(false);

  const [withdrawAmount, setWithdrawAmount] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("upi");

  const [accountDetails, setAccountDetails] =
    useState("");

  const [withdrawing, setWithdrawing] =
    useState(false);

  const [withdrawError, setWithdrawError] =
    useState("");

  const [withdrawSuccess, setWithdrawSuccess] =
    useState("");


  /*
  ==========================================
  FETCH WALLET DATA
  ==========================================
  */

  const fetchWalletData =
    async () => {

      try {

        setLoading(true);

        setError("");


        const [
          walletRes,
          transactionRes,
        ] = await Promise.all([

          API.get(
            "/wallet/my-wallet"
          ),

          API.get(
            "/wallet/transactions"
          ),

        ]);


        setWallet(
          walletRes.data.wallet
        );


        setTransactions(
          transactionRes.data.transactions || []
        );


      } catch (err) {

        console.error(
          "Failed to load wallet:",
          err
        );


        setError(

          err.response?.data?.message ||

          err.response?.data?.msg ||

          "Failed to load wallet."

        );


        setWallet(null);

        setTransactions([]);


      } finally {

        setLoading(false);

      }

    };


  useEffect(() => {

    fetchWalletData();

  }, []);


  /*
  ==========================================
  OPEN WITHDRAW MODAL
  ==========================================
  */

  const openWithdrawModal = () => {

    setWithdrawAmount("");

    setPaymentMethod("upi");

    setAccountDetails("");

    setWithdrawError("");

    setWithdrawSuccess("");

    setShowWithdrawModal(true);

  };


  /*
  ==========================================
  CLOSE WITHDRAW MODAL
  ==========================================
  */

  const closeWithdrawModal = () => {

    if (withdrawing) return;

    setShowWithdrawModal(false);

    setWithdrawError("");

    setWithdrawSuccess("");

  };


  /*
  ==========================================
  SUBMIT WITHDRAW REQUEST
  ==========================================
  */

  const handleWithdraw =
    async (event) => {

      event.preventDefault();


      setWithdrawError("");

      setWithdrawSuccess("");


      const amount =
        Number(withdrawAmount);


      const availableBalance =
        Number(
          wallet?.balance || 0
        );


      /*
      VALIDATE AMOUNT
      */

      if (
        !amount ||
        amount <= 0
      ) {

        setWithdrawError(
          "Please enter a valid withdrawal amount."
        );

        return;

      }


      /*
      CHECK AVAILABLE BALANCE
      */

      if (
        amount >
        availableBalance
      ) {

        setWithdrawError(
          "Withdrawal amount cannot exceed your available balance."
        );

        return;

      }


      /*
      VALIDATE PAYMENT DETAILS
      */

      if (
        !accountDetails.trim()
      ) {

        setWithdrawError(

          paymentMethod === "upi"

            ? "Please enter your UPI ID."

            : "Please enter your bank account details."

        );

        return;

      }


      try {

        setWithdrawing(true);


        /*
        ======================================
        SEND WITHDRAW REQUEST
        ======================================
        */

        const res =
          await API.post(

            "/technician-withdrawals",

            {

              amount,

              payment_method:
                paymentMethod,

              account_details:
                accountDetails.trim(),

            }

          );


        setWithdrawSuccess(

          res.data.msg ||

          "Withdrawal request submitted successfully."

        );


        /*
        REFRESH WALLET
        */

        await fetchWalletData();


        /*
        CLOSE MODAL
        */

        setTimeout(
          () => {

            setShowWithdrawModal(
              false
            );

          },
          1500
        );


      } catch (err) {

        console.error(
          "Withdrawal failed:",
          err
        );


        setWithdrawError(

          err.response?.data?.msg ||

          err.response?.data?.message ||

          "Failed to submit withdrawal request."

        );


      } finally {

        setWithdrawing(false);

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

          style:
            "currency",

          currency:
            "INR",

          maximumFractionDigits:
            2,

        }

      ).format(

        Number(amount || 0)

      );

    };


  /*
  ==========================================
  BOOKING EARNINGS
  ==========================================
  */

  const bookingEarnings =
    transactions.filter(

      (transaction) =>

        transaction.type ===
          "booking_earning"

        &&

        transaction.transaction_type ===
          "credit"

        &&

        transaction.status ===
          "completed"

    );


  /*
  ==========================================
  THIS MONTH EARNINGS
  ==========================================
  */

  const currentMonth =
    new Date().getMonth();

  const currentYear =
    new Date().getFullYear();


  const thisMonth =
    bookingEarnings

      .filter(
        (transaction) => {

          if (
            !transaction.created_at
          ) {

            return false;

          }


          const date =
            new Date(
              transaction.created_at
            );


          return (

            date.getMonth() ===
            currentMonth

            &&

            date.getFullYear() ===
            currentYear

          );

        }
      )

      .reduce(

        (
          total,
          transaction
        ) =>

          total +

          Number(
            transaction.amount || 0
          ),

        0

      );


  /*
  ==========================================
  COMPLETED JOBS
  ==========================================
  */

  const paidJobs =
    bookingEarnings.length;


  return (

    <div>


      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="wallet-header">

        <div>

          <h1
            className="earnings-title"
          >

            My Wallet

          </h1>

          <p className="wallet-subtitle">

            Manage your earnings and
            withdrawal requests.

          </p>

        </div>


        <button
          className="withdraw-btn"
          onClick={openWithdrawModal}
          disabled={loading}
        >

          <FiArrowUpCircle />

          Withdraw Money

        </button>

      </div>


      {loading && (

        <div
          className="jobs-loading"
        >

          Loading wallet...

        </div>

      )}


      {!loading && error && (

        <div
          className="jobs-error"
        >

          {error}

        </div>

      )}


      {!loading && !error && (

        <>


          {/* =====================================
              WALLET SUMMARY
          ===================================== */}

          <div
            className="earnings-summary"
          >


            {/* AVAILABLE BALANCE */}

            <div
              className="
                card
                earnings-stat
              "
            >

              <FiCreditCard
                className="es-icon"
              />

              <div>

                <p
                  className="es-value"
                >

                  {formatCurrency(
                    wallet?.balance
                  )}

                </p>

                <span>
                  Available Balance
                </span>

              </div>

            </div>


            {/* TOTAL EARNINGS */}

            <div
              className="
                card
                earnings-stat
              "
            >

              <FiDollarSign
                className="es-icon"
              />

              <div>

                <p
                  className="es-value"
                >

                  {formatCurrency(
                    wallet?.total_earned
                  )}

                </p>

                <span>
                  Total Earnings
                </span>

              </div>

            </div>


            {/* THIS MONTH */}

            <div
              className="
                card
                earnings-stat
              "
            >

              <FiTrendingUp
                className="es-icon"
              />

              <div>

                <p
                  className="es-value"
                >

                  {formatCurrency(
                    thisMonth
                  )}

                </p>

                <span>
                  This Month
                </span>

              </div>

            </div>


            {/* COMPLETED JOBS */}

            <div
              className="
                card
                earnings-stat
              "
            >

              <FiCalendar
                className="es-icon"
              />

              <div>

                <p
                  className="es-value"
                >

                  {paidJobs}

                </p>

                <span>
                  Completed Jobs
                </span>

              </div>

            </div>

          </div>


          {/* =====================================
              TRANSACTION HISTORY
          ===================================== */}

          <div
            className="
              card
              earnings-table-wrap
            "
          >

            <h2
              className="
                earnings-section-title
              "
            >

              Transaction History

            </h2>


            <table
              className="
                earnings-table
              "
            >

              <thead>

                <tr>

                  <th>Job ID</th>

                  <th>Service</th>

                  <th>Transaction</th>

                  <th>Date</th>

                  <th>Amount</th>

                  <th>Balance</th>

                </tr>

              </thead>


              <tbody>

                {transactions.length ===
                0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="text-gray"
                    >

                      No transactions found.

                    </td>

                  </tr>

                ) : (

                  transactions.map(
                    (transaction) => (

                      <tr
                        key={
                          transaction.id
                        }
                      >

                        <td>

                          {transaction.booking_id
                            ? `#${transaction.booking_id}`
                            : "-"}

                        </td>


                        <td>

                          {
                            transaction.service_name ||

                            transaction.description ||

                            "-"
                          }

                        </td>


                        <td>

                          <span
                            className={

                              transaction.transaction_type ===
                              "credit"

                                ? "paid-pill"

                                : "debit-pill"

                            }
                          >

                            {

                              transaction.transaction_type ===
                              "credit"

                                ? "Earning"

                                : "Withdrawal"

                            }

                          </span>

                        </td>


                        <td>

                          {transaction.created_at

                            ? new Date(
                                transaction.created_at
                              ).toLocaleDateString(
                                "en-IN"
                              )

                            : "-"}

                        </td>


                        <td

                          className={

                            transaction.transaction_type ===
                            "credit"

                              ? "amount-cell credit-amount"

                              : "amount-cell debit-amount"

                          }

                        >

                          {

                            transaction.transaction_type ===
                            "credit"

                              ? "+"

                              : "-"

                          }


                          {formatCurrency(
                            transaction.amount
                          )}

                        </td>


                        <td>

                          {formatCurrency(
                            transaction.balance_after
                          )}

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


      {/* =====================================
          WITHDRAW MODAL
      ===================================== */}

      {showWithdrawModal && (

        <div
          className="withdraw-modal-overlay"
        >

          <div
            className="withdraw-modal"
          >


            <div
              className="withdraw-modal-header"
            >

              <div>

                <h2>
                  Withdraw Money
                </h2>

                <p>

                  Available:

                  {" "}

                  {formatCurrency(
                    wallet?.balance
                  )}

                </p>

              </div>


              <button
                className="modal-close-btn"
                onClick={
                  closeWithdrawModal
                }
              >

                <FiX />

              </button>

            </div>


            <form
              onSubmit={
                handleWithdraw
              }
            >


              {withdrawError && (

                <div
                  className="withdraw-error"
                >

                  {withdrawError}

                </div>

              )}


              {withdrawSuccess && (

                <div
                  className="withdraw-success"
                >

                  {withdrawSuccess}

                </div>

              )}


              {/* AMOUNT */}

              <div
                className="withdraw-field"
              >

                <label>

                  Withdrawal Amount

                </label>

                <input

                  type="number"

                  min="1"

                  max={
                    wallet?.balance || 0
                  }

                  step="0.01"

                  value={
                    withdrawAmount
                  }

                  onChange={
                    (event) =>

                      setWithdrawAmount(
                        event.target.value
                      )
                  }

                  placeholder="Enter amount"

                  disabled={
                    withdrawing
                  }

                />

              </div>


              {/* PAYMENT METHOD */}

              <div
                className="withdraw-field"
              >

                <label>

                  Payment Method

                </label>

                <select

                  value={
                    paymentMethod
                  }

                  onChange={
                    (event) =>

                      setPaymentMethod(
                        event.target.value
                      )
                  }

                  disabled={
                    withdrawing
                  }

                >

                  <option value="upi">

                    UPI

                  </option>

                  <option value="bank">

                    Bank Transfer

                  </option>

                </select>

              </div>


              {/* ACCOUNT DETAILS */}

              <div
                className="withdraw-field"
              >

                <label>

                  {

                    paymentMethod === "upi"

                      ? "UPI ID"

                      : "Bank Account Details"

                  }

                </label>


                <textarea

                  value={
                    accountDetails
                  }

                  onChange={
                    (event) =>

                      setAccountDetails(
                        event.target.value
                      )
                  }

                  placeholder={

                    paymentMethod === "upi"

                      ? "example@upi"

                      : "Account number, IFSC and account holder name"

                  }

                  disabled={
                    withdrawing
                  }

                />

              </div>


              {/* SUBMIT */}

              <button

                type="submit"

                className="withdraw-submit-btn"

                disabled={
                  withdrawing
                }

              >

                {

                  withdrawing

                    ? "Submitting..."

                    : "Submit Withdrawal Request"

                }

              </button>

            </form>

          </div>

        </div>

      )}

    </div>

  );

}