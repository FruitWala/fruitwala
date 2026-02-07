import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const {
    currency,
    addToCart,
    removeFromCart,
    cartItems,
    navigate,
    user,
    setShowUserLogin,
  } = useAppContext();

  if (!product) return null;

  const handleAdd = (e) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to add products to cart");
      setShowUserLogin(true);
      return;
    }

    addToCart(product._id);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    removeFromCart(product._id);
  };

  return (
    <div
      onClick={() => {
        navigate(
          `/products/${product.category.toLowerCase()}/${product._id}`
        );
        window.scrollTo(0, 0);
      }}
      className="w-full border border-gray-200 rounded-lg bg-white
      p-3 sm:p-4 cursor-pointer hover:shadow-md transition"
    >
      {/* Image */}
      <div className="flex items-center justify-center aspect-square mb-3">
        <img
          src={product.image[0]}
          alt={product.name}
          className="max-h-32 sm:max-h-36 md:max-h-40 object-contain
          transition-transform hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="space-y-1">
        <p className="text-xs sm:text-sm text-gray-500">
          {product.category}
        </p>

        <p className="text-sm sm:text-base font-medium text-gray-800 line-clamp-2">
          {product.name}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 text-xs">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <img
                key={i}
                className="w-3.5"
                src={
                  i < 4 ? assets.star_icon : assets.star_dull_icon
                }
                alt=""
              />
            ))}
          <span className="text-gray-500">(4)</span>
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between mt-3">
          {/* PRICE (CORRECT ORDER) */}
          <div className="flex flex-col leading-tight">
            {/* Original Price */}
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              {currency}
              {product.price}
              <span className="ml-1">/ kg</span>
            </span>

            {/* Offer Price */}
            <span className="text-base sm:text-lg font-semibold text-primary">
              {currency}
              {product.offerPrice}
              <span className="ml-1 text-xs sm:text-sm text-gray-500">
                / kg
              </span>
            </span>
          </div>

          {/* Cart Actions */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="text-primary"
          >
            {!cartItems[product._id] ? (
              <button
                onClick={handleAdd}
                className="flex items-center justify-center gap-1
                px-3 py-1.5 sm:px-4 sm:py-2
                text-sm border border-primary/40 bg-primary/10
                rounded-md hover:bg-primary/20 transition"
              >
                <img
                  src={assets.cart_icon}
                  alt="cart"
                  className="w-4"
                />
                Add
              </button>
            ) : (
              <div
                className="flex items-center justify-between
                px-2 py-1.5 w-[90px] sm:w-[100px]
                bg-primary/20 rounded-md"
              >
                <button
                  onClick={handleRemove}
                  className="px-2 text-lg"
                >
                  −
                </button>
                <span className="text-sm font-medium">
                  {cartItems[product._id]}
                </span>
                <button
                  onClick={handleAdd}
                  className="px-2 text-lg"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
