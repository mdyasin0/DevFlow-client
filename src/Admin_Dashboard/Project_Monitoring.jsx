import React, { useContext, useEffect, useState } from "react";
import { socket } from "../Socket";
import { AuthContext } from "../Firebase/AuthContext";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const Project_Monitoring = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedDescription, setSelectedDescription] = useState(null);
  const { logOut, user } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:5000/projects", {
      credentials: "include",
    })
      .then(async (res) => {
        //  1. AUTH সমস্যা → logout
        if (res.status === 401) {
          toast.error("Session expired. Please login again");
          await logOut();
          navigate("/login");
          return;
        }

        const data = await res.json();

        // 2. BLOCKED USER
        if (data?.isBlocked) {
          toast.error("You are blocked by admin");
          await logOut();
          navigate("/login");
          return;
        }

        return data;
      })
      .then((data) => {
        if (data && data.success) {
          setProjects(data.data);
        }
      });
  }, [logOut]);

  // filter

  // count
  const countByStatus = (status) =>
    projects.filter((p) => p.status === status).length;
  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/projects/${id}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          updatedBy: user.email,
        }),
      });
      //  1. AUTH সমস্যা → logout
      if (res.status === 401) {
        toast.error("Session expired. Please login again");
        await logOut();
        navigate("/login", { replace: true });
        return;
      }

      const data = await res.json();

      //  2. BLOCKED USER
      if (data?.isBlocked) {
        toast.error("You are blocked by admin");
        await logOut();
        navigate("/login", { replace: true });
        return;
      }

      if (data.success) {
        // UI update
        setProjects((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status } : p)),
        );
      }
    } catch (error) {
      toast.error(error);
    }
  };
  useEffect(() => {
    socket.on("newProject", (newProject) => {
      setProjects((prev) => [newProject, ...prev]);
    });

    return () => {
      socket.off("newProject");
    };
  }, []);
  useEffect(() => {
    const handleDelete = (data) => {
      setProjects((prev) => prev.filter((p) => p._id !== data.projectId));
    };

    socket.on("projectDeleted", handleDelete);

    return () => {
      socket.off("projectDeleted", handleDelete);
    };
  }, []);
  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/users/${user.email}`, {
        credentials: "include",
      })
        .then(async (res) => {
          //  1. AUTH সমস্যা → logout
          if (res.status === 401) {
            toast.error("Session expired. Please login again");
            await logOut();
           navigate("/login");
            return;
          }

          //  আগে JSON parse করো
          const data = await res.json();

          //  2. BLOCKED USER
          if (data?.isBlocked) {
            toast.error("You are blocked by admin");
            await logOut();
            navigate("/login");
            return;
          }

          return data;
        })
        .then((data) => {
          if (data?.success) {
            socket.emit("join", data.data._id);
          }
        });
    }
  }, [user?.email, logOut]);
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {});

    return () => {
      socket.disconnect();
    };
  }, []);
  const filteredProjects = projects
    // 1. Button filter (status)
    .filter((p) => (filter === "all" ? true : p.status === filter))

    //  2. Search filter (team বা title)
    .filter(
      (p) =>
        p.teamName.toLowerCase().includes(search.toLowerCase()) ||
        p.projectTitle.toLowerCase().includes(search.toLowerCase()),
    );
  return (
    <div className="p-6 min-h-screen bg-(--bg) text-(--text)">
      {/* ===== CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded shadow bg-(--card) text-center border border-(--border)">
          <h3 className="text-(--text-secondary)">Pending</h3>
          <p className="text-xl font-bold text-(--warning)">
            {countByStatus("pending")}
          </p>
        </div>

        <div className="p-4 rounded shadow bg-(--card) text-center border border-(--border)">
          <h3 className="text-(--text-secondary)">Approved</h3>
          <p className="text-xl font-bold text-(--success)">
            {countByStatus("approved")}
          </p>
        </div>

        <div className="p-4 rounded shadow bg-(--card) text-center border border-(--border)">
          <h3 className="text-(--text-secondary)">Rejected</h3>
          <p className="text-xl font-bold text-(--danger)">
            {countByStatus("rejected")}
          </p>
        </div>
      </div>

      {/* ===== FILTER ===== */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded border transition
      ${
        filter === "all"
          ? "bg-(--primary) text-white border-(--primary)"
          : "bg-(--bg-secondary) text-(--text) border-(--border) hover:opacity-80"
      }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("pending")}
          className={`px-3 py-1 rounded border transition
      ${
        filter === "pending"
          ? "bg-(--warning) text-white border-(--warning)"
          : "bg-(--bg-secondary) text-(--text) border-(--border) hover:opacity-80"
      }`}
        >
          Pending
        </button>

        <button
          onClick={() => setFilter("approved")}
          className={`px-3 py-1 rounded border transition
      ${
        filter === "approved"
          ? "bg-(--success) text-white border-(--success)"
          : "bg-(--bg-secondary) text-(--text) border-(--border) hover:opacity-80"
      }`}
        >
          Approved
        </button>

        <button
          onClick={() => setFilter("rejected")}
          className={`px-3 py-1 rounded border transition
      ${
        filter === "rejected"
          ? "bg-(--danger) text-white border-(--danger)"
          : "bg-(--bg-secondary) text-(--text) border-(--border) hover:opacity-80"
      }`}
        >
          Rejected
        </button>
      </div>
      {/* ===== SEARCH ===== */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by team or project name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-3 py-2 rounded border border-(--border) bg-(--bg) text-(--text) focus:outline-none"
        />
      </div>
      {/* ===== TABLE ===== */}
      <div className="overflow-x-auto">
        <table className="w-full rounded shadow bg-(--card) border border-(--border)">
          <thead>
            <tr className="text-left border-b border-(--border) bg-(--bg-secondary)">
              <th className="p-3">Team</th>
              <th className="p-3">Title</th>
              <th className="p-3">Description</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredProjects.map((p) => (
              <tr
                key={p._id}
                className="border-b border-(--border) hover:bg-(--bg-secondary)"
              >
                {/* Team */}
                <td className="p-3">{p.teamName}</td>

                {/* Title */}
                <td className="p-3">{p.projectTitle}</td>

                {/* Description */}
                <td className="p-3">
                  <button
                    onClick={() => setSelectedDescription(p.description)}
                    className="text-(--primary) hover:underline"
                  >
                    View
                  </button>
                </td>

                {/* Status Badge */}
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs text-white
                  ${
                    p.status === "pending"
                      ? "bg-(--warning)"
                      : p.status === "approved"
                        ? "bg-(--success)"
                        : "bg-(--danger)"
                  }`}
                  >
                    {p.status}
                  </span>
                </td>

                {/* Action */}
                <td className="p-3">
                  <select
                    onChange={(e) => handleStatusChange(p._id, e.target.value)}
                    className="px-2 py-1 rounded bg-(--bg) border border-(--border) text-(--text)"
                  >
                    <option value="">Select</option>
                    <option value="approved">Approve</option>
                    <option value="rejected">Reject</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== DESCRIPTION MODAL ===== */}
      {selectedDescription && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-(--card) p-6 rounded w-100 shadow border border-(--border)">
            <h2 className="text-lg font-bold mb-3">Description</h2>

            <p className="text-(--text-secondary)">{selectedDescription}</p>

            <button
              onClick={() => setSelectedDescription(null)}
              className="mt-4 bg-(--danger) text-white px-4 py-2 rounded hover:opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project_Monitoring;
