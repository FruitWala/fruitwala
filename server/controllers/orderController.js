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
      return res.json({ success: false, message: "Invalid order data" });
    }

    const MIN_ORDER_VALUE = 300;

    let amount = 0;
    const validatedItems = [];

    for (const item of items) {

      if (!item.product || !item.variant || Number(item.quantity) <= 0) {
        continue;
      }

      const product = await Product.findById(item.product);

      if (!product) continue;

      const { label, price, offerPrice } = item.variant;

      if (!label) continue;

      const finalPrice = Number(offerPrice);

      amount += finalPrice * item.quantity;

      validatedItems.push({
        product: item.product,
        variant: {
          label,
          price: Number(price),
          offerPrice: finalPrice,
        },
        quantity: Number(item.quantity),
      });
    }

    if (validatedItems.length === 0) {
      return res.json({
        success: false,
        message: "Invalid cart items",
      });
    }

    if (amount < MIN_ORDER_VALUE) {
      return res.json({
        success: false,
        message: `Minimum order value is ₹${MIN_ORDER_VALUE}`,
      });
    }

    const order = await Order.create({
      userId,
      items: validatedItems,
      amount: Number(amount.toFixed(2)),
      address,
      paymentType: "COD",
      isPaid: false,
      status: "Order Placed",
    });

    res.json({
      success: true,
      message: "Order Placed Successfully",
      orderId: order._id,
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message,
    });

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
      .populate("items.product")
      .populate("address")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message,
    });

  }
};

/* ==============================
   GET ALL ORDERS (SELLER)
================================ */
export const getAllOrders = async (req, res) => {
  try {

    const orders = await Order.find()
      .populate("items.product")
      .populate("address")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message,
    });

  }
};

/* ==============================
   MARK COD PAYMENT RECEIVED
================================ */
export const markCODPaymentReceived = async (req, res) => {
  try {

    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.paymentType !== "COD") {
      return res.json({
        success: false,
        message: "Not a COD order",
      });
    }

    if (order.isPaid) {
      return res.json({
        success: false,
        message: "Payment already received",
      });
    }

    order.isPaid = true;

    await order.save();

    res.json({
      success: true,
      message: "Payment marked as received",
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message,
    });

  }
};

/* ==============================
   UPDATE ORDER STATUS (SELLER)
================================ */
export const updateOrderStatus = async (req, res) => {
  try {

    const { orderId, status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status === "Delivered" || order.status === "Cancelled") {
      return res.json({
        success: false,
        message: `Order already ${order.status}`,
      });
    }

    const allowedStatuses = ["Order Placed", "Delivered", "Cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.json({
        success: false,
        message: "Invalid order status",
      });
    }

    order.status = status;

    if (status === "Cancelled") {
      order.cancelledBy = "SELLER";
    }

    if (status === "Delivered" && order.paymentType === "COD") {
      order.isPaid = true;
    }

    await order.save();

    res.json({
      success: true,
      message: "Order status updated",
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message,
    });

  }
};

/* ==============================
   USER CANCEL ORDER
================================ */
export const cancelOrderByUser = async (req, res) => {
  try {

    const userId = req.userId;
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status === "Delivered") {
      return res.json({
        success: false,
        message: "Delivered order cannot be cancelled",
      });
    }

    if (order.status === "Cancelled") {
      return res.json({
        success: false,
        message: "Order already cancelled",
      });
    }

    order.status = "Cancelled";
    order.cancelledBy = "USER";

    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message,
    });

  }
};
