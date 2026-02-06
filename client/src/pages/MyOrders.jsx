import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency, axios, user } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/user");
      if (data.success) {
        setMyOrders(data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  return (
    <div className="mt-10 pb-16 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
      
      {/* Heading */}
      <div className="flex flex-col items-end w-max mb-8">
        <p className="text-2xl font-medium uppercase">My Orders</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      {/* Orders */}
      {myOrders.map((order) => (
        <div
          key={order._id}
          className="border border-gray-300 rounded-lg mb-10 p-4 sm:p-6 max-w-4xl"
        >
          {/* Order Summary */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-sm text-gray-500 mb-4">
            <p>
              <span className="font-medium">Order ID:</span>{" "}
              <span className="break-all">{order._id}</span>
            </p>
            <p>
              <span className="font-medium">Payment:</span>{" "}
              {order.paymentType}
            </p>
            <p>
              <span className="font-medium">Total:</span>{" "}
              {currency}
              {order.amount}
            </p>
          </div>

          {/* Order Items */}
          {order.items.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4
              py-4 ${index !== order.items.length - 1 && "border-b border-gray-200"}`}
            >
              {/* Product */}
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <img
                    src={item.product.image[0]}
                    alt={item.product.name}
                    className="w-14 h-14 object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-medium text-gray-800">
                    {item.product.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Category: {item.product.category}
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="text-sm text-gray-600">
                <p>Quantity: {item.quantity}</p>
                <p>
                  Status:{" "}
                  <span
                    className={`font-medium ${
                    order.status === "Delivered"
                    ? "text-green-600"
                    : order.status === "Cancelled"
                    ? "text-red-600"
                    : "text-yellow-600"
                  }`}
                >
                {order.status}
                </span>
              </p>

                <p>
                  Date:{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Amount */}
              <p className="text-primary font-semibold text-base sm:text-lg">
                {currency}
                {item.product.offerPrice * item.quantity}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
