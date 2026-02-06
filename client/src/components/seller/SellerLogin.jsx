import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const SellerLogin = () => {
  const { isSeller, setIsSeller, navigate, axios } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post("/api/seller/login", {
        email,
        password,
      });

      if (data.success) {
        setIsSeller(true);
        navigate("/seller");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isSeller) navigate("/seller");
  }, [isSeller]);

  return (
    !isSeller && (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <form
          onSubmit={onSubmitHandler}
          className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8 space-y-5"
        >
          <h1 className="text-2xl sm:text-3xl font-semibold text-center">
            <span className="text-primary">Seller</span> Login
          </h1>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 border rounded-md outline-none focus:border-primary"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 border rounded-md outline-none focus:border-primary"
              required
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full py-2.5 bg-primary text-white rounded-md font-medium hover:bg-primary-dull transition"
          >
            Login
          </button>
        </form>
      </div>
    )
  );
};

export default SellerLogin;