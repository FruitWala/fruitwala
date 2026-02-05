import jwt from "jsonwebtoken";

const authSeller = async (req, res, next) => {
  try {
    const sellerToken = req.cookies?.sellerToken;

    if (!sellerToken) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized",
      });
    }

    const decoded = jwt.verify(
      sellerToken,
      process.env.JWT_SECRET
    );

    if (decoded.email !== process.env.SELLER_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Not Authorized",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    });
  }
};

export default authSeller;
