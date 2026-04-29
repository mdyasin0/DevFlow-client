import React from 'react';
import { CgProfile } from 'react-icons/cg';
import { IoHome } from 'react-icons/io5';
import { MdCreateNewFolder, MdOutlineInsertInvitation } from 'react-icons/md';
import { RiTeamFill } from 'react-icons/ri';
import { SiMinutemailer } from 'react-icons/si';
import { NavLink, Outlet } from 'react-router';

const Admin_Dashboard_Layout = () => {
     const navClass =
    "flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200";
    return (
        <div className="flex h-screen bg-(--bg) text-(--text)">

      {/* SIDEBAR */}
      <aside className="w-64 border-r border-(--border) bg-(--card) flex flex-col">

        {/* LOGO */}
        <div className="p-5 text-xl font-bold text-(--primary)">
          DevFlow
        </div>

        {/* NAV */}
        <div className="flex-1 overflow-y-auto px-3 space-y-2">

          <NavLink
            to="/"
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
            to="/developer_dashboard/joined_team"
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

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto bg-(--bg-secondary) p-6">
        <Outlet />
      </main>
    </div>
    );
};

export default Admin_Dashboard_Layout;
