import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
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
const getTotalTasks = (project) => {
  let todo = 0;
  let running = 0;
  let done = 0;

  project?.teammember?.forEach((m) => {
    todo += m.todo?.length || 0;
    running += m.running?.length || 0;
    done += m.done?.length || 0;
  });

  return [
    { name: "Todo", value: todo },
    { name: "Running", value: running },
    { name: "Done", value: done },
  ];
};

const chartData = project ? getTotalTasks(project) : [];

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
    <div className="min-h-screen bg-(--bg-secondary) text-white p-6">
      <div className="max-w-6xl mx-auto bg-(--bg-secondary) p-6 rounded-2xl shadow-xl border border-gray-700">
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
             {/* INVITE */}
      {showInvite && (
  <div className="flex gap-2 mb-6">
    
    <input
      className="flex-1 p-2 rounded bg-(--card) border border-(--border) text-(--text) placeholder:text-(--text-secondary)"
      placeholder="Enter email"
      value={inviteEmail}
      onChange={(e) => setInviteEmail(e.target.value)}
    />

    <button
      onClick={handleInvite}
      className="bg-(--success) hover:opacity-90 text-white px-4 py-2 rounded"
    >
      Send
    </button>

  </div>
)}

        <div className="bg-(--bg-secondary) p-6 rounded-xl border border-gray-700 mb-6">
  <h2 className="text-blue-400 text-lg mb-4">📊 Project Progress</h2>

  <div className="flex justify-center">
    <PieChart width={350} height={300}>
      <Pie
        data={chartData}
        cx="50%"
        cy="50%"
        innerRadius={70}
        outerRadius={110}
        paddingAngle={5}
        dataKey="value"
      >
       <Cell fill="var(--warning)" /> {/* Todo */}
<Cell fill="var(--primary)" /> {/* Running */}
<Cell fill="var(--success)" /> {/* Done */}
      </Pie>

      <Tooltip />
      <Legend />
    </PieChart>
  </div>
