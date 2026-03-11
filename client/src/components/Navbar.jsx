import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import fruitwala from "../assets/fruitwala.svg";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchRef = useRef(null);

  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    setSearchQuery,
    searchQuery,
    getCartCount,
    axios,
  } = useAppContext();

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (searchQuery?.length > 0) {
      navigate("/products");
    }
  }, [searchQuery]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  useEffect(() => {
    if (showMobileSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showMobileSearch]);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-12 lg:px-20 py-4">

          {/* Logo */}
          <NavLink to="/" onClick={() => setOpen(false)}>
            <img
              className="h-10 sm:h-11 w-auto"
              src={fruitwala}
              alt="FruitWala.in"
            />
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-6 lg:gap-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/products">All Product</NavLink>
            <NavLink to="/contact">Contact</NavLink>

            {/* Desktop Search */}
            <div className="hidden lg:flex items-center gap-2 border border-gray-300 px-3 rounded-full">
              <input
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-1.5 w-44 bg-transparent outline-none text-sm"
                type="text"
                placeholder="Search products"
              />
              <img
                src={assets.search_icon}
                alt="search"
                className="w-4 h-4"
              />
            </div>

            {/* Cart */}
            <div
              onClick={() => navigate("/cart")}
              className="relative cursor-pointer"
            >
              <img
                src={assets.nav_cart_icon}
                alt="cart"
                className="w-6 opacity-80"
              />
              <span className="absolute -top-2 -right-2 text-xs text-white bg-primary w-5 h-5 flex items-center justify-center rounded-full">
                {getCartCount()}
              </span>
            </div>

            {/* Auth */}
            {!user ? (
              <button
                onClick={() => setShowUserLogin(true)}
                className="px-6 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
              >
                Login
              </button>
            ) : (
              <div className="relative">
                <img
                  src={assets.profile_icon}
                  className="w-10 cursor-pointer"
                  alt="profile"
                  onClick={() => setShowProfile(!showProfile)}
                />
                {showProfile && (
                  <ul className="absolute right-0 mt-2 bg-white shadow-md border border-gray-200 py-2 w-36 rounded-md text-sm z-50">
                    <li
                      onClick={() => {
                        setShowProfile(false);
                        navigate("/my-orders");
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      My Orders
                    </li>
                    <li
                      onClick={logout}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Logout
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Mobile Right */}
          <div className="flex items-center gap-4 sm:hidden">

            {/* Mobile Search */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              aria-label="Search"
            >
              <img
                src={assets.search_icon}
                alt="search"
                className="w-5 h-5"
              />
            </button>

            {/* Cart */}
            <div
              onClick={() => navigate("/cart")}
              className="relative cursor-pointer"
            >
              <img
                src={assets.nav_cart_icon}
                alt="cart"
                className="w-6 opacity-80"
              />
              <span className="absolute -top-2 -right-2 text-xs text-white bg-primary w-5 h-5 flex items-center justify-center rounded-full">
                {getCartCount()}
              </span>
            </div>

            {/* Menu */}
            <button onClick={() => setOpen(true)} aria-label="Menu">
              <img src={assets.menu_icon} alt="menu" />
            </button>
          </div>
        </div>
      </nav>

      {/* ===== PREMIUM INTERACTIVE DISCLAIMER ===== */}
      <div className="w-full flex justify-center bg-white py-2 px-4">
        <div className="group relative inline-flex items-center gap-2 bg-blue-50 text-gray-700 text-xs md:text-sm px-4 py-1.5 rounded-full cursor-pointer transition-all duration-200 hover:bg-blue-100 active:scale-95">

          <span className="text-blue-500 font-semibold">ℹ</span>

          <span className="whitespace-nowrap">
            Images are for representation purposes only.
          </span>

          <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-72 bg-white text-gray-600 text-xs md:text-sm p-3 rounded-lg shadow-xl border border-gray-200 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 z-50">

            <p className="font-medium text-gray-700 mb-1">
              Product Image Disclaimer
            </p>

            <p>
              Actual product may vary in appearance, size, or packaging due to seasonal availability and supplier variations.
            </p>

          </div>
        </div>
      </div>

      {/* ===== Delivery Bar ===== */}
      <div className="w-full bg-primary/10 text-primary text-center text-sm md:text-base py-2 px-4">
        🚚 Our delivery time is{" "}
        <span className="font-semibold">9:00 AM – 10:00 PM</span>. Please place
        your orders accordingly.
      </div>

      {/* ===== Mobile Animated Search ===== */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          showMobileSearch
            ? "max-h-24 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-3 border-b bg-white">
          <div className="flex items-center gap-2 border border-gray-300 px-3 rounded-full">
            <input
              ref={searchRef}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-2 w-full bg-transparent outline-none text-sm"
              type="text"
              placeholder="Search products"
            />
            <img
              src={assets.search_icon}
              alt="search"
              className="w-4 h-4"
            />
          </div>
        </div>
      </div>

      {/* ===== Mobile Backdrop ===== */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ===== Mobile Slide Menu ===== */}
      <div
        className={`fixed top-0 right-0 h-full w-[80%] max-w-xs bg-white z-50 shadow-lg transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-4 px-6 py-6 text-sm">
          <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>All Product</NavLink>
          {user && (
            <NavLink to="/my-orders" onClick={() => setOpen(false)}>My Orders</NavLink>
          )}
          <NavLink to="/contact" onClick={() => setOpen(false)}>Contact</NavLink>

          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-full"
            >
              Login
            </button>
          ) : (
            <button
              onClick={logout}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-full"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
