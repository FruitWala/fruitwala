import User from "../models/User.js";

// Update User cartData : /api/cart/update
export const updateCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { cartItems } = req.body;

    // Auth safety (unchanged intent)
    if (!userId) {
      return res.json({
        success: false,
        message: "User not authenticated",
      });
    }

    // ✅ SAFE SANITIZATION (NO core logic change)
    // Ensures no negative / zero / invalid quantities
    const cleanCartItems = {};

    if (cartItems && typeof cartItems === "object") {
      for (const productId in cartItems) {
        const qty = Number(cartItems[productId]);

        if (!isNaN(qty) && qty > 0) {
          cleanCartItems[productId] = qty;
        }
      }
    }

    // Update cart exactly as before
    await User.findByIdAndUpdate(
      userId,
      { cartItems: cleanCartItems },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Cart Updated",
    });

  } catch (error) {
    console.error(error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
