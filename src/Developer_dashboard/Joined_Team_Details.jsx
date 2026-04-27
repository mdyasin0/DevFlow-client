import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AuthContext } from "../Firebase/AuthContext";

const Joined_Team_Details = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  const { user } = useContext(AuthContext);
  const loginEmail = user?.email;

  const [modal, setModal] = useState({
    open: false,
    member: null,
    type: "",
  });

  const fetchProject = async () => {
    const res = await fetch(`http://localhost:5000/project/${id}`);
    const data = await res.json();

    if (data.success) setProject(data.data);
  };

  const myMember = project?.teammember?.find((m) => m.email === loginEmail);

  useEffect(() => {
    fetchProject();
  }, [id]);

  if (!project) return <p className="text-(--text) p-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-(--bg) text-(--text) p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="bg-(--card) p-4 rounded-xl mb-4 border border-(--border)">
          <h1 className="text-2xl text-(--primary)">{project.teamName}</h1>
          <p>{project.projectTitle}</p>

          <p className="text-(--text-secondary) mt-2">
            👤 Manager: {project.created_by}
          </p>

          <p className="text-(--text-secondary)">
            🕒 Start: {new Date(project.created_time).toLocaleString()}
          </p>

          <p className="text-(--text-secondary) mt-2">
            👥 Members: {project.teammember.length}
          </p>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-(--border)">
            <thead className="bg-(--bg-secondary) text-(--text-secondary)">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Todo</th>
                <th>Running</th>
                <th>Done</th>
              </tr>
            </thead>

            <tbody>
              {myMember && (
                <tr className="border-t border-(--border) text-center hover:bg-(--bg-secondary)">
                  <td>{myMember.name}</td>
                  <td>{myMember.email}</td>

                  {["todo", "running", "done"].map((type) => (
                    <td key={type}>
                      <button
                        className="bg-(--primary) hover:bg-(--primary-hover) text-white px-2 py-1 rounded"
                        onClick={() =>
                          setModal({
                            open: true,
                            member: myMember,
                            type,
                          })
                        }
                      >
                        {myMember[type]?.length || 0}
                      </button>
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {modal.open && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-(--card) mt-20 w-full max-w-xl rounded-xl shadow-2xl border border-(--border)">
              {/* HEADER */}
              <div className="flex justify-between items-center p-4 border-b border-(--border)">
                <h2 className="text-(--primary) font-semibold text-lg">
                  {modal.type.toUpperCase()} TASKS
                </h2>
              </div>

              {/* CONTENT */}
            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
  {modal.member[modal.type].length > 0 ? (
    modal.member[modal.type].map((t) => {
      const priorityColor =
        t.priority === "high"
          ? "bg-red-500/10 text-red-500 border-red-500/30"
          : t.priority === "medium"
          ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
          : "bg-green-500/10 text-green-500 border-green-500/30";

      const isLate =
        t.submittedAt &&
        new Date(t.submittedAt) > new Date(t.deadline);

      return (
        <div
          key={t.id}
          className="bg-(--bg-secondary) p-4 rounded-xl border border-(--border) hover:shadow-md transition"
        >
          {/* TASK TEXT */}
          <p className="text-(--text) font-medium text-lg">
            {t.text}
          </p>

          {/* META */}
          <div className="mt-3 flex flex-wrap items-center gap-2">

            <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              🟢 Start: {new Date(t.createdAt).toLocaleString()}
            </span>

            <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              📅 Deadline: {new Date(t.deadline).toLocaleString()}
            </span>

            {t.submittedAt && (
              <span className="px-2 py-1 text-xs rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                🕒 Done: {new Date(t.submittedAt).toLocaleString()}
              </span>
            )}

            <span
              className={`px-2 py-1 text-xs rounded-full border ${priorityColor}`}
            >
              ⚡ {t.priority}
            </span>

            {t.submittedAt && (
              <span
                className={`px-2 py-1 text-xs rounded-full border ${
                  isLate
                    ? "bg-red-500/10 text-red-500 border-red-500/30"
                    : "bg-green-500/10 text-green-500 border-green-500/30"
                }`}
              >
                {isLate ? "Late ⛔" : "In Time ✅"}
              </span>
            )}
          </div>

          {/* ACTION */}
          <div className="mt-4 flex justify-end">
            {modal.type === "todo" && (
              <button
                onClick={async () => {
                  await fetch(`http://localhost:5000/move-task/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      taskId: t.id,
                      from: "todo",
                      to: "running",
                      email: modal.member.email,
                    }),
                  });

                  fetchProject();
                }}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Move → Running
              </button>
            )}

            {modal.type === "running" && (
              <button
                onClick={async () => {
                  await fetch(`http://localhost:5000/move-task/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      taskId: t.id,
                      from: "running",
                      to: "done",
                      email: modal.member.email,
                    }),
                  });

                  fetchProject();
                }}
                className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Move → Done
              </button>
            )}

            {modal.type === "done" && (
              <span className="text-xs text-gray-400 italic">
                Completed ✓
              </span>
            )}
          </div>
        </div>
      );
    })
  ) : (
    <p className="text-(--text-secondary) text-center">
      No tasks found
    </p>
  )}
</div>

              {/* FOOTER */}
              <div className="p-4 border-t border-(--border) flex justify-end">
                <button
                  onClick={() => setModal({ open: false })}
                  className="bg-(--danger) hover:opacity-90 px-4 py-2 rounded text-sm text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Joined_Team_Details;
