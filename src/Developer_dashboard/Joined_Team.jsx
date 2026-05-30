import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Firebase/AuthContext";
import { Link, useNavigate } from "react-router";
import Developer_projects from "./Developer_projects";
import { toast } from "react-toastify";

const Joined_Team = () => {
  const { user, logOut } = useContext(AuthContext);
  const email = user?.email;
const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const fetchProjects = async () => {
      if (!email) return;

      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/my-projects/${email}`, {
          credentials: "include",
        });
        //  1. AUTH  logout
        if (res.status === 401) {
          toast.warn("Session expired. Please login again");
          await logOut();
          navigate("/login");
          return;
        }
        const data = await res.json();
        // 2. BLOCKED USER
        if (data?.isBlocked) {
          toast.warn("You are blocked by admin");
          await logOut();
         navigate("/login"); 
          return;
        }
        if (data.success) {
          setProjects(data.data);
        } else {
          setProjects([]);
        }
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [email, logOut]);
  const filteredProjects = projects.filter(
    (project) =>
      project.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  if (!email) return null;

  //  Loading
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  //  No Data
  if (projects.length === 0) {
    return <Developer_projects />;
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-(--bg-secondary) min-h-full text-(--text)">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-(--primary)">
          Joined Teams
        </h1>
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by team name or project title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-full md:w-1/2 px-3 sm:px-4 py-2 rounded-lg border border-(--border) bg-(--card) text-(--text) text-sm sm:text-base"
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border border-(--border) bg-(--card) shadow">
        <table className="w-full text-xs sm:text-sm md:text-base">
          {/* HEAD */}
          <thead className="bg-(--bg-secondary) text-(--text-secondary)">
            <tr className="text-left">
              <th className="px-2 sm:px-4 py-2 sm:py-3">#</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3">Team Name</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3">Project Title</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3">Start Time</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-center">Action</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {filteredProjects.map((p, index) => (
              <tr
                key={p._id}
                className="border-t border-(--border) hover:bg-(--bg-secondary) transition"
              >
                <td className="px-2 sm:px-4 py-2 sm:py-3">{index + 1}</td>

                <td className="px-2 sm:px-4 py-2 sm:py-3 font-medium">
                  {p.teamName}
                </td>

                <td className="px-2 sm:px-4 py-2 sm:py-3 text-(--text-secondary)">
                  {p.projectTitle}
                </td>

                <td className="px-2 sm:px-4 py-2 sm:py-3 text-(--text-secondary)">
                  {new Date(p.created_time).toLocaleDateString()}
                </td>

                <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                  <Link
                    to={`/developer_dashboard/joined_team_details/${p._id}`}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-(--primary) text-white text-[10px] sm:text-xs md:text-sm hover:bg-(--primary-hover) transition"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Joined_Team;
