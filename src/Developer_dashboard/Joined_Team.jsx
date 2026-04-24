import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Firebase/AuthContext";
import { Link } from "react-router";

const Joined_Team = () => {
  const { user } = useContext(AuthContext);
  const email = user?.email;

  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    if (!email) return; // 👈 important

    const res = await fetch(
      `http://localhost:5000/my-projects/${email}`
    );
    const data = await res.json();

    if (data.success) {
      setProjects(data.data);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [email]); // 👈 dependency fix

  return (
    <div className="p-6 text-white bg-gray-950 min-h-screen">
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