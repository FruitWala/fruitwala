import mongoose from "mongoose";

/* ===============================
   Variant Schema (Weight / Piece / Volume / Pack)
================================ */
const variantSchema = new mongoose.Schema(
  {
    // Display label (UI)
    label: {
      type: String,
      required: true,
      trim: true,
      // Example: "250g", "500g", "1kg", "1 pc", "500ml"
    },

    // Numeric value (for calculations)
    value: {
      type: Number,
      required: true,
      // Example: 250, 500, 1
    },

    // Unit type
    unit: {
      type: String,
      required: true,
      enum: ["g", "kg", "ml", "l", "pcs", "pack"],
      // Helps in filtering, sorting, future scaling
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    offerPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

/* ===============================
   Product Schema
================================ */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: [String], // array of strings
      required: true,
    },

    image: {
      type: [String],
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    /* ===============================
       Unit Type (for product grouping)
    ================================ */
    unitType: {
      type: String,
      enum: ["weight", "piece", "volume", "pack"],
      default: "weight",
    },

    /* ===============================
       Variants
    ================================ */
    variants: {
      type: [variantSchema],
      default: [],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one variant is required",
      },
    },

    /* ===============================
       Legacy price (fallback)
    ================================ */
    price: {
      type: Number,
      default: 0,
    },

    offerPrice: {
      type: Number,
      default: 0,
    },

    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/* ===============================
   Export Model
================================ */
const Product =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema, "products");

export default Product;
