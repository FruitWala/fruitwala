import React, { useState } from "react";
import { assets, categories } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddProduct = () => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");

  const { axios } = useAppContext();

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      const productData = {
        name,
        description: description.split("\n"),
        category,
        price,
        offerPrice,
      };

      const formData = new FormData();
      formData.append("productData", JSON.stringify(productData));

      files.forEach((file) => {
        if (file) formData.append("images", file);
      });

      const { data } = await axios.post("/api/product/add", formData);

      if (data.success) {
        toast.success(data.message);
        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setOfferPrice("");
        setFiles([]);
      } else {
        toast.error(data.message);
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
        <h2 className="text-lg font-medium">Add New Product</h2>

        {/* IMAGES */}
        <div>
          <p className="text-sm font-medium mb-2">Product Images</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <label
                  key={index}
                  htmlFor={`image${index}`}
                  className="cursor-pointer border rounded flex items-center justify-center bg-gray-50"
                >
                  <input
                    id={`image${index}`}
                    type="file"
                    hidden
                    onChange={(e) => {
                      const updatedFiles = [...files];
                      updatedFiles[index] = e.target.files[0];
                      setFiles(updatedFiles);
                    }}
                  />
                  <img
                    src={
                      files[index]
                        ? URL.createObjectURL(files[index])
                        : assets.upload_area
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
            placeholder="Enter product name"
            className="w-full mt-1 border px-3 py-2 rounded outline-none focus:border-primary"
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
            placeholder="One point per line"
            className="w-full mt-1 border px-3 py-2 rounded outline-none resize-none focus:border-primary"
          />
        </div>

        {/* CATEGORY */}
        <div>
          <label className="text-sm font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-1 border px-3 py-2 rounded outline-none focus:border-primary"
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
              placeholder="0"
              className="w-full mt-1 border px-3 py-2 rounded outline-none focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Offer Price</label>
            <input
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              type="number"
              placeholder="0"
              className="w-full mt-1 border px-3 py-2 rounded outline-none focus:border-primary"
              required
            />
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full sm:w-auto px-10 py-2.5 bg-primary text-white rounded hover:bg-primary-dull transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
