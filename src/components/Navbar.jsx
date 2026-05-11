import React, { useContext, useEffect, useState, useMemo } from "react";
import { BiMenu } from "react-icons/bi";
import { FaBell, FaSignOutAlt, FaUser } from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { ThemeContext } from "../color/ThemeContext";
import { AuthContext } from "../Firebase/AuthContext";
import { Link, NavLink, useNavigate } from "react-router";
import { FaEllipsisV } from "react-icons/fa";
import {  Socket } from "socket.io-client";
import { socket } from "../Socket";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [openNoti, setOpenNoti] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logOut, role } = useContext(AuthContext);
  const navigate = useNavigate();
const [dbUser, setDbUser] = useState(null);
useEffect(() => {
  if (!user?.email) return;

  fetch(`http://localhost:5000/users/${user.email}`,{
    credentials:"include",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setDbUser(data.data); // 🔥 এখানে MongoDB user আসবে
      }
    });
}, [user?.email]);
useEffect(() => {
  if (dbUser?._id) {
    socket.emit("join", dbUser._id); // ✅ correct
    console.log("Joined room:", dbUser._id);
  }
}, [dbUser]);
useEffect(() => {
  socket.on("newNotification", (data) => {
    setNotifications((prev) => [data, ...prev]);
  });

  return () => socket.off("newNotification");
}, []);
  // 🔥 FETCH NOTIFICATIONS (ROLE BASED)
  useEffect(() => {
    if (!user?.email) return;

    fetch(`http://localhost:5000/notifications?email=${user.email}` ,{
      credentials:"include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNotifications(data.data || []);
        }
      });
  }, [user?.email]);
  // delete notification
  const deleteNotification = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/notifications/${id}`, {
        method: "DELETE",
        credentials:"include",
      });

      const data = await res.json();

      if (data.success) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  // notification read unread toggle
  const toggleRead = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/notifications/${id}/toggle-read`,
        {
          method: "PATCH",
          credentials:"include",
        }
      );

      const data = await res.json();

      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, read: !n.read } : n)),
        );
      }
    } catch (err) {
      console.log(err.message);
    }
  };
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
    return notifications?.filter((n) => !n.read)?.length || 0;
  }, [notifications]);
  const getTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);

    const diffMs = now - past;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour ago`;
    return `${days} days ago`;
  };
  return (
    <nav className="w-full sticky top-0 z-50 backdrop-blur border-b bg-(--bg) border-(--border) text-(--text)">
      <div className="max-w-7xl mx-auto relative px-4 py-3 flex items-center justify-between">
        {/* 🔔 NOTIFICATION BOX */}
        {openNoti && (
          <div className="absolute right-20 top-14 w-96 bg-(--card) border border-(--border) rounded-xl shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-(--border) flex justify-between items-center">
              <h2 className="font-semibold text-lg">Notifications</h2>
              <span className="text-xs text-gray-400">
                {notifications.length} total
              </span>
            </div>

            {/* Body */}
            <div className="max-h-96 py-10 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="p-4 text-sm text-center text-(--text-secondary)">
                  No notifications
                </p>
              ) : (
                notifications.map((n) => {
                  const isExpanded = expanded === n._id;

                  return (
                    <div
                      key={n._id}
                      className={`relative p-3 border-b border-(--border) transition hover:bg-(--bg-secondary) ${
                        n.read ? "opacity-60" : "bg-opacity-100"
                      }`}
                    >
                      {/* TOP ROW */}
                      <div className="flex justify-between items-start">
                        {/* MESSAGE */}
                        <div className="pr-6">
                          <p className="text-sm font-medium">
                            {isExpanded
                              ? n.message
                              : n.message.length > 60
                                ? n.message.slice(0, 60) + "..."
                                : n.message}
                          </p>

                          {/* READ MORE */}
                          {n.message.length > 60 && (
                            <button
                              onClick={() =>
                                setExpanded(isExpanded ? null : n._id)
                              }
                              className="text-xs text-blue-500 mt-1"
                            >
                              {isExpanded ? "Show less" : "Read more"}
                            </button>
                          )}

                          {/* TIME */}
                          <p className="text-[11px] text-gray-400 mt-1">
                            {getTimeAgo(n.created_time)}
                          </p>
                        </div>

                        {/* 3 DOT MENU */}
                        <div
                          className="cursor-pointer"
                          onMouseEnter={() => setActiveMenu(n._id)}
                          onMouseLeave={() => setActiveMenu(null)}
                        >
                          <FaEllipsisV className="text-gray-400" />

                          {activeMenu === n._id && (
                            <div className="absolute right-2 top-8 bg-white dark:bg-gray-800 shadow-lg rounded-md text-sm w-40 overflow-hidden z-50">
                              {/* MARK AS READ */}
                              <button
                                onClick={() => toggleRead(n._id)}
                                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                {n.read ? "Mark as unread" : "Mark as read"}
                              </button>

                              {/* DELETE */}
                              <button
                                onClick={() => deleteNotification(n._id)}
                                className="w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* LINK */}
                      {n.url && (
                        <Link
                          to={n.url}
                          onClick={() => setOpenNoti(false)}
                          className="text-xs text-blue-500 underline mt-2 inline-block"
                        >
                          View details
                        </Link>
                      )}
                    </div>
                  );
                })
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
          {role === "developer" && (
            <NavLink
              to="/developer_dashboard"
              className="font-medium text-(--text)"
            >
              Dashboard
            </NavLink>
          )}
          {role === "admin" && (
            <NavLink
              to="/admin_dashboard_layout"
              className="font-medium text-(--text)"
            >
              admin_Dashboard
            </NavLink>
          )}
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
