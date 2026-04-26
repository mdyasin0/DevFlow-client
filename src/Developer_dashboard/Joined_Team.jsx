import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Firebase/AuthContext";
import { Link } from "react-router";
import Developer_projects from "./Developer_projects";

const Joined_Team = () => {
  const { user } = useContext(AuthContext);
  const email = user?.email;

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!email) return;

      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/my-projects/${email}`
        );
        const data = await res.json();

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
  }, [email]);

  if (!email) return null;

  // ⏳ Loading
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-(--text)">
        <div className="px-5 py-2 rounded-lg bg-(--primary) text-white shadow">
          Loading...
        </div>
      </div>
    );
  }

  // ❌ No Data
  if (projects.length === 0) {
    return <Developer_projects />;
  }

  return (
    <div className="p-6 bg-(--bg-secondary) min-h-full text-(--text)">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-(--primary)">
          Joined Teams
        </h1>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border border-(--border) bg-(--card) shadow">

        <table className="w-full text-sm">

          {/* HEAD */}
          <thead className="bg-(--bg-secondary) text-(--text-secondary)">
            <tr className="text-left">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Team Name</th>
              <th className="px-4 py-3">Project Title</th>
              <th className="px-4 py-3">Start Time</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {projects.map((p, index) => (
              <tr
                key={p._id}
                className="border-t border-(--border) hover:bg-(--bg-secondary) transition"
              >
                <td className="px-4 py-3">{index + 1}</td>

                <td className="px-4 py-3 font-medium">
                  {p.teamName}
                </td>

                <td className="px-4 py-3 text-(--text-secondary)">
                  {p.projectTitle}
                </td>

                <td className="px-4 py-3 text-(--text-secondary)">
                  {new Date(p.created_time).toLocaleDateString()}
                </td>

                <td className="px-4 py-3 text-center">
                  <Link
                    to={`/developer_dashboard/joined_team_details/${p._id}`}
                    className="px-3 py-1.5 rounded-lg bg-(--primary) text-white text-xs hover:bg-(--primary-hover) transition"
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