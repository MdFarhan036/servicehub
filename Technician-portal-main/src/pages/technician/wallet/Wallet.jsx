import { useEffect, useState } from "react";
import API from "../../../services/api.js";

export default function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWallet();
  }, []);


  const loadWallet = async () => {
    try {
      setLoading(true);

      const walletResponse = await API.get(
        "/wallet/my-wallet"
      );

      const transactionResponse = await API.get(
        "/wallet/transactions"
      );

      setWallet(
        walletResponse.data.wallet
      );

      setTransactions(
        transactionResponse.data.transactions
      );

    } catch (error) {
      console.error(
        "Wallet loading error:",
        error
      );

    } finally {
      setLoading(false);
    }
  };


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }
    ).format(Number(amount || 0));
  };


  if (loading) {
    return (
      <div className="p-6">
        Loading wallet...
      </div>
    );
  }


  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        My Wallet
      </h1>


      {/* WALLET SUMMARY */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* AVAILABLE BALANCE */}

        <div className="bg-white rounded-xl shadow p-5">

          <p className="text-gray-500">
            Available Balance
          </p>

          <h2 className="text-2xl font-bold mt-2">
            {formatCurrency(
              wallet?.balance
            )}
          </h2>

        </div>


        {/* TOTAL EARNED */}

        <div className="bg-white rounded-xl shadow p-5">

          <p className="text-gray-500">
            Total Earned
          </p>

          <h2 className="text-xl font-bold mt-2">
            {formatCurrency(
              wallet?.total_earned
            )}
          </h2>

        </div>


        {/* TOTAL WITHDRAWN */}

        <div className="bg-white rounded-xl shadow p-5">

          <p className="text-gray-500">
            Total Withdrawn
          </p>

          <h2 className="text-xl font-bold mt-2">
            {formatCurrency(
              wallet?.total_withdrawn
            )}
          </h2>

        </div>


        {/* PENDING */}

        <div className="bg-white rounded-xl shadow p-5">

          <p className="text-gray-500">
            Pending Withdrawal
          </p>

          <h2 className="text-xl font-bold mt-2">
            {formatCurrency(
              wallet?.pending_withdrawal
            )}
          </h2>

        </div>

      </div>


      {/* TRANSACTIONS */}

      <div className="bg-white rounded-xl shadow mt-8 p-6">

        <h2 className="text-xl font-bold mb-5">
          Recent Transactions
        </h2>


        {transactions.length === 0 ? (

          <p className="text-gray-500">
            No transactions found.
          </p>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="text-left p-3">
                    Type
                  </th>

                  <th className="text-left p-3">
                    Service
                  </th>

                  <th className="text-left p-3">
                    Amount
                  </th>

                  <th className="text-left p-3">
                    Balance
                  </th>

                  <th className="text-left p-3">
                    Date
                  </th>

                </tr>

              </thead>


              <tbody>

                {transactions.map(
                  (transaction) => (

                    <tr
                      key={transaction.id}
                      className="border-b"
                    >

                      <td className="p-3">

                        {transaction.transaction_type ===
                        "credit"
                          ? "Booking Earning"
                          : "Withdrawal"}

                      </td>


                      <td className="p-3">

                        {transaction.service_name ||
                          "-"}

                      </td>


                      <td
                        className={`p-3 font-semibold ${
                          transaction.transaction_type ===
                          "credit"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >

                        {transaction.transaction_type ===
                        "credit"
                          ? "+"
                          : "-"}

                        {formatCurrency(
                          transaction.amount
                        )}

                      </td>


                      <td className="p-3">

                        {formatCurrency(
                          transaction.balance_after
                        )}

                      </td>


                      <td className="p-3">

                        {new Date(
                          transaction.created_at
                        ).toLocaleDateString(
                          "en-IN"
                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}