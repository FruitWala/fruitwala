import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

/* ===============================
   AXIOS INSTANCE
================================ */

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

/* ===============================
   CONTEXT
================================ */

export const AppContext = createContext();

/* ===============================
   PROVIDER
================================ */

export const AppContextProvider = ({ children }) => {

  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  /* ===============================
     GLOBAL STATES
  ================================ */

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem("cartItems");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  /* ===============================
     PRODUCT MAP (FAST LOOKUP)
  ================================ */

  const productMap = useMemo(() => {
    const map = {};
    for (const p of products) {
      map[p._id] = p;
    }
    return map;
  }, [products]);

  /* ===============================
     FETCH SELLER
  ================================ */

  const fetchSeller = async () => {
    try {
      const { data } = await api.get("/api/seller/is-auth");
      setIsSeller(data.success);
    } catch {
      setIsSeller(false);
    }
  };

  /* ===============================
     FETCH USER
  ================================ */

  const fetchUser = async () => {
    try {

      const { data } = await api.get("/api/user/is-auth");

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
     FETCH PRODUCTS
  ================================ */

  const fetchProducts = async () => {
    try {

      const { data } = await api.get("/api/product/list");

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
     CART ACTIONS
  ================================ */

  const addToCart = (productId, variant) => {

    if (!user) {
      toast.error("Please login to add products to cart");
      setShowUserLogin(true);
      return;
    }

    const variantKey = variant.label;

    setCartItems((prev) => {

      const updated = structuredClone(prev);

      if (!updated[productId]) updated[productId] = {};

      updated[productId][variantKey] =
        (updated[productId][variantKey] || 0) + 1;

      return updated;
    });

    toast.success("Added to Cart");
  };

  const updateCartItem = (productId, variantLabel, quantity) => {

    setCartItems((prev) => {

      const updated = structuredClone(prev);

      if (!updated[productId]) return prev;

      if (quantity <= 0) {
        delete updated[productId][variantLabel];
      } else {
        updated[productId][variantLabel] = quantity;
      }

      if (Object.keys(updated[productId]).length === 0) {
        delete updated[productId];
      }

      return updated;
    });
  };

  const removeFromCart = (productId, variantLabel) => {

    setCartItems((prev) => {

      const updated = structuredClone(prev);

      if (!updated[productId]) return prev;

      delete updated[productId][variantLabel];

      if (Object.keys(updated[productId]).length === 0) {
        delete updated[productId];
      }

      return updated;
    });

    toast.success("Removed from Cart");
  };

  /* ===============================
     CART HELPERS
  ================================ */

  const getCartCount = () => {

    let count = 0;

    for (const productId in cartItems) {
      for (const variant in cartItems[productId]) {
        count += cartItems[productId][variant];
      }
    }

    return count;
  };

  const getCartAmount = () => {

    let total = 0;

    for (const productId in cartItems) {

      const product = productMap[productId];
      if (!product) continue;

      for (const variantLabel in cartItems[productId]) {

        const qty = cartItems[productId][variantLabel];

        const variant = product.variants?.find(
          v => v.label === variantLabel
        );

        if (!variant) continue;

        total += variant.offerPrice * qty;

      }

    }

    return Number(total.toFixed(2));
  };

  /* ===============================
     INITIAL LOAD
  ================================ */

  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

  /* ===============================
     CART SYNC
  ================================ */

  useEffect(() => {

    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    if (!user) return;

    const syncCart = async () => {
      try {

        const { data } = await api.post("/api/cart/update", { cartItems });

        if (!data.success) {
          toast.error(data.message);
        }

      } catch (error) {
        toast.error(error.message);
      }
    };

    syncCart();

  }, [cartItems, user]);

  /* ===============================
     CLEAR CART ON LOGOUT
  ================================ */

  useEffect(() => {

    if (!user) {
      setCartItems({});
      localStorage.removeItem("cartItems");
    }

  }, [user]);

  /* ===============================
     CONTEXT VALUE
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

    axios: api,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

/* ===============================
   HOOK
================================ */

export const useAppContext = () => useContext(AppContext);
