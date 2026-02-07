import React, { useEffect, useState } from "react";
import { assets, categories } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddProduct = () => {
  const { axios, fetchProducts } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");

  const isEditMode = Boolean(productId);

  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");

  /* ================= FETCH PRODUCT (EDIT MODE) ================= */
  useEffect(() => {
    if (!isEditMode) return;

    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/product/${productId}`);
        if (!data.success) {
          toast.error(data.message);
          return;
        }

        const product = data.product;

        setName(product.name || "");
        setDescription(product.description?.join("\n") || "");
        setCategory(product.category || "");
        setPrice(product.price ?? "");
        setOfferPrice(product.offerPrice ?? "");
        setExistingImages(product.image || []);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchProduct();
  }, [productId, isEditMode, axios]);

  /* ================= SUBMIT HANDLER ================= */
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const productData = {
        name: name.trim(),
        description: description
          .split("\n")
          .map((d) => d.trim())
          .filter(Boolean),
        category,
        price: Number(price),
        offerPrice: Number(offerPrice),
      };

      const formData = new FormData();
      formData.append("productData", JSON.stringify(productData));

      files.forEach((file) => {
        if (file) formData.append("images", file);
      });

      const url = isEditMode
        ? `/api/product/update/${productId}`
        : "/api/product/add";

      const { data } = await axios.post(url, formData);

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      fetchProducts();

      if (!isEditMode) {
        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setOfferPrice("");
        setFiles([]);
        setExistingImages([]);
      } else {
        setFiles([]);
        navigate("/seller/product-list"); // ✅ ONLY LINE ADDED
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <form
        onSubmit={onSubmitHandler}
        className="max-w-2xl mx-auto p-4 md:p-10 space-y-6"
      >
        <h2 className="text-lg font-medium">
          {isEditMode ? "Edit Product" : "Add New Product"}
        </h2>

        {/* IMAGES */}
        <div>
          <p className="text-sm font-medium mb-2">Product Images</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array(4)
              .fill(null)
              .map((_, index) => (
                <label
                  key={index}
                  className="cursor-pointer border rounded flex items-center justify-center bg-gray-50"
                >
                  <input
                    type="file"
                    hidden
                    onChange={(e) => {
                      const updated = [...files];
                      updated[index] = e.target.files[0];
                      setFiles(updated);
                    }}
                  />
                  <img
                    src={
                      files[index]
                        ? URL.createObjectURL(files[index])
                        : existingImages[index] || assets.upload_area
                    }
                    alt="upload"
                    className="w-full h-28 object-contain p-2"
                  />
                </label>
              ))}
          </div>
        </div>

        {/* PRODUCT NAME */}
        <div>
          <label className="text-sm font-medium">Product Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="w-full mt-1 border px-3 py-2 rounded focus:border-primary"
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full mt-1 border px-3 py-2 rounded resize-none focus:border-primary"
            placeholder="One point per line"
          />
        </div>

        {/* CATEGORY */}
        <div>
          <label className="text-sm font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-1 border px-3 py-2 rounded focus:border-primary"
            required
          >
            <option value="">Select Category</option>
            {categories.map((item, index) => (
              <option key={index} value={item.path}>
                {item.path}
              </option>
            ))}
          </select>
        </div>

        {/* PRICES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Price</label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              min="0"
              className="w-full mt-1 border px-3 py-2 rounded focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Offer Price</label>
            <input
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              type="number"
              min="0"
              className="w-full mt-1 border px-3 py-2 rounded focus:border-primary"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-10 py-2.5 bg-primary text-white rounded hover:bg-primary-dull transition"
        >
          {isEditMode ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
