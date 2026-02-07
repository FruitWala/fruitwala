import express from "express";
import { upload } from "../configs/multer.js";
import authSeller from "../middlewares/authSeller.js";
import {
  addProduct,
  changeStock,
  productById,
  productList,
  updateProduct,
} from "../controllers/productController.js";
import { deleteProduct } from "../controllers/productController.js";

const productRouter = express.Router();

/* ===============================
   ADD PRODUCT
================================ */
productRouter.post(
  "/add",
  authSeller,
  upload.array("images", 4),
  addProduct
);

/* ===============================
   GET ALL PRODUCTS
================================ */
productRouter.get("/list", productList);

/* ===============================
   GET SINGLE PRODUCT (EDIT)
   ✅ FIXED
================================ */
productRouter.get("/:id", authSeller, productById);

/* ===============================
   UPDATE PRODUCT (EDIT SAVE)
   ✅ NEW
================================ */
productRouter.post(
  "/update/:id",
  authSeller,
  upload.array("images", 4),
  updateProduct
);

/* ===============================
   CHANGE STOCK
================================ */
productRouter.post("/stock", authSeller, changeStock);
productRouter.delete("/delete/:id", authSeller, deleteProduct);

export default productRouter;
