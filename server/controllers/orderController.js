import Order from "../models/Order.js";
import Product from "../models/Product.js";

/* ==============================
   PLACE ORDER (COD)
================================ */
export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, address } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User not authenticated" });
    }

    if (!address || !Array.isArray(items) || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    const MIN_ORDER_VALUE = 300;

    let amount = 0;
    const validatedItems = [];

    for (const item of items) {
      if (!item.product || Number(item.quantity) <= 0) continue;

      const product = await Product.findById(item.product);
      if (!product) continue;

      amount += product.offerPrice * item.quantity;

      validatedItems.push({
        product: item.product,
        quantity: item.quantity,
      });
    }

    if (validatedItems.length === 0) {
      return res.json({ success: false, message: "Invalid order items" });
    }

    // ✅ MINIMUM ORDER VALIDATION (BACKEND AUTHORITY)
    if (amount < MIN_ORDER_VALUE) {
      return res.json({
        success: false,
        message: `Minimum order value is ₹${MIN_ORDER_VALUE}`,
      });
    }

    await Order.create({
      userId,
      items: validatedItems,
      amount: Number(amount.toFixed(2)),
      address,
      paymentType: "COD",
      isPaid: false,
      status: "Order Placed",
    });

    res.json({ success: true, message: "Order Placed Successfully" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ==============================
   GET USER ORDERS
================================ */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.json({ success: false, message: "User not authenticated" });
    }

    const orders = await Order.find({ userId })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ==============================
   GET ALL ORDERS (SELLER)
================================ */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ==============================
   MARK COD PAYMENT RECEIVED
================================ */
export const markCODPaymentReceived = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.json({ success: false, message: "Order ID required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    if (order.paymentType !== "COD") {
      return res.json({ success: false, message: "Not a COD order" });
    }

    if (order.isPaid) {
      return res.json({ success: false, message: "Payment already received" });
    }

    order.isPaid = true;
    await order.save();

    res.json({ success: true, message: "Payment marked as received" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ==============================
   UPDATE ORDER STATUS (SELLER)
================================ */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.json({ success: false, message: "Invalid data" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    // 🔒 FINAL STATE LOCK
    if (order.status === "Delivered" || order.status === "Cancelled") {
      return res.json({
        success: false,
        message: `Order already ${order.status} and cannot be updated`,
      });
    }

    // ❌ BLOCK SHIPPED COMPLETELY
    if (status === "Shipped") {
      return res.json({
        success: false,
        message: "Shipped status is not allowed",
      });
    }

    // ✅ ALLOWED STATUS ONLY
    const allowedStatuses = ["Order Placed", "Delivered", "Cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.json({
        success: false,
        message: "Invalid order status",
      });
    }

    order.status = status;

    // ✅ AUTO MARK COD PAID ON DELIVERY
    if (status === "Delivered" && order.paymentType === "COD") {
      order.isPaid = true;
    }

    await order.save();

    res.json({ success: true, message: "Order status updated" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
