import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  // ✅ FIX: read correct cookie name
  const token = req.cookies.userToken;

  console.log("🍪 USER COOKIE:", token);

  if (!token) {
    return res.json({
      success: false,
      message: "User Not Authenticated",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("🔓 DECODED JWT:", decoded);

    req.userId = decoded.id;

    console.log("✅ USER ID SET:", req.userId);

    next();
  } catch (error) {
    console.log("❌ JWT ERROR:", error.message);
    return res.json({
      success: false,
      message: "User Not Authenticated",
    });
  }
};

export default authUser;
