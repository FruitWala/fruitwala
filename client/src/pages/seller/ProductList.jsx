import React from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ProductList = () => {
  const { products, currency, axios, fetchProducts } = useAppContext();

  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post("/api/product/stock", { id, inStock });
      if (data.success) {
        fetchProducts();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Products</h2>

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden md:block max-w-5xl overflow-hidden rounded-md bg-white border border-gray-300">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 text-gray-900 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
              </tr>
            </thead>

            <tbody className="text-sm text-gray-600">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded border"
                    />
                    <span className="font-medium">{product.name}</span>
                  </td>

                  <td className="px-4 py-3">{product.category}</td>

                  <td className="px-4 py-3">
                    {currency}
                    {product.offerPrice}
                  </td>

                  <td className="px-4 py-3">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={product.inStock}
                        onChange={() =>
                          toggleStock(product._id, !product.inStock)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-primary transition"></div>
                      <div className="absolute ml-1 mt-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE CARDS ================= */}
        <div className="md:hidden space-y-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded border"
                />

                <div className="flex-1">
                  <h3 className="font-medium text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-500">
                    Category: {product.category}
                  </p>
                  <p className="text-primary font-medium mt-1">
                    {currency}
                    {product.offerPrice}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-600">In Stock</span>

                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={product.inStock}
                    onChange={() =>
                      toggleStock(product._id, !product.inStock)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-12 h-7 bg-gray-300 rounded-full peer peer-checked:bg-primary transition"></div>
                  <div className="absolute ml-1 mt-1 w-5 h-5 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
