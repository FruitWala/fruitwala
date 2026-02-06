import React from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const { setShowUserLogin, setUser, axios, navigate } = useAppContext();

  const [state, setState] = React.useState("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password,
      });

      if (data.success) {
        toast.success("Welcome!");
        setUser(data.user);
        setShowUserLogin(false);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed inset-0 z-40 flex items-center justify-center 
      bg-black/50 px-4"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm sm:max-w-md bg-white rounded-xl shadow-xl 
        border border-primary p-6 sm:p-8 flex flex-col gap-4"
      >
        <h1 className="text-primary text-2xl sm:text-3xl font-medium">
          {state === "login" ? "User Login" : "User Sign Up"}
        </h1>

        <p className="text-gray-500 text-sm">
          Please sign in to continue
        </p>

        {/* Name (Register only) */}
        {state === "register" && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border px-4 py-2.5 rounded-md focus:outline-none 
            focus:border-primary"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Email Address"
          className="w-full border px-4 py-2.5 rounded-md focus:outline-none 
          focus:border-primary"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full border px-4 py-2.5 rounded-md focus:outline-none 
          focus:border-primary"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="mt-2 w-full h-11 rounded-md text-white 
          bg-primary hover:bg-primary-dull transition font-medium"
        >
          {state === "login" ? "Login" : "Sign Up"}
        </button>

        <p
          onClick={() =>
            setState((prev) =>
              prev === "login" ? "register" : "login"
            )
          }
          className="text-primary text-sm text-center cursor-pointer mt-2"
        >
          {state === "login"
            ? "Don't have an account? Sign up"
            : "Already have an account? Login"}
        </p>
      </form>
    </div>
  );
};

export default Login;
