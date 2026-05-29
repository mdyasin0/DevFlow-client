import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Firebase/AuthContext";
import { useNavigate } from "react-router";
import Developer_projects from "./Developer_projects";
import { IoCloseCircleOutline } from "react-icons/io5";
import Project_form from "./Project_form";
import { socket } from "../Socket";

const Created_project = () => {
  const { user, logOut } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/projects/${selectedProject._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            teamName: selectedProject.teamName,
            projectTitle: selectedProject.projectTitle,
            description: selectedProject.description,
          }),
        },
      );
      // ✅ 1. AUTH সমস্যা → logout
      if (res.status === 401) {
        alert("Session expired. Please login again");
        await logOut();
        window.location.href = "/login";
        return;
      }
      const data = await res.json();

      // ✅ 2. BLOCKED USER
      if (data?.isBlocked) {
        alert("You are blocked by admin");
        await logOut();
        window.location.href = "/login";
        return;
      }

      if (data.success) {
        setProjects((prev) =>
          prev.map((p) =>
            p._id === selectedProject._id ? selectedProject : p,
          ),
        );

        alert("Project updated successfully ");
        setIsModalOpen(false);
      }
    } catch (error) {
      alert(error);
    }
  };
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "If you delete this project, everything related to it will be permanently deleted and cannot be recovered. Are you sure?",
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/projects/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      // ✅ 1. AUTH সমস্যা → logout
      if (res.status === 401) {
        alert("Session expired. Please login again");
        await logOut();
        window.location.href = "/login";
        return;
      }
      const data = await res.json();
      // ✅ 2. BLOCKED USER
      if (data?.isBlocked) {
        alert("You are blocked by admin");
        await logOut();
        window.location.href = "/login";
        return;
      }
      // ❌ FREE USER (ANY 403 reason)
      if (data.code === "Project only premium user can delete") {
        alert(data.message);
        return;
      }
      if (data.success) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
        alert("Project deleted successfully ");
      }
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/projects/${user.email}`, {
        credentials: "include",
      })
        .then(async (res) => {
          // ✅ 1. AUTH সমস্যা → logout
          if (res.status === 401) {
            alert("Session expired. Please login again");
            await logOut();
            window.location.href = "/login";
            return;
          }

          const data = await res.json(); // 👈 আগে data নিতে হবে

          // ✅ 2. BLOCKED USER
          if (data?.isBlocked) {
            alert("You are blocked by admin");
            await logOut();
            window.location.href = "/login";
            return;
          }

          return data;
        })
        .then((data) => {
          if (data?.success) {
            setProjects(data.data);
          } else {
            setProjects([]);
          }
        })
        .catch(() => setProjects([]));
    }
  }, [user, logOut]);

  useEffect(() => {
    if (!user?._id) return;

    socket.connect(); // IMPORTANT

    socket.emit("join", user._id.toString());

    return () => {
      socket.disconnect();
    };
  }, [user]);
  useEffect(() => {
    const handler = async (data) => {
      // ✅ 1. BLOCKED USER আগে check করো
      if (data?.isBlocked) {
        alert("You are blocked by admin");
        await logOut();
        window.location.href = "/login";
        return;
      }

      // ✅ 2. তারপর API call
      const res = await fetch(`http://localhost:5000/projects/${user.email}`, {
        credentials: "include",
      });

      // ✅ 1. AUTH সমস্যা → logout
      if (res.status === 401) {
        alert("Session expired. Please login again");
        await logOut();
        window.location.href = "/login";
        return;
      }

      const result = await res.json();

      if (result.success) {
        setProjects(result.data);
      }
    };

    socket.on("project_status_updated", handler);

    return () => socket.off("project_status_updated", handler);
  }, [user, logOut]);
  const hasProjects = projects.length > 0;

  if (!user?.email) return null;

  if (!hasProjects) {
    return <Developer_projects />;
  }
  const filteredProjects = projects.filter(
    (project) =>
      project.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
    <div className="bg-(--bg) text-(--text) min-h-full p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
          My Projects
        </h2>

        <button
          onClick={() => setOpen(!open)}
          className="bg-(--primary) hover:bg-(--primary-hover) text-white px-4 py-2 rounded-lg shadow w-full sm:w-auto"
        >
          + Create Project
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by team name or project title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-2/3 md:w-1/2 px-4 py-2 rounded-lg border border-(--border) bg-(--card) text-(--text)"
        />
      </div>

      {/* CREATE MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-3">
          <div className="bg-(--card) text-(--text) p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-md relative border border-(--border)">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-red-500 text-2xl"
            >
              <IoCloseCircleOutline />
            </button>

            <Project_form user={user}  setform={setOpen} />
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border border-(--border) bg-(--card)">
        <table className="w-full text-xs sm:text-sm">
          {/* HEAD */}
          <thead className="bg-(--bg-secondary) text-(--text-secondary)">
            <tr className="text-left">
              <th className="px-3 sm:px-5 py-2 sm:py-3">Team Name</th>
              <th className="px-3 sm:px-5 py-2 sm:py-3">Project Title</th>
              <th className="px-3 sm:px-5 py-2 sm:py-3">Start Time</th>
              <th className="px-3 sm:px-5 py-2 sm:py-3 text-center">Action</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {filteredProjects.map((project) => (
              <tr
                key={project._id}
                className="border-t border-(--border) hover:bg-(--bg-secondary) transition"
              >
                <td className="px-3 sm:px-5 py-2 sm:py-3 font-medium">
                  {project.teamName}
                </td>

                <td className="px-3 sm:px-5 py-2 sm:py-3">
                  {project.projectTitle}
                </td>

                <td className="px-3 sm:px-5 py-2 sm:py-3 text-(--text-secondary)">
                  {new Date(project.created_time).toLocaleDateString()}
                </td>

                <td className="px-3 sm:px-5 py-2 sm:py-3">
                  <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                    {/* View */}
                    <button
                      onClick={() =>
                        navigate(
                          `/developer_dashboard/created_project_details/${project._id}`,
                        )
                      }
                      className="w-full sm:w-auto px-3 py-1 rounded-lg bg-(--secondary) text-white hover:opacity-90 text-xs sm:text-sm"
                    >
                      View
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="w-full sm:w-auto px-3 py-1 rounded-lg bg-(--danger) text-white hover:opacity-90 text-xs sm:text-sm"
                    >
                      Delete
                    </button>

                    {/* Update */}
                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        setIsModalOpen(true);
                      }}
                      className="w-full sm:w-auto px-3 py-1 rounded-lg bg-blue-500 text-white hover:opacity-90 text-xs sm:text-sm"
                    >
                      Update
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* UPDATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-3">
          <div className="bg-(--card) text-(--text) p-4 sm:p-6 rounded-lg w-full max-w-md shadow-[0_4px_20px_var(--shadow)] border border-(--border)">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-center sm:text-left">
              Update Project
            </h2>

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

            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 bg-(--border) text-(--text) rounded hover:bg-(--text-secondary) transition"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="w-full sm:w-auto px-4 py-2 bg-(--primary) text-white rounded hover:bg-(--primary-hover) transition"
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
