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
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* ===== CARDS ===== */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-gray-500">Pending</h3>
          <p className="text-xl font-bold text-yellow-500">
            {countByStatus("pending")}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-gray-500">Approved</h3>
          <p className="text-xl font-bold text-green-500">
            {countByStatus("approved")}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-gray-500">Rejected</h3>
          <p className="text-xl font-bold text-red-500">
            {countByStatus("rejected")}
          </p>
        </div>
      </div>

      {/* ===== FILTER ===== */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          All
        </button>

        <button
          onClick={() => setFilter("pending")}
          className="px-3 py-1 bg-yellow-400 text-white rounded"
        >
          Pending
        </button>

        <button
          onClick={() => setFilter("approved")}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          Approved
        </button>

        <button
          onClick={() => setFilter("rejected")}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Rejected
        </button>
      </div>

      {/* ===== TABLE ===== */}
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="text-left border-b bg-gray-100">
            <th className="p-3">Team</th>
            <th className="p-3">Title</th>
            <th className="p-3">Description</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredProjects.map((p) => (
            <tr key={p._id} className="border-b hover:bg-gray-50">

              {/* Team */}
              <td className="p-3">{p.teamName}</td>

              {/* Title */}
              <td className="p-3">{p.projectTitle}</td>

              {/* Description */}
              <td className="p-3">
                <button
                  onClick={() => setSelectedDescription(p.description)}
                  className="text-blue-500 underline"
                >
                  View
                </button>
              </td>

              {/* Status Badge */}
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-white text-xs ${
                    p.status === "pending"
                      ? "bg-yellow-500"
                      : p.status === "approved"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {p.status}
                </span>
              </td>

              {/* Action (UI Only) */}
              <td className="p-3">
            <select
  onChange={(e) =>
    handleStatusChange(p._id, e.target.value)
  }
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

      {/* ===== DESCRIPTION MODAL ===== */}
      {selectedDescription && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[400px] shadow-lg">
            <h2 className="text-lg font-bold mb-3">Description</h2>

            <p className="text-gray-700">{selectedDescription}</p>

            <button
              onClick={() => setSelectedDescription(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
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