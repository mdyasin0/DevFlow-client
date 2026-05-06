import React, { useContext, useEffect, useState, useMemo } from "react";
import { BiMenu } from "react-icons/bi";
import { FaBell, FaSignOutAlt, FaUser } from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { ThemeContext } from "../color/ThemeContext";
import { AuthContext } from "../Firebase/AuthContext";
import { Link, NavLink, useNavigate } from "react-router";
import { socket } from "../Socket";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [openNoti, setOpenNoti] = useState(false);

  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logOut, role } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🔥 FETCH NOTIFICATIONS (ROLE BASED)
  useEffect(() => {
    

    fetch(`http://localhost:5000/notifications`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNotifications(data.data || []);
        }
      });
  }, [user?.email]);

  // 🔥 SOCKET UPDATE
  useEffect(() => {
    socket.on("newNotification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  const handleNotificationToggle = () => {
    setOpenNoti((prev) => !prev);
  };

  const handleLogout = () => {
    logOut().then(() => {
      setDropdown(false);
      navigate("/login");
    });
  };

  // 🔥 PERFORMANCE OPTIMIZED COUNT
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);
useEffect(() => {
  if (!user?._id) return;

  const handleConnect = () => {
    socket.emit("join", user._id);
  };

  socket.on("connect", handleConnect);

  if (socket.connected) {
    socket.emit("join", user._id);
    console.log("mothwer chod=============",user._id);
  }

  return () => {
    socket.off("connect", handleConnect);
  };
}, [user?._id]);
  return (
    <nav className="w-full sticky top-0 z-50 backdrop-blur border-b bg-(--bg) border-(--border) text-(--text)">
      <div className="max-w-7xl mx-auto relative px-4 py-3 flex items-center justify-between">

        {/* 🔔 NOTIFICATION BOX */}
        {openNoti && (
          <div className="absolute right-20 top-14 w-80 bg-(--card) border border-(--border) rounded-lg shadow-lg z-50">
            <div className="p-3 border-b border-(--border)">
              <h2 className="font-semibold">Notifications</h2>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="p-3 text-sm text-(--text-secondary)">
                  No notifications
                </p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`p-3 border-b border-(--border) text-sm ${
                      n.read ? "opacity-60" : "font-semibold"
                    }`}
                  >
                    <p>{n.message}</p>

                    {/* optional link */}
                    {n.url && (
                      <Link
                        to={n.url}
                        className="text-blue-500 text-xs underline"
                        onClick={() => setOpenNoti(false)}
                      >
                        View
                      </Link>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Logo */}
        <NavLink to="/">
          <h1 className="text-xl font-bold text-(--primary)">DevFlow</h1>
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm text-(--text-secondary)">
          <NavLink to="/pricingpage" className="font-medium text-(--text)">
            price
          </NavLink>
          <a className="hover:text-(--primary)">Docs</a>
           {role === "developer" &&   <NavLink to="/developer_dashboard" className="font-medium text-(--text)">
            Dashboard
          </NavLink>}
         {role === "admin" &&  <NavLink to="/admin_dashboard_layout" className="font-medium text-(--text)">
            admin_Dashboard
          </NavLink>}
         
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3">

          {/* Theme */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-(--border) bg-(--card)"
          >
            {theme === "dark" ? <MdLightMode /> : <MdDarkMode />}
          </button>

          {/* Bell */}
          <button
            onClick={handleNotificationToggle}
            className="relative p-2 cursor-pointer rounded-lg bg-(--card)"
          >
            <FaBell />

            {/* 🔥 UNREAD BADGE */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* USER */}
          {user ? (
            <div className="relative">
              <img
                src={user?.photoURL || "https://i.pravatar.cc/40"}
                alt="user"
                onClick={() => setDropdown(!dropdown)}
                className="w-8 h-8 rounded-full border cursor-pointer"
              />

              {dropdown && (
                <div className="absolute right-0 mt-3 w-48 bg-(--card) border rounded-lg shadow-lg overflow-hidden">

                  <div className="p-3 border-b">
                    <p className="text-sm font-medium">
                      {user?.displayName || "User"}
                    </p>
                    <p className="text-xs text-(--text-secondary)">
                      {user?.email}
                    </p>
                  </div>

                  <NavLink
                    to="/profile"
                    onClick={() => setDropdown(false)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-(--bg-secondary)"
                  >
                    <FaUser /> Profile
                  </NavLink>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-(--bg-secondary)"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/register"
              className="px-3 py-2 rounded-lg text-white bg-(--primary)"
            >
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <IoClose /> : <BiMenu />}
        </button>
      </div>

      {/* Mobile */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-3">
          <a>Features</a>
          <a>Pricing</a>
          <a>Docs</a>
          <a>Dashboard</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;