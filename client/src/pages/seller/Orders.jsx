import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";

const Orders = () => {
  const { currency, axios } = useAppContext();
  const [orders, setOrders] = useState([]);

  // Fetch all seller orders
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

  // ✅ MARK PAYMENT AS RECEIVED (COD)
  const markPaymentReceived = async (orderId) => {
    try {
      const { data } = await axios.put(`/api/order/mark-paid/${orderId}`);

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

  // ✅ UPDATE ORDER STATUS
  const updateOrderStatus = async (orderId, status) => {
    try {
      const { data } = await axios.patch("/api/order/status", {
        orderId,
        status,
      });

      if (data.success) {
        toast.success("Order status updated");
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
      <div className="md:p-10 p-4 space-y-4">
        <h2 className="text-lg font-medium">Orders List</h2>

        {orders.map((order, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row md:items-center gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300"
          >
            {/* ORDER ITEMS */}
            <div className="flex gap-5 max-w-80">
              <img
                className="w-12 h-12 object-cover"
                src={assets.box_icon}
                alt="box"
              />
              <div className="space-y-1">
                {order.items.map((item, idx) => (
                  <p key={idx} className="font-medium">
                    {item.product.name}
                    <span className="text-primary"> × {item.quantity}</span>
                  </p>
                ))}
              </div>
            </div>

            {/* ADDRESS */}
            <div className="text-sm md:text-base text-black/60">
              <p className="text-black/80 font-medium">
                {order.address.firstName} {order.address.lastName}
              </p>
              <p>
                {order.address.street}, {order.address.city}
              </p>
              <p>
                {order.address.state}, {order.address.pincode},{" "}
                {order.address.country}
              </p>
              <p>{order.address.phone}</p>
            </div>

            {/* AMOUNT */}
            <p className="font-medium text-lg my-auto">
              {currency}
              {order.amount}
            </p>

            {/* PAYMENT + STATUS */}
            <div className="flex flex-col gap-1 text-sm md:text-base text-black/60">
              <p>Method: {order.paymentType}</p>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>

              <p>
                Payment:{" "}
                {order.isPaid ? (
                  <span className="text-green-600">Paid</span>
                ) : (
                  <span className="text-red-500">Pending</span>
                )}
              </p>

              {/* ORDER STATUS */}
          <div className="flex flex-col text-sm md:text-base text-black/60 mt-2">
            <p>Status:</p>

            {order.status === "Delivered" ? (
            // 🔒 LOCKED STATE
            <span className="text-green-600 font-medium">
             Delivered
            </span>
              ) : (
            // ✅ ONLY ALLOW Order Placed → Delivered
            <select
              value={order.status}
              onChange={(e) =>
              updateOrderStatus(order._id, e.target.value)
              }
              className="mt-1 border border-gray-300 px-2 py-1 rounded text-sm"
              >
              <option value="Order Placed">Order Placed</option>
              <option value="Delivered">Delivered</option>
            </select>
              )}
            </div>


              {/* ✅ COD PAYMENT BUTTON */}
              {order.paymentType === "COD" && !order.isPaid && (
                <button
                  onClick={() => markPaymentReceived(order._id)}
                  className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Mark Payment Received
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
