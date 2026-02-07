import React from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ProductList = () => {
  const { products, currency, axios, fetchProducts, navigate } =
    useAppContext();

  /* ================= STOCK ================= */
  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post("/api/product/stock", { id, inStock });
      if (data.success) {
        toast.success("Stock updated");
        fetchProducts();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  /* ================= DELETE ================= */
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;

    try {
      const { data } = await axios.delete(`/api/product/delete/${id}`);
      if (data.success) {
        toast.success(data.message);
        fetchProducts();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Products</h2>

        {/* ================= DESKTOP ================= */}
        <div className="hidden md:block max-w-6xl bg-white border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {products.map((product) => (
                <tr key={product._id} className="border-t">
                  {/* PRODUCT */}
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      className="w-14 h-14 rounded border object-cover"
                    />
                    <span className="font-medium">{product.name}</span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    {product.category}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {currency}
                    {product.offerPrice}
                  </td>

                  {/* STOCK TOGGLE — ORIGINAL UI */}
                  <td className="px-4 py-3 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={product.inStock}
                        onChange={() =>
                          toggleStock(product._id, !product.inStock)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-primary transition"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
                    </label>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/seller/add-product?id=${product._id}`)
                        }
                        className="px-3 py-1 text-sm border border-primary text-primary rounded hover:bg-primary/10"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="px-3 py-1 text-sm border border-red-500 text-red-500 rounded hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE ================= */}
        <div className="md:hidden space-y-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg p-4 bg-white"
            >
              <div className="flex gap-4">
                <img
                  src={product.image[0]}
                  className="w-20 h-20 rounded border object-cover"
                />
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    {product.category}
                  </p>
                  <p className="text-primary">
                    {currency}
                    {product.offerPrice}
                  </p>
                </div>
              </div>

              {/* STOCK */}
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm">In Stock</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={product.inStock}
                    onChange={() =>
                      toggleStock(product._id, !product.inStock)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-primary transition"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
                </label>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() =>
                    navigate(`/seller/add-product?id=${product._id}`)
                  }
                  className="flex-1 border py-2 rounded text-primary"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteProduct(product._id)}
                  className="flex-1 border py-2 rounded text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
