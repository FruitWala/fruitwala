import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ FIXED
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // ✅ FIXED
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    amount: { type: Number, required: true },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address", // ✅ FIXED
      required: true,
    },
    status: { type: String, default: "Order Placed" },
    paymentType: { type: String, required: true },
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ FIXED model name (Capitalized)
const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
