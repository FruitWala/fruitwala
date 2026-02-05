import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets, dummyAddress } from "../assets/assets";
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

  // Build cart array from cartItems
  const getCart = () => {
    let tempArray = [];

    for (const key in cartItems) {
      const product = products.find((item) => item._id === key);
      if (product) {
        tempArray.push({ ...product, quantity: cartItems[key] });
      }
    }
    setCartArray(tempArray);
  };

  const getUserAddress = async ()=>{
    try {
          const {data} = await axios.get('/api/address/get');
          if(data.success){
            setAddresses(data.addresses)
            if(data.addresses.length > 0){
              setSelectedAddress(data.addresses[0])
            }
          }else{
            toast.error(data.message)
          }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const placeOrder = async () => {
    try {
      if(!selectedAddress){
        return toast.error("Please select an address")
      }

      // Place Order with COD
      if(paymentOption === "COD"){
        const {data} = await axios.post('/api/order/cod', {
          // userId: user._id,
          items: cartArray.map(item=> ({
          product: item._id, 
          quantity: item.quantity
        })),
          address: selectedAddress._id
        })

        if(data.success){
          toast.success(data.message)
          setCartItems({})
          navigate('/my-orders')
        }else{
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);

  useEffect(()=>{
    if(!user) return;
      getUserAddress();
  },[user?._id]);

  return products.length > 0 && cartItems ? (
    <div className="flex flex-col md:flex-row mt-16">
      {/* LEFT SIDE */}
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-primary">
            {getCartCount()} Items
          </span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 font-medium pb-3">
          <p>Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product) => (
          <div
            key={product._id}
            className="grid grid-cols-[2fr_1fr_1fr] items-center text-sm md:text-base pt-3"
          >
            <div className="flex items-center gap-3 md:gap-6">
              <div
                onClick={() => {
                  navigate(
                    `/products/${product.category.toLowerCase()}/${product._id}`
                  );
                  scrollTo(0, 0);
                }}
                className="cursor-pointer w-24 h-24 flex items-center justify-center border rounded overflow-hidden"
              >
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <p className="hidden md:block font-semibold">{product.name}</p>
                <p className="text-black">
                  Weight: {product.weight || "500gm (1/2Kg)"}
                </p>

                <div className="flex items-center gap-2">
                  <p>Qty:</p>
                  <select
                    value={product.quantity}
                    onChange={(e) =>
                      updateCartItem(product._id, Number(e.target.value))
                    }
                    className="outline-none border px-1"
                  >
                    {Array.from(
                      {
                        length:
                          cartItems[product._id] > 30
                            ? cartItems[product._id]
                            : 30,
                      },
                      (_, index) => (
                        <option key={index} value={index + 1}>
                          {index + 1}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
            </div>

            <p className="text-center">
              {currency}
              {product.offerPrice * product.quantity}
            </p>

            <button
              onClick={() => removeFromCart(product._id)}
              className="mx-auto cursor-pointer"
            >
              <img
                src={assets.remove_icon}
                alt="remove"
                className="w-6 h-6"
              />
            </button>
          </div>
        ))}

        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="group flex items-center gap-2 mt-8 text-primary font-medium"
        >
          <img
            src={assets.arrow_right_icon_colored}
            alt="arrow"
            className="group-hover:-translate-x-1 transition"
          />
          Continue Shopping
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border">
        <h2 className="text-xl font-medium">Order Summary</h2>
        <hr className="my-5" />

        <p className="text-sm font-medium uppercase">Delivery Address</p>
        <div className="relative mt-2">
          <p className="text-gray-500">
            {selectedAddress
              ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
              : "No address found"}
          </p>

          <button
            onClick={() => setShowAddress(!showAddress)}
            className="text-primary hover:underline"
          >
            Change
          </button>

          {showAddress && (
            <div className="absolute top-12 bg-white border w-full text-sm">
              {addresses.map((address, index) => (
                <p
                  key={index}
                  onClick={() => {
                    setSelectedAddress(address);
                    setShowAddress(false);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {address.street}, {address.city}, {address.state},{" "}
                  {address.country}
                </p>
              ))}
              <p
                onClick={() => navigate("/add-address")}
                className="text-primary text-center p-2 hover:bg-indigo-500/10 cursor-pointer"
              >
                Add address
              </p>
            </div>
          )}
        </div>

        <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
        <select
          onChange={(e) => setPaymentOption(e.target.value)}
          className="w-full border px-3 py-2 mt-2"
        >
          <option value="COD">Cash On Delivery</option>
          <option value="Online">Online Payment</option>
        </select>

        <hr className="my-4" />

        <div className="space-y-2 text-gray-500">
          <p className="flex justify-between">
            <span>Price</span>
            <span>
              {currency}
              {getCartAmount()}
            </span>
          </p>
          <p className="flex justify-between">
            <span>Shipping</span>
            <span className="text-primary">Free</span>
          </p>
          <p className="flex justify-between font-medium text-lg">
            <span>Total</span>
            <span>
              {currency}
              {getCartAmount()}
            </span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          className="w-full py-3 mt-6 bg-primary text-white hover:bg-primary-dull transition"
        >
          {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  ) : null;
};

export default Cart;
