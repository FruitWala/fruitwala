import mongoose from "mongoose";

/* ===============================
   ORDER ITEM SCHEMA
================================ */

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // ✅ STORE VARIANT / WEIGHT
    variant: {
      label: {
        type: String,
        required: true, // e.g. 1kg, 500g
      },
      price: {
        type: Number,
        required: true,
      },
      offerPrice: {
        type: Number,
        required: true,
      },
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

/* ===============================
   ORDER SCHEMA
================================ */

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    status: {
      type: String,
      enum: ["Order Placed", "Delivered", "Cancelled"],
      default: "Order Placed",
    },

    cancelledBy: {
      type: String,
      enum: ["USER", "SELLER"],
      default: null,
    },

    paymentType: {
      type: String,
      required: true,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* ===============================
   EXPORT MODEL
================================ */

export default mongoose.models.Order ||
  mongoose.model("Order", orderSchema, "orders");
  