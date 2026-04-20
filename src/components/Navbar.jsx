import React, { useContext, useState } from "react";
import { BiMenu } from "react-icons/bi";
import { FaBell } from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { ThemeContext } from "../color/ThemeContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav
      className="w-full sticky top-0 z-50 backdrop-blur border-b
      bg-(--bg) border-(--border) text-(--text)"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <h1 className="text-xl font-bold text-(--primary)">
          DevFlow
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm text-(--text-secondary)">
          <a className="hover:text-(--primary)">Features</a>
          <a className="hover:text-(--primary)">Pricing</a>
          <a className="hover:text-(--primary)">Docs</a>
          <a className="font-medium text-(--text)">Dashboard</a>
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-(--text) bg-(--card) text-(--text)"
          >
            {theme === "dark" ? (
              <MdLightMode size={18} />
            ) : (
              <MdDarkMode size={18} />
            )}
          </button>

          {/* Notification */}
          <button className="p-2 rounded-lg bg-(--card) text-(--text)">
            <FaBell size={16} />
          </button>

          {/* CTA Button */}
          <button className="px-3 py-2 rounded-lg text-white
            bg-(--primary) hover:bg-(--primary-hover)">
            Get Started
          </button>

          {/* Profile */}
          <img
            src="https://i.pravatar.cc/40"
            className="w-8 h-8 rounded-full border border-(--border)"
          />
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden p-2 text-(--text)"
          onClick={() => setOpen(!open)}
        >
          {open ? <IoClose size={22} /> : <BiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-3 text-sm text-(--text-secondary)">

          <a className="block">Features</a>
          <a className="block">Pricing</a>
          <a className="block">Docs</a>
          <a className="block font-medium text-(--text)">Dashboard</a>

          <div className="flex items-center gap-3 pt-3 border-t border-(--border)">

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-(--text) bg-(--card) text-(--text)"
            >
              {theme === "dark" ? (
                <MdLightMode size={18} />
              ) : (
                <MdDarkMode size={18} />
              )}
            </button>

            <button className="p-2 rounded-lg bg-(--card) text-(--text)">
              <FaBell size={16} />
            </button>

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;