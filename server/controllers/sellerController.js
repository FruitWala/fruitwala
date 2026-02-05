import jwt from "jsonwebtoken";

// Login Seller : /api/seller/login
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.SELLER_EMAIL &&
      password === process.env.SELLER_PASSWORD
    ) {
      const token = jwt.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: "365d" }
      );

      res.cookie("sellerToken", token, {
        httpOnly: true,
        secure: true,          // REQUIRED (Render + Vercel)
        sameSite: "None",      // 🔥 FIXED HERE
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });

      return res.json({ success: true, message: "Logged In" });
    }

    return res.json({ success: false, message: "Invalid Credentials" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Seller isAuth
export const isSellerAuth = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Logout Seller
export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
