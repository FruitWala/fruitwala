import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

/* ===============================
   ADD PRODUCT
================================ */
export const addProduct = async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData);
    const images = req.files;

    const imagesUrl = await Promise.all(
      images.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    await Product.create({ ...productData, image: imagesUrl });

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

/* ===============================
   GET ALL PRODUCTS
================================ */
export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ===============================
   GET SINGLE PRODUCT (EDIT)
   ✅ FIXED
================================ */
export const productById = async (req, res) => {
  try {
    const { id } = req.params; // ✅ FIX
    const product = await Product.findById(id);

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ===============================
   UPDATE PRODUCT (EDIT SAVE)
   ✅ NEW
================================ */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = JSON.parse(req.body.productData || "{}");

    let updatedFields = { ...productData };

    // ✅ If new images uploaded
    if (req.files && req.files.length > 0) {
      const imagesUrl = await Promise.all(
        req.files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );

      updatedFields.image = imagesUrl;
    }

    await Product.findByIdAndUpdate(id, updatedFields);

    res.json({ success: true, message: "Product Updated Successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

/* ===============================
   CHANGE STOCK
================================ */
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    await Product.findByIdAndUpdate(id, { inStock });
    res.json({ success: true, message: "Stock Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete Product : /api/product/delete/:id
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    // Remove images from Cloudinary
    for (const image of product.image) {
      const publicId = image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await Product.findByIdAndDelete(id);

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
