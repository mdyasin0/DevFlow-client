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
      } catch (err) {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [email]);

  // 🚨 safety
  if (!email) return null;

  // ⏳ LOADING → only show clean screen (no extra UI)
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex justify-end p-6">
        <button className="bg-blue-500 px-4 py-2 rounded-lg text-white">
          Loading...
        </button>
      </div>
    );
  }

  // ❌ NO DATA → show Developer_projects (empty state UI)
  if (projects.length === 0) {
    return <Developer_projects />;
  }

  // ✅ DATA EXISTS → dashboard view
  return (
    <div className="p-6 text-white bg-gray-950 min-h-screen relative">

      {/* TOP RIGHT BUTTON */}
      <button className="absolute top-6 right-6 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold shadow-md">
        Joined Teams
      </button>

      <h1 className="text-2xl mb-4 text-blue-400">My Projects</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {projects.map((p) => (
          <Link
            to={`/developer_dashboard/joined_team_details/${p._id}`}
            key={p._id}
            className="bg-gray-800 p-4 rounded-xl hover:bg-gray-700"
          >
            <h2 className="text-lg font-bold">{p.teamName}</h2>
            <p className="text-gray-400">{p.projectTitle}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Joined_Team;