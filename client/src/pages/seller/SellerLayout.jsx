import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import fruitwala from "../../assets/fruitwala.svg";
import { useState } from "react";

const SellerLayout = () => {
  const { axios, navigate } = useAppContext();
  const [openSidebar, setOpenSidebar] = useState(false);

  const sidebarLinks = [
    { name: "Add Product", path: "/seller", icon: assets.add_icon },
    {
      name: "Product List",
      path: "/seller/product-list",
      icon: assets.product_list_icon,
    },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
  ];

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/seller/logout");
      if (data.success) {
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      {/* ================= TOP BAR ================= */}
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpenSidebar(true)}
            className="md:hidden p-2 border rounded"
          >
            ☰
          </button>

          <Link to="/">
            <img className="h-10 w-auto" src={fruitwala} alt="FruitWala.in" />
          </Link>
        </div>

        <div className="flex items-center gap-4 text-gray-500">
          <p className="hidden sm:block">Hi! Admin</p>
          <button
            onClick={logout}
            className="border rounded-full text-sm px-4 py-1"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ================= BODY ================= */}
      {/* ⬇️ FIX IS HERE */}
      <div className="flex h-[calc(100vh-64px)] overflow-hidden relative">
        
        {/* ================= SIDEBAR ================= */}
        {openSidebar && (
          <div
            onClick={() => setOpenSidebar(false)}
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
          />
        )}

        <div
          className={`
            fixed md:static top-0 left-0 h-full z-40 bg-white
            border-r border-gray-300
            w-64 transform transition-transform duration-300
            ${openSidebar ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
          `}
        >
          <div className="pt-4 flex flex-col h-full">
            <button
              onClick={() => setOpenSidebar(false)}
              className="md:hidden self-end mr-4 mb-3 text-xl"
            >
              ✕
            </button>

            {sidebarLinks.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/seller"}
                onClick={() => setOpenSidebar(false)}
                className={({ isActive }) =>
                  `flex items-center py-3 px-5 gap-3 ${
                    isActive
                      ? "border-r-4 bg-primary/10 border-primary text-primary"
                      : "hover:bg-gray-100 text-gray-500"
                  }`
                }
              >
                <img src={item.icon} alt={item.name} className="w-6 h-6" />
                <p>{item.name}</p>
              </NavLink>
            ))}
          </div>
        </div>

        {/* ================= PAGE CONTENT ================= */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default SellerLayout;
