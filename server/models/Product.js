import mongoose from "mongoose";

/* ===============================
   Variant Schema (Weight / Piece / Pack / Volume)
================================ */
const variantSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true
    // Example: "250g", "500g", "1kg", "1 pc", "500ml"
  },

  value: {
    type: Number,
    required: true
    // Example: 0.25, 0.5, 1
  },

  price: {
    type: Number,
    required: true
  },

  offerPrice: {
    type: Number,
    required: true
  }

}, { _id: false });


/* ===============================
   Product Schema
================================ */
const productSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  description: {
    type: Array,
    required: true
  },

  image: {
    type: Array,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  /* ===============================
     Unit Type
     weight → kg / gram
     piece → coconut / watermelon
     volume → milk / drinks
     pack → bread / noodles
  ================================ */
  unitType: {
    type: String,
    enum: ["weight", "piece", "volume", "pack"],
    default: "weight"
  },

  /* ===============================
     Variants
     Allows multiple options
  ================================ */
  variants: {
    type: [variantSchema],
    default: []
  },

  /* ===============================
     Legacy price (for old products)
  ================================ */
  price: {
    type: Number,
    default: 0
  },

  offerPrice: {
    type: Number,
    default: 0
  },

  inStock: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });


/* ===============================
   Export Model
================================ */
const Product =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema, "products");

export default Product;
