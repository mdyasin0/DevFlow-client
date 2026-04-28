import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Firebase/AuthContext";
import { useNavigate } from "react-router";
import Developer_projects from "./Developer_projects";

const Created_project = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const handleUpdate = async () => {
  try {
    const res = await fetch(
      `http://localhost:5000/projects/${selectedProject._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamName: selectedProject.teamName,
          projectTitle: selectedProject.projectTitle,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      setProjects((prev) =>
        prev.map((p) =>
          p._id === selectedProject._id ? selectedProject : p
        )
      );

      alert("Project updated successfully ✏️");
      setIsModalOpen(false);
    }
  } catch (error) {
    console.log(error);
  }
};
const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this project?");

  if (!confirmDelete) return;

  try {
    const res = await fetch(`http://localhost:5000/projects/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      setProjects((prev) => prev.filter((p) => p._id !== id));
      alert("Project deleted successfully 🗑️");
    }
  } catch (error) {
    console.log(error);
  }
}; 
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

  if (!user?.email) return null;

  if (!hasProjects) {
    return <Developer_projects />;
  }

  return (
    <div className="bg-(--bg) text-(--text) min-h-full p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">📂 My Projects</h2>

        <button
          onClick={() => navigate("/developer_dashboard/create_project")}
          className="bg-(--primary) hover:bg-(--primary-hover) text-white px-4 py-2 rounded-lg shadow"
        >
          + Create Project
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border border-(--border) bg-(--card)">
        <table className="w-full text-sm">

          {/* HEAD */}
          <thead className="bg-(--bg-secondary) text-(--text-secondary)">
            <tr className="text-left">
              <th className="px-5 py-3">Team Name</th>
              <th className="px-5 py-3">Project Title</th>
              <th className="px-5 py-3">Start Time</th>
              <th className="px-5 py-3 text-center">Action</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {projects.map((project) => (
              <tr
                key={project._id}
                className="border-t border-(--border) hover:bg-(--bg-secondary) transition"
              >
                <td className="px-5 py-3 font-medium">
                  {project.teamName}
                </td>

                <td className="px-5 py-3">
                  {project.projectTitle}
                </td>

                <td className="px-5 py-3 text-(--text-secondary)">
                  {new Date(project.created_time).toLocaleDateString()}
                </td>

                <td className="px-5 py-3 text-center flex gap-2 justify-center">
  
  {/* View Details */}
  <button
    onClick={() =>
      navigate(
        `/developer_dashboard/created_project_details/${project._id}`
      )
    }
    className="px-3 py-1 rounded-lg bg-(--secondary) text-white hover:opacity-90"
  >
    View Details
  </button>

  {/* Delete Project */}
  <button
    onClick={() => handleDelete(project._id)}
    className="px-3 py-1 rounded-lg bg-(--danger) text-white hover:opacity-90"
  >
    Delete
  </button>
<button
  onClick={() => {
    setSelectedProject(project);
    setIsModalOpen(true);
  }}
  className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:opacity-90"
>
  Update
</button>
</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
      {isModalOpen && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg w-[400px]">
      <h2 className="text-xl font-bold mb-4">Update Project</h2>

      <input
        type="text"
        defaultValue={selectedProject?.teamName}
        onChange={(e) =>
          setSelectedProject({
            ...selectedProject,
            teamName: e.target.value,
          })
        }
        className="w-full border p-2 mb-3 rounded"
        placeholder="Team Name"
      />

      <input
        type="text"
        defaultValue={selectedProject?.projectTitle}
        onChange={(e) =>
          setSelectedProject({
            ...selectedProject,
            projectTitle: e.target.value,
          })
        }
        className="w-full border p-2 mb-3 rounded"
        placeholder="Project Title"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-2 bg-gray-400 text-white rounded"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Update
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Created_project;