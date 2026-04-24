import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

const Created_project_details = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [showAllInvites, setShowAllInvites] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const [activeMember, setActiveMember] = useState(null);
  const [taskText, setTaskText] = useState("");

  const [taskModal, setTaskModal] = useState({
    open: false,
    type: "",
    member: null,
  });

  const [editData, setEditData] = useState(null);
  const [editText, setEditText] = useState("");

  // ✅ FETCH PROJECT (reuseable)
  const fetchProject = async () => {
    const res = await fetch(`http://localhost:5000/project/${id}`);
    const data = await res.json();
    if (data.success) setProject(data.data);
  };

  useEffect(() => {
    fetchProject();
  }, [id]);
  // INVITE
  const handleInvite = async () => {
    const res = await fetch(`http://localhost:5000/invite/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail }),
    });

    const data = await res.json();
    if (data.success) {
      setInviteEmail("");
      setShowInvite(false);
      fetchProject(); // ✅ UI update
    }
  };

  // ADD TASK
  const handleTaskSave = async () => {
    const res = await fetch(`http://localhost:5000/add-task/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: activeMember,
        text: taskText,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setTaskText("");
      setActiveMember(null);
      fetchProject(); // ✅ UI update
    }
  };

  // DELETE TASK
  const handleDelete = async (type, taskId, email) => {
    await fetch(`http://localhost:5000/delete-task/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        type,
        taskId,
      }),
    });

    fetchProject(); // ✅ UI update
  };

  // EDIT START
  const startEdit = (task, type, member) => {
    setEditData({ task, type, member });
    setEditText(task.text.replace(/<br\/>/g, "\n"));
  };
  // remove member
  const handleRemoveMember = async (email) => {
  await fetch(
    `http://localhost:5000/remove-member/${id}/${encodeURIComponent(email)}`,
    {
      method: "DELETE",
    }
  );

  fetchProject(); // UI refresh
};
  // remove invite
  const handleRemoveInvite = async (email) => {
    await fetch(
      `http://localhost:5000/remove-invite/${id}/${encodeURIComponent(email)}`,
      {
        method: "DELETE",
      },
    );

    fetchProject();
  };

  // UPDATE TASK
  const handleUpdate = async () => {
    await fetch(`http://localhost:5000/update-task/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: editData.member.email,
        type: editData.type,
        taskId: editData.task.id,
        text: editText,
      }),
    });

    setEditData(null);
    fetchProject(); // ✅ UI update
  };

  if (!project)
    return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-700">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-blue-400">
              {project.teamName}
            </h1>
            <p className="text-gray-300">{project.projectTitle}</p>

            <div className="mt-2 text-sm text-gray-400 space-y-1">
              <p>👤 Manager: {project.created_by}</p>
              <p>🕒 Start: {new Date(project.created_time).toLocaleString()}</p>
              <p>👥 Total Members: {project.teammember.length}</p>
            </div>
          </div>

          <button
            onClick={() => setShowInvite(!showInvite)}
            className="bg-blue-600 px-4 py-2 rounded-lg"
          >
            Invite Member
          </button>
          <button
            onClick={async () => {
              await fetchProject();
              setShowAllInvites(true);
            }}
            className="bg-yellow-600 px-4 py-2 rounded-lg ml-2"
          >
            See All Invite
          </button>
        </div>
        {/* see alll invite modal */}

        {showAllInvites && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
            <div className="bg-gray-900 p-6 w-175 rounded-xl">
              <h2 className="text-xl text-yellow-400 mb-4">All Invites</h2>

              {/* CARDS */}
              <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div className="bg-gray-800 p-4 rounded">
                  <p className="text-green-400 text-lg">
                    {
                      project.invite_email?.filter(
                        (i) => i.status === "approved",
                      ).length
                    }
                  </p>
                  <p className="text-gray-400 text-sm">Approved</p>
                </div>

                <div className="bg-gray-800 p-4 rounded">
                  <p className="text-yellow-400 text-lg">
                    {
                      project.invite_email?.filter(
                        (i) => i.status === "pending",
                      ).length
                    }
                  </p>
                  <p className="text-gray-400 text-sm">Pending</p>
                </div>

                <div className="bg-gray-800 p-4 rounded">
                  <p className="text-red-400 text-lg">
                    {
                      project.invite_email?.filter(
                        (i) => i.status === "rejected",
                      ).length
                    }
                  </p>
                  <p className="text-gray-400 text-sm">Rejected</p>
                </div>
              </div>

              {/* TABLE */}
              <div className="max-h-75 overflow-y-auto">
                <table className="w-full text-sm border border-gray-700">
                  <thead className="bg-gray-800 text-gray-300">
                    <tr>
                      <th className="p-2 text-left">Email</th>
                      <th className="p-2 text-center">Status</th>
                      <th className="p-2 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {project.invite_email
                      ?.filter((i) => i.status !== "approved") // ❗ approved বাদ
                      .map((invite, i) => (
                        <tr key={i} className="border-t border-gray-700">
                          <td className="p-2">{invite.email}</td>

                          <td className="text-center">
                            <span
                              className={
                                invite.status === "pending"
                                  ? "text-yellow-400"
                                  : "text-red-400"
                              }
                            >
                              {invite.status}
                            </span>
                          </td>

                          <td className="text-right p-2">
                            <button
                              onClick={() => handleRemoveInvite(invite.email)}
                              className="bg-red-600 px-2 py-1 rounded text-xs"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={() => setShowAllInvites(false)}
                className="mt-4 bg-red-600 px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
        {/* INVITE */}
        {showInvite && (
          <div className="flex gap-2 mb-6">
            <input
              className="flex-1 p-2 rounded bg-gray-800 border border-gray-600 text-white"
              placeholder="Enter email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <button
              onClick={handleInvite}
              className="bg-green-600 px-4 py-2 rounded"
            >
              Send
            </button>
          </div>
        )}

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-700">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-center">Tasks</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {project.teammember.map((m, i) => (
                <tr key={i} className="border-t border-gray-700">
                  <td className="p-3">{m.name}</td>
                  <td className="p-3">{m.email}</td>

                  <td className="text-center space-x-2">
                    {["todo", "running", "done"].map((type) => (
                      <button
                        key={type}
                        onClick={() =>
                          setTaskModal({
                            open: true,
                            type,
                            member: m,
                          })
                        }
                        className="bg-gray-700 px-2 py-1 rounded"
                      >
                        {type}
                      </button>
                    ))}
                  </td>

                  <td className="text-right p-3">
                    <button
                      onClick={() => setActiveMember(m.email)}
                      className="bg-purple-600 px-3 py-1 rounded"
                    >
                      Work Assign
                    </button>
                    <button
  onClick={() => handleRemoveMember(m.email)}
  className="bg-red-700 px-3 py-1 rounded"
>
  Remove Member
</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TASK MODAL */}
        {taskModal.open && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
            <div className="bg-gray-900 p-5 w-130 rounded">
              <h2 className="mb-3 text-blue-400">
                {taskModal.type.toUpperCase()} TASKS
              </h2>

              {project?.teammember?.find(
                (m) => m.email === taskModal.member?.email,
              )?.[taskModal.type]?.length ? (
                project.teammember
                  .find((m) => m.email === taskModal.member?.email)
                  [taskModal.type].map((t) => (
                    <div key={t.id} className="bg-gray-800 p-3 mb-2 rounded">
                      <p dangerouslySetInnerHTML={{ __html: t.text }} />

                      <div className="text-xs text-gray-400 mt-1">
                        🕒 {t.createdAt}
                      </div>

                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={() =>
                            startEdit(t, taskModal.type, taskModal.member)
                          }
                          className="text-blue-400"
                        >
                          ✏️
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              taskModal.type,
                              t.id,
                              taskModal.member.email,
                            )
                          }
                          className="text-red-400"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-gray-400">No tasks</p>
              )}

              <button
                onClick={() => setTaskModal({ open: false })}
                className="mt-3 bg-red-600 px-3"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {editData && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
            <div className="bg-gray-900 p-5 w-100 rounded">
              <textarea
                className="w-full p-2 bg-gray-800 text-white"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />

              <div className="flex gap-2 mt-3">
                <button onClick={handleUpdate} className="bg-green-600 px-3">
                  Save
                </button>

                <button
                  onClick={() => setEditData(null)}
                  className="bg-red-600 px-3"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ASSIGN MODAL */}
        {activeMember && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
            <div className="bg-gray-900 p-5 w-105 rounded">
              <textarea
                className="w-full p-2 bg-gray-800 text-white"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
              />

              <div className="flex gap-2 mt-3">
                <button onClick={handleTaskSave} className="bg-green-600 px-3">
                  Save
                </button>

                <button
                  onClick={() => setActiveMember(null)}
                  className="bg-red-600 px-3"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Created_project_details;