</div>
        {/* see alll invite modal */}

      {showAllInvites && (
  <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
    <div className="bg-(--card) p-6 w-175 rounded-xl border border-(--border) text-(--text)">
      
      <h2 className="text-xl text-(--warning) mb-4">All Invites</h2>

      {/* CARDS */}
      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
        
        <div className="bg-(--bg-secondary) p-4 rounded border border-(--border)">
          <p className="text-(--success) text-lg">
            {
              project.invite_email?.filter(
                (i) => i.status === "approved",
              ).length
            }
          </p>
          <p className="text-(--text-secondary) text-sm">Approved</p>
        </div>

        <div className="bg-(--bg-secondary) p-4 rounded border border-(--border)">
          <p className="text-(--warning) text-lg">
            {
              project.invite_email?.filter(
                (i) => i.status === "pending",
              ).length
            }
          </p>
          <p className="text-(--text-secondary) text-sm">Pending</p>
        </div>

        <div className="bg-(--bg-secondary) p-4 rounded border border-(--border)">
          <p className="text-(--danger) text-lg">
            {
              project.invite_email?.filter(
                (i) => i.status === "rejected",
              ).length
            }
          </p>
          <p className="text-(--text-secondary) text-sm">Rejected</p>
        </div>

      </div>

      {/* TABLE */}
      <div className="max-h-75 overflow-y-auto">
        <table className="w-full text-sm border border-(--border)">
          
          <thead className="bg-(--bg-secondary) text-(--text-secondary)">
            <tr>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-center">Status</th>
              <th className="p-2 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {project.invite_email
              ?.filter((i) => i.status !== "approved")
              .map((invite, i) => (
                <tr key={i} className="border-t border-(--border)">
                  
                  <td className="p-2">{invite.email}</td>

                  <td className="text-center">
                    <span
                      className={
                        invite.status === "pending"
                          ? "text-(--warning)"
                          : "text-(--danger)"
                      }
                    >
                      {invite.status}
                    </span>
                  </td>

                  <td className="text-right p-2">
                    <button
                      onClick={() => handleRemoveInvite(invite.email)}
                      className="bg-(--danger) px-2 py-1 rounded text-xs text-white"
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
        className="mt-4 bg-(--danger) px-4 py-2 rounded text-white"
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
      className="flex-1 p-2 rounded bg-(--card) border border-(--border) text-(--text) placeholder:text-(--text-secondary)"
      placeholder="Enter email"
      value={inviteEmail}
      onChange={(e) => setInviteEmail(e.target.value)}
    />

    <button
      onClick={handleInvite}
      className="bg-(--success) hover:opacity-90 text-white px-4 py-2 rounded"
    >
      Send
    </button>

  </div>
)}

  
    {/* TABLE */}
<div className="overflow-x-auto">
  <table className="w-full text-sm border border-(--border)">

    {/* HEADER */}
    <thead className="bg-(--bg-secondary) text-(--text)">
      <tr>
        <th className="p-3 text-left">Name</th>
        <th className="p-3 text-left">Email</th>

        <th className="p-3 text-center" colSpan={3}>
          Tasks
        </th>

        <th className="p-3 text-right">Action</th>
      </tr>

      <tr className="bg-(--bg) text-(--text-secondary) text-xs">
        <th></th>
        <th></th>
        <th className="p-2 text-center">Todo</th>
        <th className="p-2 text-center">Running</th>
        <th className="p-2 text-center">Done</th>
        <th></th>
      </tr>
    </thead>

    {/* BODY */}
    <tbody>
      {project.teammember.map((m, i) => (
        <tr
          key={i}
          className="border-t border-(--border) text-(--text)"
        >

          <td className="p-3">{m.name}</td>
          <td className="p-3 text-(--text-secondary)">{m.email}</td>

          {/* TASK COUNTS */}
          {["todo", "running", "done"].map((type) => (
            <td key={type} className="text-center">
              <button
                onClick={() =>
                  setTaskModal({
                    open: true,
                    type,
                    member: m,
                  })
                }
                className="bg-(--primary) hover:bg-(--primary-hover) text-white px-3 py-1 rounded w-12"
              >
                {m[type]?.length || 0}
              </button>
            </td>
          ))}

          {/* ACTION */}
          <td className="text-right p-3 space-x-2">
            <button
              onClick={() => setActiveMember(m.email)}
              className="bg-(--secondary) text-white px-3 py-1 rounded"
            >
              Assign
            </button>

            <button
              onClick={() => handleRemoveMember(m.email)}
              className="bg-(--danger) text-white px-3 py-1 rounded"
            >
              Remove
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
    <div className="bg-(--card) text-(--text) p-5 w-130 rounded border border-(--border)">

      <h2 className="mb-3 text-(--primary)">
        {taskModal.type.toUpperCase()} TASKS
      </h2>

      {project?.teammember?.find(
        (m) => m.email === taskModal.member?.email,
      )?.[taskModal.type]?.length ? (
        project.teammember
          .find((m) => m.email === taskModal.member?.email)
          [taskModal.type].map((t) => (
            <div
              key={t.id}
              className="bg-(--bg-secondary) p-3 mb-2 rounded border border-(--border)"
            >
              <p
                className="text-(--text)"
                dangerouslySetInnerHTML={{ __html: t.text }}
              />

              <div className="text-xs text-(--text-secondary) mt-1">
                🕒 {t.createdAt}
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() =>
                    startEdit(t, taskModal.type, taskModal.member)
                  }
                  className="text-(--primary)"
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
                  className="text-(--danger)"
                >
                  🗑
                </button>
              </div>
            </div>
          ))
      ) : (
        <p className="text-(--text-secondary)">No tasks</p>
      )}

      <button
        onClick={() => setTaskModal({ open: false })}
        className="mt-3 bg-(--danger) text-white px-3 py-1 rounded"
      >
        Close
      </button>
    </div>
  </div>
)}

        {/* EDIT MODAL */}
        {editData && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
    <div className="bg-(--card) p-5 w-100 rounded border border-(--border) shadow-lg">

      <textarea
        className="w-full p-2 bg-(--bg-secondary) text-(--text) border border-(--border) rounded"
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
      />

      <div className="flex gap-2 mt-3">

        <button
          onClick={handleUpdate}
          className="bg-(--success) text-white px-3 py-1 rounded"
        >
          Save
        </button>

        <button
          onClick={() => setEditData(null)}
          className="bg-(--danger) text-white px-3 py-1 rounded"
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
    <div className="bg-(--card) p-5 w-105 rounded border border-(--border)">
      
      <textarea
        className="w-full p-2 bg-(--bg-secondary) text-(--text) border border-(--border)"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
      />

      <div className="flex gap-2 mt-3">
        
        <button
          onClick={handleTaskSave}
          className="px-3 py-1 rounded text-white bg-(--success)"
        >
          Save
        </button>

        <button
          onClick={() => setActiveMember(null)}
          className="px-3 py-1 rounded text-white bg-(--danger)"
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
