import User from "../models/User.js"

// Update User cartData : /api/cart/update
export const updateCart = async (req, res)=>{
    try {
        
        const userId = req.userId;
        const { cartItems } = req.body;


        if (!userId) {
            return res.json({ success: false, message: "User not authenticated" });
        }

        await User.findByIdAndUpdate(userId, {cartItems: cartItems});
        res.json({ success: true, message: "Cart Updated" });

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}