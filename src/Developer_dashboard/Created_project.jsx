import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Firebase/AuthContext";
import { useNavigate } from "react-router";
import Developer_projects from "./Developer_projects";


const Created_project = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/projects/${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setProjects(data.data);
          } else {
            setProjects([]);
          }
        })
        .catch(() => setProjects([]));
    }
  }, [user]);

  const hasProjects = projects.length > 0;

  // 🚨 NO USER EMAIL yet safety
  if (!user?.email) return null;

  // ❌ NO PROJECTS → show full empty state UI
  if (!hasProjects) {
    return <Developer_projects />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 relative">

      {/* TOP RIGHT BUTTON */}
      <button
        onClick={() =>
          navigate("/developer_dashboard/create_project")
        }
        className="absolute top-6 right-6 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold shadow-md"
      >
        + Create Project
      </button>

      <h2 className="text-2xl font-bold mb-6">📂 My Projects</h2>

      {/* PROJECT LIST */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project) => (
          <div
            key={project._id}
            onClick={() =>
              navigate(
                `/developer_dashboard/created_project_details/${project._id}`
              )
            }
            className="bg-gray-800 p-5 rounded-xl shadow-md border border-gray-700 cursor-pointer"
          >
            <h3 className="text-lg font-semibold text-blue-400">
              {project.projectTitle}
            </h3>

            <p className="text-sm text-gray-300 mt-2">
              Team: {project.teamName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Created_project;