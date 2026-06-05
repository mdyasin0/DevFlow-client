import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { GrOverview } from "react-icons/gr";
import { IoHome } from "react-icons/io5";
import {
  MdCreateNewFolder,
  MdOutlineAirplanemodeInactive,
  MdOutlineInsertInvitation,
} from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { SiMinutemailer } from "react-icons/si";
import { TbDeviceIpadMinus, TbHeartRateMonitor } from "react-icons/tb";
import { NavLink, Outlet } from "react-router";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const Admin_Dashboard_Layout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navClass =
    "flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200";

  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-(--bg) text-(--text) overflow-hidden">
      
      {/* TOGGLE BUTTON (MOBILE) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-(--primary) text-white p-2 rounded-full shadow-lg"
      >
        {isOpen ? <IoIosArrowBack /> : <IoIosArrowForward />}
      </button>

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 border-r border-(--border) bg-(--card) flex flex-col transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* LOGO */}
        <div className="p-5 text-xl font-bold text-(--primary)">DevFlow</div>

        {/* NAV */}
        <div className="flex-1 overflow-y-auto px-3 space-y-2">
          <NavLink
            to="/"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `${navClass} ${
                isActive
                  ? "bg-(--primary) text-white shadow"
                  : "text-(--text-secondary) hover:bg-(--bg-secondary)"
              }`
            }
          >
            <IoHome /> Home
          </NavLink>

          <NavLink
            to="/admin_dashboard_layout/profile"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `${navClass} ${
                isActive
                  ? "bg-(--primary) text-white"
                  : "text-(--text-secondary) hover:bg-(--bg-secondary)"
              }`
            }
          >
            <CgProfile /> Profile
          </NavLink>

          <NavLink
            to="/admin_dashboard_layout/email_communication"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `${navClass} ${
                isActive
                  ? "bg-(--primary) text-white"
                  : "text-(--text-secondary) hover:bg-(--bg-secondary)"
              }`
            }
          >
            <SiMinutemailer /> email_communication
          </NavLink>

          <NavLink
            to="/admin_dashboard_layout/user_administration"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `${navClass} ${
                isActive
                  ? "bg-(--primary) text-white"
                  : "text-(--text-secondary) hover:bg-(--bg-secondary)"
              }`
            }
          >
            <TbDeviceIpadMinus /> User-Administration
          </NavLink>

          <NavLink
            to="/admin_dashboard_layout/site_overview"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `${navClass} ${
                isActive
                  ? "bg-(--primary) text-white"
                  : "text-(--text-secondary) hover:bg-(--bg-secondary)"
              }`
            }
          >
            <GrOverview /> Site_Overview
          </NavLink>

          <NavLink
            to="/admin_dashboard_layout/project_monitoring"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `${navClass} ${
                isActive
                  ? "bg-(--primary) text-white"
                  : "text-(--text-secondary) hover:bg-(--bg-secondary)"
              }`
            }
          >
            <TbHeartRateMonitor /> Project_Monitoring
          </NavLink>

          <NavLink
            to="/admin_dashboard_layout/inactive_users"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `${navClass} ${
                isActive
                  ? "bg-(--primary) text-white"
                  : "text-(--text-secondary) hover:bg-(--bg-secondary)"
              }`
            }
          >
            <MdOutlineAirplanemodeInactive /> Inactive_Users
          </NavLink>
        </div>
      </aside>

      {/* OVERLAY (MOBILE) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        ></div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto bg-(--bg-secondary) p-6 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Admin_Dashboard_Layout;