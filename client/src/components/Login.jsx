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
    try {
        event.preventDefault();
        const { data } = await axios.post(`/api/user/${state}`, {
        name, email, password});

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
      className="fixed inset-0 z-30 flex items-center text-sm text-primary bg-black/50"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[500px] rounded-lg shadow-xl border border-primary bg-white"
      >
        <h1 className="text-primary text-3xl mt-4 font-medium">
          {state === "login" ? "User Login" : "User Sign Up"}
        </h1>
        <p className="text-primary text-sm">
          Please sign in to continue
        </p>

        {/* Name (only for register) */}
        {state === "register" && (
          <input
            type="text"
            placeholder="Name"
            className="w-full border px-4 py-2 rounded-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full border px-4 py-2 rounded-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full border px-4 py-2 rounded-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="mt-4 w-full h-11 rounded-full text-white bg-primary hover:bg-primary-dull transition"
        >
          {state === "login" ? "Login" : "Sign Up"}
        </button>

        <p
          onClick={() =>
            setState((prev) =>
              prev === "login" ? "register" : "login"
            )
          }
          className="text-primary text-sm cursor-pointer mt-3"
        >
          {state === "login"
            ? "Don't have an account? Click here"
            : "Already have an account? Click here"}
        </p>
      </form>
    </div>
  );
};

export default Login;
