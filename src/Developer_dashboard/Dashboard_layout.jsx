import React, { useState } from "react";
import { AiFillProject } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { IoHome } from "react-icons/io5";
import { MdCreateNewFolder, MdOutlineInsertInvitation } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { Outlet, NavLink } from "react-router";
import { FiMenu } from "react-icons/fi";
import { FaAnglesRight } from "react-icons/fa6";

const Dashboard_layout = () => {
  const [open, setOpen] = useState(false);

  const navClass =
    "flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200";

  return (
    <div className="flex h-screen bg-(--bg) text-(--text)">
      
      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed z-50  bg-(--primary) text-white p-2 rounded-lg"
      >
        <FaAnglesRight  size={20} />
      </button>

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-(--card) border-r border-(--border) flex flex-col transform transition-transform duration-300 z-40
        ${open ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
      >
        {/* LOGO */}
        <div className="p-5 text-xl font-bold text-(--primary)">
          DevFlow
        </div>

        {/* NAV */}
        <div className="flex-1 overflow-y-auto px-3 space-y-2">
          <NavLink
            to="/"
            onClick={() => setOpen(false)}
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
            to="/developer_dashboard/profile"
            onClick={() => setOpen(false)}
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
            to="/developer_dashboard/created_project"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${navClass} ${
                isActive
                  ? "bg-(--primary) text-white"
                  : "text-(--text-secondary) hover:bg-(--bg-secondary)"
              }`
            }
          >
            <MdCreateNewFolder /> Created Project
          </NavLink>

          <NavLink
            to="/developer_dashboard/joined_team"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${navClass} ${
                isActive
                  ? "bg-(--primary) text-white"
                  : "text-(--text-secondary) hover:bg-(--bg-secondary)"
              }`
            }
          >
            <RiTeamFill /> Joined Team
          </NavLink>

          <NavLink
            to="/developer_dashboard/invitations"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${navClass} ${
                isActive
                  ? "bg-(--primary) text-white"
                  : "text-(--text-secondary) hover:bg-(--bg-secondary)"
              }`
            }
          >
            <MdOutlineInsertInvitation /> Invitations
          </NavLink>
        </div>
      </aside>

      {/* OVERLAY (mobile only) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        ></div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto bg-(--bg-secondary) p-4 md:p-6 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard_layout;