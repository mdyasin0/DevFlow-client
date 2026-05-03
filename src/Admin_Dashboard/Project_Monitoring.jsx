import React, { useEffect, useState } from "react";

const Project_Monitoring = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedDescription, setSelectedDescription] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProjects(data.data);
        }
      });
  }, []);

  // filter
  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((p) => p.status === filter);

  // count
  const countByStatus = (status) =>
    projects.filter((p) => p.status === status).length;
const handleStatusChange = async (id, status) => {
  try {
    const res = await fetch(
      `http://localhost:5000/projects/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    const data = await res.json();

    if (data.success) {
      // UI update
      setProjects((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, status } : p
        )
      );
    }
  } catch (error) {
    console.log(error);
  }
};
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
      className="px-3 py-1 rounded bg-(--bg-secondary) text-(--text) border border-(--border) hover:opacity-80"
    >
      All
    </button>

    <button
      onClick={() => setFilter("pending")}
      className="px-3 py-1 rounded bg-(--warning) text-white hover:opacity-90"
    >
      Pending
    </button>

    <button
      onClick={() => setFilter("approved")}
      className="px-3 py-1 rounded bg-(--success) text-white hover:opacity-90"
    >
      Approved
    </button>

    <button
      onClick={() => setFilter("rejected")}
      className="px-3 py-1 rounded bg-(--danger) text-white hover:opacity-90"
    >
      Rejected
    </button>

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
          <tr key={p._id} className="border-b border-(--border) hover:bg-(--bg-secondary)">

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

        <p className="text-(--text-secondary)">
          {selectedDescription}
        </p>

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