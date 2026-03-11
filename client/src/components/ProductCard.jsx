import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {

  const {
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    navigate,
    user,
    setShowUserLogin
  } = useAppContext();

  if (!product) return null;

  /* ---------------- DEFAULT VARIANT ---------------- */

  const defaultVariant =
    product.variants && product.variants.length > 0
      ? product.variants[0]
      : {
          label: "250g",
          price: product.price,
          offerPrice: product.offerPrice
        };

  /* ---------------- CART LOOKUP ---------------- */

  const productCart = cartItems[product._id] || {};
  const cartItem = productCart[defaultVariant.label];

  const quantity = cartItem?.quantity || 0;

  /* ---------------- IMAGE OPTIMIZER ---------------- */

  const optimizeImage = (url, width = 400, height = 400) => {

    if (!url || !url.includes("/upload/")) return url;

    const [base, path] = url.split("/upload/");

    return `${base}/upload/f_auto,q_auto:eco,c_fill,w_${width},h_${height}/${path}`;

  };

  /* ---------------- ADD PRODUCT ---------------- */

  const handleAdd = (e) => {

    e.stopPropagation();

    if (!user) {
      toast.error("Please login to add products to cart");
      setShowUserLogin(true);
      return;
    }

    addToCart(product._id, defaultVariant);

  };

  /* ---------------- REMOVE PRODUCT ---------------- */

  const handleRemove = (e) => {

    e.stopPropagation();

    if (quantity <= 1) {

      removeFromCart(product._id, defaultVariant.label);

      return;

    }

    updateCartItem(product._id, defaultVariant.label, {
      variant: defaultVariant,
      quantity: quantity - 1
    });

  };

  /* ---------------- INCREASE PRODUCT ---------------- */

  const handleIncrease = (e) => {

    e.stopPropagation();

    updateCartItem(product._id, defaultVariant.label, {
      variant: defaultVariant,
      quantity: quantity + 1
    });

  };

  return (

    <div
      onClick={() => {
        navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
        window.scrollTo(0, 0);
      }}
      className="w-full border border-gray-200 rounded-lg bg-white
      p-3 sm:p-4 cursor-pointer hover:shadow-md transition"
    >

      {/* IMAGE */}

      <div className="flex items-center justify-center aspect-square mb-3">

        <img
          src={optimizeImage(product.image?.[0])}
          alt={product.name}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="max-h-32 sm:max-h-36 md:max-h-40 object-contain
          transition-transform hover:scale-105"
        />

      </div>

      {/* CONTENT */}

      <div className="space-y-1">

        <p className="text-xs sm:text-sm text-gray-500">
          {product.category}
        </p>

        <p className="text-sm sm:text-base font-medium text-gray-800 line-clamp-2">
          {product.name}
        </p>

        {/* RATING */}

        <div className="flex items-center gap-1 text-xs">

          {Array(5)
            .fill("")
            .map((_, i) => (

              <img
                key={i}
                className="w-3.5"
                src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                alt=""
                loading="lazy"
              />

            ))}

          <span className="text-gray-500">(4)</span>

        </div>

        {/* PRICE */}

        <div className="flex items-center justify-between mt-3">

          <div className="flex flex-col leading-tight">

            {defaultVariant.price && (

              <span className="text-xs sm:text-sm text-gray-400 line-through">
                {currency}{defaultVariant.price}
                <span className="ml-1">/ {defaultVariant.label}</span>
              </span>

            )}

            <span className="text-base sm:text-lg font-semibold text-primary">
              {currency}{defaultVariant.offerPrice}
              <span className="ml-1 text-xs sm:text-sm text-gray-500">
                / {defaultVariant.label}
              </span>
            </span>

          </div>

          {/* CART BUTTON */}

          <div
            onClick={(e) => e.stopPropagation()}
            className="text-primary"
          >

            {!cartItem ? (

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
                  loading="lazy"
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
                  {quantity}
                </span>

                <button
                  onClick={handleIncrease}
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
