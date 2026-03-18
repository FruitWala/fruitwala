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

  const [variants, setVariants] = useState([
    { label: "", price: "", offerPrice: "" },
  ]);

  /* ================= FETCH PRODUCT ================= */

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
        setExistingImages(product.image || []);

        if (product.variants?.length) {
          setVariants(
            product.variants.map((v) => ({
              label: v.label,
              price: v.price,
              offerPrice: v.offerPrice,
            }))
          );
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchProduct();
  }, [productId]);

  /* ================= VARIANT HANDLERS ================= */

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([...variants, { label: "", price: "", offerPrice: "" }]);
  };

  const removeVariant = (index) => {
    if (variants.length === 1) {
      toast.error("At least one variant is required");
      return;
    }

    const updated = variants.filter((_, i) => i !== index);
    setVariants(updated);
  };

  /* ================= HELPER: PARSE LABEL ================= */

  const parseVariant = (label) => {
    let value = 1;
    let unit = "pcs";

    if (!label) return { value, unit }; // ✅ FIX

    const text = label.toLowerCase().trim();

    if (text.includes("kg")) {
      value = parseFloat(text) || 1;
      unit = "kg";
    } else if (text.includes("g")) {
      value = parseFloat(text) || 1;
      unit = "g";
    } else if (text.includes("ml")) {
      value = parseFloat(text) || 1;
      unit = "ml";
    } else if (text.includes("l")) {
      value = parseFloat(text) || 1;
      unit = "l";
    } else if (text.includes("piece") || text.includes("pc")) {
      value = 1;
      unit = "pcs";
    }

    return { value, unit };
  };

  /* ================= SUBMIT HANDLER ================= */

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      // ✅ FIX: remove empty variants
      const validVariants = variants.filter(
        (v) => v.label && v.price && v.offerPrice
      );

      // ✅ FIX: prevent empty submission
      if (validVariants.length === 0) {
        toast.error("Please add at least one valid variant");
        return;
      }

      const formattedVariants = validVariants.map((v) => {
        const { value, unit } = parseVariant(v.label);

        return {
          label: v.label,
          value,
          unit,
          price: Number(v.price),
          offerPrice: Number(v.offerPrice),
        };
      });

      const productData = {
        name: name.trim(),

        description: description
          .split("\n")
          .map((d) => d.trim())
          .filter(Boolean),

        category,

        variants: formattedVariants,
      };

      console.log(productData);

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
        setVariants([{ label: "", price: "", offerPrice: "" }]);
        setFiles([]);
        setExistingImages([]);
      } else {
        navigate("/seller/product-list");
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
        <h2 className="text-lg font-semibold">
          {isEditMode ? "Edit Product" : "Add New Product"}
        </h2>

        {/* PRODUCT IMAGES */}

        <div>
          <p className="text-sm font-medium mb-2">Product Images</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array(4)
              .fill(null)
              .map((_, index) => (
                <label
                  key={index}
                  className="cursor-pointer border rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition"
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
            className="w-full mt-1 border px-3 py-2 rounded-lg focus:border-primary outline-none"
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
            className="w-full mt-1 border px-3 py-2 rounded-lg resize-none focus:border-primary outline-none"
            placeholder="One point per line"
          />
        </div>

        {/* CATEGORY */}

        <div>
          <label className="text-sm font-medium">Category</label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-1 border px-3 py-2 rounded-lg focus:border-primary outline-none"
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

        {/* PRODUCT VARIANTS */}

        <div>
          <label className="text-sm font-semibold">Product Variants</label>

          <div className="mt-3 space-y-3">
            {variants.map((variant, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-3 items-center border rounded-lg p-3 bg-gray-50"
              >
                <input
                  type="text"
                  placeholder="Label (250g / 1kg / 6 pcs)"
                  value={variant.label}
                  onChange={(e) =>
                    handleVariantChange(index, "label", e.target.value)
                  }
                  className="col-span-4 border px-3 py-2 rounded-lg outline-none"
                  required
                />

                <input
                  type="number"
                  placeholder="Price"
                  value={variant.price}
                  onChange={(e) =>
                    handleVariantChange(index, "price", e.target.value)
                  }
                  className="col-span-3 border px-3 py-2 rounded-lg outline-none"
                  required
                />

                <input
                  type="number"
                  placeholder="Offer Price"
                  value={variant.offerPrice}
                  onChange={(e) =>
                    handleVariantChange(index, "offerPrice", e.target.value)
                  }
                  className="col-span-3 border px-3 py-2 rounded-lg outline-none"
                  required
                />

                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="col-span-2 flex justify-center items-center text-red-500 hover:bg-red-100 rounded-lg text-lg h-full"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addVariant}
            className="mt-4 text-sm text-primary font-medium hover:underline"
          >
            + Add Variant
          </button>
        </div>

        {/* SUBMIT */}

        <button
          type="submit"
          className="w-full sm:w-auto px-10 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dull transition"
        >
          {isEditMode ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
