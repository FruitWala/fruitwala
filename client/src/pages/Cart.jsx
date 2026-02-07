import { useEffect, useState } from "react";
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

  /* ---------------- MIN ORDER CONFIG ---------------- */
  const MIN_ORDER_VALUE = 300;

  const rawCartTotal = getCartAmount();
  const cartTotal = Math.max(rawCartTotal, 0);
  const isMinOrderValid = cartTotal >= MIN_ORDER_VALUE;

  /* ---------------- BUILD CART ARRAY ---------------- */
  const getCart = () => {
    const temp = [];

    for (const key in cartItems) {
      const product = products.find((p) => p._id === key);
      if (product) {
        temp.push({
          ...product,
          quantity: Number(cartItems[key]),
        });
      }
    }

    setCartArray(temp);
  };

  /* ---------------- FETCH ADDRESSES ---------------- */
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
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);

  useEffect(() => {
    if (user) {
      getUserAddress();
    }
  }, [user]);

  /* ---------------- UI ---------------- */
  return (
    <div className="mt-12 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
      <div className="flex flex-col lg:flex-row gap-12">

        {/* LEFT : CART ITEMS */}
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-medium mb-6">
            Shopping Cart{" "}
            <span className="text-sm text-primary">
              ({getCartCount()} items)
            </span>
          </h1>

          <div className="space-y-6">
            {cartArray.map((product) => (
              <div
                key={product._id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 border-b pb-4"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    onClick={() => {
                      navigate(
                        `/products/${product.category.toLowerCase()}/${product._id}`
                      );
                      scrollTo(0, 0);
                    }}
                    className="w-20 h-20 sm:w-24 sm:h-24 border rounded overflow-hidden cursor-pointer"
                  >
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <p className="font-medium text-gray-800">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500">Weight based</p>

                    {/* QTY */}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm">Qty</span>
                      <select
                        value={product.quantity}
                        onChange={(e) =>
                          updateCartItem(
                            product._id,
                            Number(e.target.value)
                          )
                        }
                        className="border px-2 py-1 text-sm"
                      >
                        {Array.from({ length: 9 }, (_, i) => (
                          <option key={i} value={(i + 1) / 10}>
                            {(i + 1) / 10} kg
                          </option>
                        ))}
                        {Array.from({ length: 10 }, (_, i) => (
                          <option key={i + 10} value={i + 1}>
                            {i + 1} kg
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <p className="text-primary font-medium text-lg">
                  {currency}
                  {(product.offerPrice * product.quantity).toFixed(2)}
                </p>

                <button
                  onClick={() => removeFromCart(product._id)}
                  className="self-start sm:self-center"
                >
                  <img
                    src={assets.remove_icon}
                    alt="remove"
                    className="w-6 h-6"
                  />
                </button>
              </div>
            ))}
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

        {/* RIGHT : ORDER SUMMARY */}
        <div className="w-full lg:max-w-sm border bg-gray-100/40 p-5 rounded">
          <h2 className="text-xl font-medium">Order Summary</h2>
          <hr className="my-4" />

          {/* DELIVERY ADDRESS */}
          <p className="text-sm font-medium uppercase">Delivery Address</p>

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

          {/* PAYMENT */}
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

          {/* TOTALS */}
          <div className="space-y-2 text-sm text-gray-600">
            <p className="flex justify-between">
              <span>Price</span>
              <span>
                {currency}
                {cartTotal.toFixed(2)}
              </span>
            </p>
            <p className="flex justify-between">
              <span>Shipping</span>
              <span className="text-primary">Free</span>
            </p>
            <p className="flex justify-between font-medium text-lg text-gray-800">
              <span>Total</span>
              <span>
                {currency}
                {cartTotal.toFixed(2)}
              </span>
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
