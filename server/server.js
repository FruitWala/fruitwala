import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";

import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";

import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoutes.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();
const port = process.env.PORT || 4000;

/* ===============================
   Database & Cloudinary
================================ */
await connectDB();
await connectCloudinary();

/* ===============================
   CORS Configuration
================================ */
const allowedOrigins = [
  "http://localhost:5173",
  "https://fruitwala-two.vercel.app",
  "https://fruitwala.in",
  "https://www.fruitwala.in"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow server-to-server
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/* ===============================
   Middleware
================================ */
app.use(express.json());
app.use(cookieParser());

/* ===============================
   Routes
================================ */
app.get("/", (req, res) => {
  res.send("FruitWala API is running 🚀");
});

app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

/* ===============================
   Server Start
================================ */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
