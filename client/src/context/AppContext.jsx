import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

/* ===============================
   Axios Global Configuration
================================ */
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  /* ===============================
     Global States
  ================================ */
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);

  // cartItems = { productId: quantityInKg }
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : {};
  });

  const [searchQuery, setSearchQuery] = useState("");

  /* ===============================
     Fetch Seller Auth Status
  ================================ */
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(data.success === true);
    } catch {
      setIsSeller(false);
    }
  };

  /* ===============================
     Fetch User Auth + Cart
  ================================ */
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  /* ===============================
     Fetch Products
  ================================ */
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  /* ===============================
     Cart Actions (LOGIN + WEIGHT SAFE)
  ================================ */

  // Default add = 0.1 kg
  const addToCart = (itemId) => {
    // 🔒 LOGIN GUARD (SINGLE SOURCE OF TRUTH)
    if (!user) {
      toast.error("Please login to add products to cart");
      setShowUserLogin(true);
      return;
    }

    const updatedCart = structuredClone(cartItems);

    if (!updatedCart[itemId]) {
      updatedCart[itemId] = 0.1;
    } else {
      updatedCart[itemId] = Number(
        (updatedCart[itemId] + 0.1).toFixed(2)
      );
    }

    setCartItems(updatedCart);
    toast.success("Added to Cart");
  };

  const updateCartItem = (itemId, quantity) => {
    const updatedCart = structuredClone(cartItems);

    if (quantity <= 0) {
      delete updatedCart[itemId];
    } else {
      updatedCart[itemId] = Number(quantity);
    }

    setCartItems(updatedCart);
  };

  const removeFromCart = (itemId) => {
    const updatedCart = structuredClone(cartItems);
    delete updatedCart[itemId];
    setCartItems(updatedCart);
    toast.success("Removed from Cart");
  };

  /* ===============================
     Cart Helpers
  ================================ */

  // Number of unique products
  const getCartCount = () => {
    return Object.keys(cartItems).length;
  };

  // Total price = pricePerKg × quantityInKg
  const getCartAmount = () => {
    let total = 0;

    for (const itemId in cartItems) {
      const product = products.find((p) => p._id === itemId);
      if (!product) continue;

      const quantity = Number(cartItems[itemId]);
      const price = Number(product.offerPrice);

      if (quantity > 0 && price > 0) {
        total += price * quantity;
      }
    }

    return Number(total.toFixed(2));
  };

  /* ===============================
     Initial Load
  ================================ */
  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

  /* ===============================
     Sync Cart to LocalStorage + DB
  ================================ */
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    if (!user) return;

    const syncCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", { cartItems });
        if (!data.success) toast.error(data.message);
      } catch (error) {
        toast.error(error.message);
      }
    };

    syncCart();
  }, [cartItems, user]);

  /* ===============================
     Clear Cart on Logout
  ================================ */
  useEffect(() => {
    if (!user) {
      setCartItems({});
      localStorage.removeItem("cartItems");
    }
  }, [user]);

  /* ===============================
     Context Value
  ================================ */
  const value = {
    navigate,
    currency,

    user,
    setUser,
    fetchUser,

    isSeller,
    setIsSeller,
    fetchSeller,

    showUserLogin,
    setShowUserLogin,

    products,
    fetchProducts,

    cartItems,
    setCartItems,
    addToCart,
    updateCartItem,
    removeFromCart,

    getCartCount,
    getCartAmount,

    searchQuery,
    setSearchQuery,

    axios,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
