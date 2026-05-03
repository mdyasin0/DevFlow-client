import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Firebase/AuthContext";
import { useNavigate } from "react-router";
import Developer_projects from "./Developer_projects";
import { IoCloseCircleOutline } from "react-icons/io5";
import Project_form from "./Project_form";

const Created_project = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
  const [open,setOpen]=useState(false);
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
          description: selectedProject.description,
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
          onClick={() => setOpen(!open)}
          className="bg-(--primary) hover:bg-(--primary-hover) text-white px-4 py-2 rounded-lg shadow"
        >
          + Create Project
        </button>
      </div>
  {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-(--card) text-(--text) p-6 rounded-2xl shadow-xl w-full max-w-md relative border border-(--border)">

            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-red-500 text-2xl"
            >
              <IoCloseCircleOutline />
            </button>

            <Project_form user={user} />
          </div>
        </div>
      )}
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
    <div className="bg-(--card) text-(--text) p-6 rounded-lg w-100 shadow-[0_4px_20px_var(--shadow)] border border-(--border)">
      
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
        className="w-full border border-(--border) bg-(--bg-secondary) text-(--text) p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-(--primary)"
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
        className="w-full border border-(--border) bg-(--bg-secondary) text-(--text) p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-(--primary)"
        placeholder="Project Title"
      />

      <textarea
        defaultValue={selectedProject?.description}
        onChange={(e) =>
          setSelectedProject({
            ...selectedProject,
            description: e.target.value,
          })
        }
        className="w-full border border-(--border) bg-(--bg-secondary) text-(--text) p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-(--primary)"
        placeholder="Project Description"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-2 bg-(--border) text-(--text) rounded hover:bg-(--text-secondary) transition"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-(--primary) text-white rounded hover:bg-(--primary-hover) transition"
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