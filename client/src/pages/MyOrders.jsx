import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency, axios, user } = useAppContext();

  /* ================= FETCH ORDERS ================= */
  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/user");
      if (data.success) {
        setMyOrders(data.orders || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* ================= CANCEL ORDER ================= */
  const cancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    try {
      const { data } = await axios.patch(
        `/api/order/user-cancel/${orderId}`
      );

      if (data.success) {
        toast.success("Order cancelled successfully");
        fetchMyOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) fetchMyOrders();
  }, [user]);

  return (
    <div className="mt-10 pb-16 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">

      {/* Heading */}
      <div className="flex flex-col items-end w-max mb-8">
        <p className="text-2xl font-medium uppercase">My Orders</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      {/* EMPTY STATE */}
      {myOrders.length === 0 && (
        <p className="text-gray-500 text-center">No orders found</p>
      )}

      {/* ORDERS */}
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

          {/* ITEMS */}
          {order.items.map((item, index) => {
            const product = item.product;

            return (
              <div
                key={index}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 ${
                  index !== order.items.length - 1
                    ? "border-b border-gray-200"
                    : ""
                }`}
              >
                {/* Product */}
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <img
                      src={product?.image?.[0] || assets.upload_area}
                      alt={product?.name || "Deleted Product"}
                      className="w-14 h-14 object-cover"
                    />
                  </div>

                  <div>
                    <h2 className="text-base sm:text-lg font-medium text-gray-800">
                      {product?.name || "Product Deleted"}
                    </h2>

                    {product ? (
                      <p className="text-sm text-gray-500">
                        Category: {product.category}
                      </p>
                    ) : (
                      <p className="text-sm text-red-500">
                        This product is no longer available
                      </p>
                    )}
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
                      {order.status === "Cancelled"
                        ? order.cancelledBy === "SELLER"
                          ? "Seller Cancelled"
                          : "Cancelled"
                        : order.status}
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
                  {product ? product.offerPrice * item.quantity : 0}
                </p>
              </div>
            );
          })}

          {/* CANCEL BUTTON */}
          {order.status !== "Delivered" &&
            order.status !== "Cancelled" && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => cancelOrder(order._id)}
                  className="border border-red-500 text-red-500 px-4 py-1.5 rounded
                             hover:bg-red-500 hover:text-white transition text-sm"
                >
                  Cancel Order
                </button>
              </div>
            )}
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
