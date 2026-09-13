import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema(
  {
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TechnicianWallet",
      required: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },

    type: {
      type: String,
      enum: [
        "booking_earning",
        "withdrawal",
        "adjustment",
        "refund",
      ],
      required: true,
    },

    transactionType: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    balanceAfter: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "completed",
        "failed",
        "cancelled",
      ],
      default: "completed",
    },
  },
  {
    timestamps: true,
  }
);

/*
 Prevent duplicate technician earning
 for the same booking
*/
walletTransactionSchema.index(
  {
    booking: 1,
    type: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      booking: {
        $type: "objectId",
      },
      type: "booking_earning",
    },
  }
);

export default mongoose.model(
  "WalletTransaction",
  walletTransactionSchema
);