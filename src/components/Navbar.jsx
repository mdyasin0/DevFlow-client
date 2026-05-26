import React, { useContext, useEffect, useState, useMemo } from "react";
import { BiMenu } from "react-icons/bi";
import { FaBell, FaSignOutAlt, FaUser } from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { ThemeContext } from "../color/ThemeContext";
import { AuthContext } from "../Firebase/AuthContext";
import { Link, NavLink, useNavigate } from "react-router";
import { FaEllipsisV } from "react-icons/fa";
import { Socket } from "socket.io-client";
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

    fetch(`https://devflow-server-777f.onrender.com/users/${user.email}`)
      .then((res) => {
        res.data;
      })
      .then((data) => {
        if (data?.success) {
          setDbUser(data.data); //  MongoDB user
        }
      });
  }, [user?.email]);
  useEffect(() => {
    if (dbUser?._id) {
      socket.emit("join", dbUser._id);
    }
  }, [dbUser]);
  useEffect(() => {
    socket.on("newNotification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => socket.off("newNotification");
  }, []);

  useEffect(() => {
    if (!user?.email) return;

    fetch(`https://devflow-server-777f.onrender.com/notifications?email=${user.email}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          setNotifications(data.data || []);
        }
      });
  }, [user?.email, logOut]);
  // delete notification
  const deleteNotification = async (id) => {
    try {
      const res = await fetch(`https://devflow-server-777f.onrender.com/notifications/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.status === 401 || res.status === 403) {
        alert("Session expired. Please login again");
        await logOut();
        window.location.href = "/login";
        return;
      }
      const data = await res.json();

      if (data.success) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
      }
    } catch (err) {
      alert(err.message);
    }
  };
  // notification read unread toggle
  const toggleRead = async (id) => {
    try {
      const res = await fetch(
        `https://devflow-server-777f.onrender.com/notifications/${id}/toggle-read`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );
      if (res.status === 401 || res.status === 403) {
        alert("Session expired. Please login again");
        await logOut();
        navigate("/login");
        return;
      }
      const data = await res.json();

      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, read: !n.read } : n)),
        );
      }
    } catch (err) {
      alert(err.message);
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

  //  PERFORMANCE OPTIMIZED COUNT
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
      <div className="max-w-7xl mx-auto relative px-3 sm:px-4 md:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-(--primary)">
            DevFlow
          </h1>
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 text-sm text-(--text-secondary)">
          <NavLink to="/pricingpage" className="font-medium text-(--text)">
            price
    

          </NavLink>
          
      <NavLink
              to="/docs"
              className="font-medium text-(--text)"
            >
              Docs
            </NavLink>
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
        <div className="hidden md:flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-(--border) bg-(--card)"
          >
            {theme === "dark" ? <MdLightMode /> : <MdDarkMode />}
          </button>

          {user && (
            <div className="relative ">
              <button
                onClick={handleNotificationToggle}
                className="relative p-2 cursor-pointer rounded-lg bg-(--card)"
              >
                <FaBell />

                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              {/* NOTIFICATION BOX */}
              {openNoti && (
                <div className="absolute right-0 mt-3 w-[90vw] sm:w-96 max-w-sm bg-(--card) border border-(--border) rounded-xl shadow-2xl z-9999 overflow-hidden">
                  {/* Header */}
                  <div className="p-3 sm:p-4 border-b border-(--border) flex justify-between items-center">
                    <h2 className="font-semibold text-base sm:text-lg">
                      Notifications
                    </h2>
                    <span className="text-xs text-gray-400">
                      {notifications.length} total
                    </span>
                  </div>

                  {/* Body */}
                  <div className="max-h-80 sm:max-h-96 py-6 sm:py-10 overflow-y-auto">
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
                            <div className="flex justify-between items-start">
                              <div className="pr-4 sm:pr-6">
                                <p className="text-xs sm:text-sm font-medium wrap-break-words">
                                  {isExpanded
                                    ? n.message
                                    : n.message.length > 60
                                      ? n.message.slice(0, 60) + "..."
                                      : n.message}
                                </p>

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

                                <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1">
                                  {getTimeAgo(n.created_time)}
                                </p>
                              </div>

                              {/* 3 DOT */}
                              <div
                                className="cursor-pointer"
                                onMouseEnter={() => setActiveMenu(n._id)}
                                onMouseLeave={() => setActiveMenu(null)}
                              >
                                <FaEllipsisV className="text-gray-400 text-sm" />

                                {activeMenu === n._id && (
                                  <div className="absolute right-2 top-8 bg-white dark:bg-gray-800 shadow-lg rounded-md text-sm w-36 sm:w-40 overflow-hidden z-50">
                                    <button
                                      onClick={() => toggleRead(n._id)}
                                      className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                      {n.read
                                        ? "Mark as unread"
                                        : "Mark as read"}
                                    </button>

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
            </div>
          )}

          {user ? (
            <div className="relative">
              <img
                src={user?.photoURL || "https://i.pravatar.cc/40"}
                alt="user"
                onClick={() => setDropdown(!dropdown)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border cursor-pointer"
              />

              {dropdown && (
                <div className="absolute right-0 mt-3 w-44 sm:w-48 bg-(--card) border rounded-lg shadow-lg overflow-hidden">
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

        {/* Mobile Menu Button */}
        <button className="md:hidden text-xl" onClick={() => setOpen(!open)}>
          {open ? <IoClose /> : <BiMenu />}
        </button>
      </div>

      {/* Mobile */}
      {open && (
        <div className="max-w-7xl mx-auto relative px-3 sm:px-4 md:px-6 py-3 flex items-center justify-between overflow-visible">
          <div className="md:hidden px-4 pb-4 space-y-4 text-sm bg-(--bg) border-t border-(--border)">
            {/* MENU LINKS */}
            <div className="flex flex-col gap-3 text-(--text-secondary)">
              <NavLink to="/pricingpage" className="font-medium text-(--text)">
                price
              </NavLink>

               <NavLink
              to="/docs"
              className="font-medium text-(--text)"
            >
              Docs
            </NavLink>

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

            {/* ACTION BUTTONS */}
            <div className="flex items-center justify-between  pt-3 border-t border-(--border)">
              {/* THEME */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-(--border) bg-(--card)"
              >
                {theme === "dark" ? <MdLightMode /> : <MdDarkMode />}
              </button>

              {/* NOTIFICATION */}
              {user && (
                <div className="relative">
                  <button
                    onClick={handleNotificationToggle}
                    className="relative p-2 rounded-lg bg-(--card)"
                  >
                    <FaBell />

                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {/* NOTIFICATION BOX */}
                  {openNoti && (
                    <div className="absolute right-0 mt-3 w-[90vw] sm:w-96 max-w-sm bg-(--card) border border-(--border) rounded-xl shadow-2xl z-9999 overflow-hidden">
                      {/* Header */}
                      <div className="p-3 sm:p-4 border-b border-(--border) flex justify-between items-center">
                        <h2 className="font-semibold text-base sm:text-lg">
                          Notifications
                        </h2>
                        <span className="text-xs text-gray-400">
                          {notifications.length} total
                        </span>
                      </div>

                      {/* Body */}
                      <div className="max-h-80 sm:max-h-96 py-6 sm:py-10 overflow-y-auto">
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
                                <div className="flex justify-between items-start">
                                  <div className="pr-4 sm:pr-6">
                                    <p className="text-xs sm:text-sm font-medium wrap-break-words">
                                      {isExpanded
                                        ? n.message
                                        : n.message.length > 60
                                          ? n.message.slice(0, 60) + "..."
                                          : n.message}
                                    </p>

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

                                    <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1">
                                      {getTimeAgo(n.created_time)}
                                    </p>
                                  </div>

                                  {/* 3 DOT */}
                                  <div
                                    className="cursor-pointer"
                                    onMouseEnter={() => setActiveMenu(n._id)}
                                    onMouseLeave={() => setActiveMenu(null)}
                                  >
                                    <FaEllipsisV className="text-gray-400 text-sm" />

                                    {activeMenu === n._id && (
                                      <div className="absolute right-2 top-8 bg-white dark:bg-gray-800 shadow-lg rounded-md text-sm w-36 sm:w-40 overflow-hidden z-50">
                                        <button
                                          onClick={() => toggleRead(n._id)}
                                          className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                          {n.read
                                            ? "Mark as unread"
                                            : "Mark as read"}
                                        </button>

                                        <button
                                          onClick={() =>
                                            deleteNotification(n._id)
                                          }
                                          className="w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>

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
                </div>
              )}

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
                    <div className="absolute right-0 mt-3 w-44 bg-(--card) border rounded-lg shadow-lg overflow-hidden z-50">
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
                        onClick={() => {
                          setDropdown(false);
                          setOpen(false); // mobile menu close
                        }}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-(--bg-secondary)"
                      >
                        <FaUser /> Profile
                      </NavLink>

                      <button
                        onClick={() => {
                          handleLogout();
                          setDropdown(false);
                          setOpen(false);
                        }}
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
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
