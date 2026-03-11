import { useEffect, useState, useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Cart = () => {

  const {
    products,
    currency,
    cartItems,
    removeFromCart,
    getCartCount,
    updateCartItem,
    navigate,
    getCartAmount,
    axios,
    user,
    setCartItems,
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");

  const MIN_ORDER_VALUE = 300;

  const cartTotal = Number(getCartAmount() || 0);
  const isMinOrderValid = cartTotal >= MIN_ORDER_VALUE;

  /* ---------------- PRODUCT LOOKUP MAP ---------------- */

  const productMap = useMemo(() => {

    const map = {};

    products.forEach((p) => {
      map[p._id] = p;
    });

    return map;

  }, [products]);

  /* ---------------- BUILD CART ARRAY ---------------- */

  const buildCartArray = () => {

    const temp = [];

    for (const productId in cartItems) {

      const product = productMap[productId];
      if (!product) continue;

      const variants = cartItems[productId];

      for (const variantLabel in variants) {

        const quantity = variants[variantLabel];

        const variant = product.variants?.find(
          (v) => v.label === variantLabel
        );

        if (!variant) continue;

        temp.push({
          ...product,
          variant,
          quantity,
        });

      }

    }

    setCartArray(temp);

  };

  /* ---------------- FETCH ADDRESS ---------------- */

  const getUserAddress = async () => {

    try {

      const { data } = await axios.get("/api/address/get");

      if (data.success) {

        setAddresses(data.addresses);

        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }

      }

    } catch (error) {

      toast.error(error.message);

    }

  };

  /* ---------------- PLACE ORDER ---------------- */

  const placeOrder = async () => {

    try {

      if (!user) {
        toast.error("Please login to place an order");
        return;
      }

      if (!isMinOrderValid) {

        toast.error(
          `Minimum order value is ₹${MIN_ORDER_VALUE}. Add ₹${
            MIN_ORDER_VALUE - cartTotal
          } more to proceed`
        );

        return;
      }

      if (!selectedAddress) {
        toast.error("Please select a delivery address");
        return;
      }

      if (paymentOption === "COD") {

        const { data } = await axios.post("/api/order/cod", {

          items: cartArray.map((item) => ({
            product: item._id,
            variant: item.variant,
            quantity: item.quantity,
          })),

          address: selectedAddress._id,

        });

        if (data.success) {

          toast.success(data.message);

          setCartItems({});

          navigate("/my-orders");

        } else {

          toast.error(data.message);

        }

      }

    } catch (error) {

      toast.error(error.message);

    }

  };

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {

    if (products.length > 0) {
      buildCartArray();
    }

  }, [products, cartItems]);

  useEffect(() => {

    if (user) {
      getUserAddress();
    }

  }, [user]);

  /* ---------------- EMPTY CART ---------------- */

  if (!cartArray.length) {

    return (

      <div className="mt-20 text-center">

        <h2 className="text-2xl font-semibold text-gray-700">
          Your Cart is Empty
        </h2>

        <p className="text-gray-500 mt-2">
          Looks like you haven't added anything yet.
        </p>

        <button
          onClick={() => navigate("/products")}
          className="mt-6 px-6 py-3 bg-primary text-white rounded hover:bg-primary-dull"
        >
          Browse Products
        </button>

      </div>

    );

  }

  return (

    <div className="mt-12 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">

      <div className="flex flex-col lg:flex-row gap-12">

        {/* CART ITEMS */}

        <div className="flex-1">

          <h1 className="text-2xl sm:text-3xl font-medium mb-6">
            Shopping Cart
            <span className="text-sm text-primary ml-2">
              ({getCartCount()} items)
            </span>
          </h1>

          <div className="space-y-6">

            {cartArray.map((product) => {

              const qty = Number(product.quantity || 0);
              const price = Number(product.variant?.offerPrice || 0);

              return (

                <div
                  key={`${product._id}-${product.variant.label}`}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 border-b pb-4"
                >

                  <div className="flex items-center gap-4 flex-1">

                    <div
                      onClick={() => {
                        navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                        window.scrollTo(0, 0);
                      }}
                      className="w-20 h-20 sm:w-24 sm:h-24 border rounded overflow-hidden cursor-pointer"
                    >

                      <img
                        src={product.image?.[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />

                    </div>

                    <div>

                      <p className="font-medium text-gray-800">
                        {product.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {product.variant.label}
                      </p>

                      {/* QUANTITY STEPPER */}

                      <div className="flex items-center gap-3 mt-2">

                        <span className="text-sm">Qty</span>

                        <div className="flex items-center border rounded">

                          <button
                            onClick={() =>
                              updateCartItem(
                                product._id,
                                product.variant.label,
                                Math.max(qty - 1, 0)
                              )
                            }
                            className="px-3 py-1 text-lg hover:bg-gray-100"
                          >
                            -
                          </button>

                          <span className="px-4 text-sm min-w-[40px] text-center">
                            {qty}
                          </span>

                          <button
                            onClick={() =>
                              updateCartItem(
                                product._id,
                                product.variant.label,
                                qty + 1
                              )
                            }
                            className="px-3 py-1 text-lg hover:bg-gray-100"
                          >
                            +
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                  <p className="text-primary font-medium text-lg">
                    {currency}{(price * qty).toFixed(2)}
                  </p>

                  <button
                    onClick={() =>
                      removeFromCart(product._id, product.variant.label)
                    }
                    className="self-start sm:self-center"
                  >

                    <img
                      src={assets.remove_icon}
                      alt="remove"
                      className="w-6 h-6"
                    />

                  </button>

                </div>

              );

            })}

          </div>

          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 mt-6 text-primary font-medium"
          >

            <img
              src={assets.arrow_right_icon_colored}
              alt="arrow"
              className="w-4"
            />

            Continue Shopping

          </button>

        </div>

        {/* ORDER SUMMARY */}

        <div className="w-full lg:max-w-sm border bg-gray-100/40 p-5 rounded">

          <h2 className="text-xl font-medium">
            Order Summary
          </h2>

          <hr className="my-4" />

          <p className="text-sm font-medium uppercase">
            Delivery Address
          </p>

          <div className="relative mt-2">

            <p className="text-sm text-gray-600">
              {selectedAddress
                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}`
                : "No address selected"}
            </p>

            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-primary text-sm mt-1"
            >
              Change
            </button>

            {showAddress && (

              <div className="absolute z-10 bg-white border w-full mt-2 rounded shadow">

                {addresses.map((address) => (

                  <p
                    key={address._id}
                    onClick={() => {
                      setSelectedAddress(address);
                      setShowAddress(false);
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {address.street}, {address.city}, {address.state}
                  </p>

                ))}

                <p
                  onClick={() => navigate("/add-address")}
                  className="text-primary text-center p-2 hover:bg-primary/10 cursor-pointer"
                >
                  + Add new address
                </p>

              </div>

            )}

          </div>

          <p className="text-sm font-medium uppercase mt-6">
            Payment Method
          </p>

          <select
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border px-3 py-2 mt-2"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>

          <hr className="my-4" />

          <div className="space-y-2 text-sm text-gray-600">

            <p className="flex justify-between">
              <span>Price</span>
              <span>{currency}{cartTotal.toFixed(2)}</span>
            </p>

            <p className="flex justify-between">
              <span>Shipping</span>
              <span className="text-primary">Free</span>
            </p>

            <p className="flex justify-between font-medium text-lg text-gray-800">
              <span>Total</span>
              <span>{currency}{cartTotal.toFixed(2)}</span>
            </p>

          </div>

          {!isMinOrderValid && cartTotal > 0 && (

            <p className="text-red-600 text-sm mt-3">
              Minimum order value is ₹{MIN_ORDER_VALUE}. Add ₹
              {Math.max(MIN_ORDER_VALUE - cartTotal, 0)} more to proceed.
            </p>

          )}

          <button
            onClick={placeOrder}
            disabled={!isMinOrderValid}
            className={`w-full py-3 mt-6 rounded transition ${
              isMinOrderValid
                ? "bg-primary text-white hover:bg-primary-dull"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Place Order
          </button>

        </div>

      </div>

    </div>

  );

};

export default Cart;
