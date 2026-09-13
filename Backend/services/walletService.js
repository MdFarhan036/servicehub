import db from "../config/db.js";

/*
==========================================
CREDIT TECHNICIAN WALLET
==========================================
*/

export const creditTechnicianWallet = ({
  technicianId,
  bookingId,
  amount,
}) => {
  return new Promise((resolve, reject) => {

    const earningAmount = Number(amount);

    if (!technicianId) {
      return reject(
        new Error("Technician ID is required")
      );
    }

    if (!bookingId) {
      return reject(
        new Error("Booking ID is required")
      );
    }

    if (!earningAmount || earningAmount <= 0) {
      return reject(
        new Error("Invalid wallet amount")
      );
    }


    /*
    START DATABASE TRANSACTION
    */

    db.beginTransaction((transactionError) => {

      if (transactionError) {
        return reject(transactionError);
      }


      /*
      CHECK IF BOOKING ALREADY
      CREDITED TO WALLET
      */

      const checkSql = `
        SELECT id
        FROM wallet_transactions
        WHERE booking_id = ?
        AND type = 'booking_earning'
        LIMIT 1
      `;


      db.query(
        checkSql,
        [bookingId],
        (checkError, transactions) => {

          if (checkError) {

            return db.rollback(() => {
              reject(checkError);
            });

          }


          /*
          ALREADY CREDITED
          */

          if (transactions.length > 0) {

            return db.commit((commitError) => {

              if (commitError) {
                return db.rollback(() => {
                  reject(commitError);
                });
              }

              resolve({
                alreadyCredited: true,
                transaction:
                  transactions[0],
              });

            });

          }


          /*
          GET TECHNICIAN WALLET
          */

          const walletSql = `
            SELECT *
            FROM technician_wallets
            WHERE technician_id = ?
            LIMIT 1
          `;


          db.query(
            walletSql,
            [technicianId],
            (walletError, wallets) => {

              if (walletError) {

                return db.rollback(() => {
                  reject(walletError);
                });

              }


              /*
              CREATE WALLET IF NOT EXISTS
              */

              if (wallets.length === 0) {

                const createWalletSql = `
                  INSERT INTO technician_wallets
                  (
                    technician_id,
                    balance,
                    total_earned
                  )
                  VALUES (?, 0, 0)
                `;


                db.query(
                  createWalletSql,
                  [technicianId],
                  (createError, createResult) => {

                    if (createError) {

                      return db.rollback(() => {
                        reject(createError);
                      });

                    }


                    processWallet(
                      createResult.insertId
                    );

                  }
                );

              } else {

                processWallet(
                  wallets[0].id
                );

              }


              /*
              PROCESS WALLET CREDIT
              */

              function processWallet(walletId) {

                /*
                UPDATE WALLET
                */

                const updateWalletSql = `
                  UPDATE technician_wallets

                  SET
                    balance =
                      balance + ?,

                    total_earned =
                      total_earned + ?

                  WHERE id = ?
                  AND status = 'active'
                `;


                db.query(
                  updateWalletSql,
                  [
                    earningAmount,
                    earningAmount,
                    walletId,
                  ],
                  (updateError, updateResult) => {

                    if (updateError) {

                      return db.rollback(() => {
                        reject(updateError);
                      });

                    }


                    if (
                      updateResult.affectedRows === 0
                    ) {

                      return db.rollback(() => {

                        reject(
                          new Error(
                            "Wallet is blocked or unavailable"
                          )
                        );

                      });

                    }


                    /*
                    GET UPDATED BALANCE
                    */

                    const balanceSql = `
                      SELECT balance
                      FROM technician_wallets
                      WHERE id = ?
                    `;


                    db.query(
                      balanceSql,
                      [walletId],
                      (balanceError, balanceResult) => {

                        if (balanceError) {

                          return db.rollback(() => {
                            reject(balanceError);
                          });

                        }


                        const balanceAfter =
                          Number(
                            balanceResult[0]
                              .balance
                          );


                        /*
                        CREATE WALLET TRANSACTION
                        */

                        const insertTransactionSql = `
                          INSERT INTO wallet_transactions
                          (
                            technician_id,
                            wallet_id,
                            booking_id,
                            type,
                            transaction_type,
                            amount,
                            balance_after,
                            description,
                            status
                          )
                          VALUES
                          (
                            ?, ?, ?,
                            'booking_earning',
                            'credit',
                            ?, ?, ?,
                            'completed'
                          )
                        `;


                        db.query(
                          insertTransactionSql,
                          [
                            technicianId,
                            walletId,
                            bookingId,
                            earningAmount,
                            balanceAfter,
                            "Booking earning credited to wallet",
                          ],
                          (insertError, result) => {

                            if (insertError) {

                              return db.rollback(() => {
                                reject(insertError);
                              });

                            }


                            /*
                            COMMIT EVERYTHING
                            */

                            db.commit(
                              (commitError) => {

                                if (commitError) {

                                  return db.rollback(() => {
                                    reject(
                                      commitError
                                    );
                                  });

                                }


                                resolve({

                                  alreadyCredited:
                                    false,

                                  walletId,

                                  transactionId:
                                    result.insertId,

                                  balanceAfter,

                                });

                              }
                            );

                          }
                        );

                      }
                    );

                  }
                );

              }

            }
          );

        }
      );

    });

  });
};