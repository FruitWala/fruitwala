import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";

const Orders = () => {
  const { currency, axios } = useAppContext();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/seller");
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const markPaymentReceived = async (orderId) => {
    try {
      const { data } = await axios.put(`/api/order/mark-paid/${orderId}`);
      if (data.success) {
        toast.success(data.message);
        fetchOrders();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const { data } = await axios.patch("/api/order/status", {
        orderId,
        status,
      });

      if (data.success) {
        toast.success(data.message);
        fetchOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
      <div className="p-4 md:p-10 space-y-6">
        <h2 className="text-lg font-medium">Orders List</h2>

        {orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-300 rounded-lg p-4 md:p-6 space-y-4"
          >
            {/* ITEMS */}
            <div className="flex items-start gap-4">
              <img
                src={assets.box_icon}
                alt="box"
                className="w-10 h-10 shrink-0"
              />
              <div>
                {order.items.map((item, idx) => (
                  <p key={idx} className="font-medium text-sm">
                    {item.product.name}
                    <span className="text-primary"> × {item.quantity}</span>
                  </p>
                ))}
              </div>
            </div>

            {/* DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
              
              {/* ADDRESS */}
              <div>
                <p className="font-medium text-gray-900">Delivery Address</p>
                <p>{order.address.firstName} {order.address.lastName}</p>
                <p>{order.address.street}</p>
                <p>
                  {order.address.city}, {order.address.state},{" "}
                  {order.address.country}
                </p>
                <p>{order.address.phone}</p>
              </div>

              {/* ORDER INFO */}
              <div>
                <p>
                  <span className="font-medium">Amount:</span>{" "}
                  {currency}{order.amount}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Payment:</span>{" "}
                  {order.isPaid ? (
                    <span className="text-green-600">Paid</span>
                  ) : (
                    <span className="text-red-500">Pending</span>
                  )}
                </p>
                <p>
                  <span className="font-medium">Method:</span>{" "}
                  {order.paymentType}
                </p>
              </div>

              {/* STATUS */}
              <div>
                <p className="font-medium">Order Status</p>

                {/* 🔒 FINAL STATES */}
                {order.status === "Delivered" && (
                  <span className="text-green-600 font-medium">
                    Delivered
                  </span>
                )}

                {order.status === "Cancelled" && (
                  <span className="text-red-600 font-medium">
                    Cancelled
                  </span>
                )}

                {/* 🔁 UPDATABLE */}
                {order.status !== "Delivered" &&
                  order.status !== "Cancelled" && (
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order._id, e.target.value)
                      }
                      className="mt-1 border border-gray-300 px-2 py-1 rounded w-full"
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  )}

                {/* COD PAYMENT */}
                {order.paymentType === "COD" &&
                  !order.isPaid &&
                  order.status !== "Cancelled" && (
                    <button
                      onClick={() => markPaymentReceived(order._id)}
                      className="mt-3 w-full bg-green-600 text-white py-1.5 rounded text-sm hover:bg-green-700"
                    >
                      Mark Payment Received
                    </button>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
