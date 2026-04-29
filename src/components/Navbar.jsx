import React, { useContext, useState } from "react";
import { BiMenu } from "react-icons/bi";
import { FaBell, FaSignOutAlt, FaUser } from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { ThemeContext } from "../color/ThemeContext";
import { AuthContext } from "../Firebase/AuthContext";
import { Link, NavLink, useNavigate } from "react-router";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut().then(() => {
      setDropdown(false);
      navigate("/login");
    });
  };

  return (
    <nav className="w-full sticky top-0 z-50 backdrop-blur border-b bg-(--bg) border-(--border) text-(--text)">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-xl font-bold text-(--primary)">DevFlow</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm text-(--text-secondary)">
          <a className="hover:text-(--primary)">Features</a>
          <a className="hover:text-(--primary)">Pricing</a>
          <a className="hover:text-(--primary)">Docs</a>
          <NavLink
            to="/developer_dashboard"
            className="font-medium text-(--text)"
          >
            Dashboard
          </NavLink>
         
           <NavLink
            to="/admin_dashboard_layout"
            className="font-medium text-(--text)"
          >
            admin_Dashboard
          </NavLink>
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
          <button className="p-2 rounded-lg bg-(--card)">
            <FaBell />
          </button>

          {/* USER AREA */}
          {user ? (
            <div className="relative">
              {/* Profile Image */}
              <img
                src={user?.photoURL || "https://i.pravatar.cc/40"}
                alt="user"
                onClick={() => setDropdown(!dropdown)}
                className="w-8 h-8 rounded-full border border-(--border) cursor-pointer"
              />

              {/* DROPDOWN */}
              {dropdown && (
                <div className="absolute right-0 mt-3 w-48 bg-(--card) border border-(--border) rounded-lg shadow-lg overflow-hidden">
                  {/* Profile Info */}
                  <div className="p-3 border-b border-(--border)">
                    <p className="text-sm font-medium">
                      {user?.displayName || "User"}
                    </p>
                    <p className="text-xs text-(--text-secondary)">
                      {user?.email}
                    </p>
                  </div>

                  {/* View Profile */}
                  <NavLink
                    to="/developer_dashboard/profile"
                    onClick={() => setDropdown(false)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-(--bg-secondary)"
                  >
                    <FaUser /> View Profile
                  </NavLink>

                  {/* Logout */}
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

      {/* Mobile Menu */}
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
