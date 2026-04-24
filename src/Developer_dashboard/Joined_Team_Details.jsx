import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { AuthContext } from '../Firebase/AuthContext';

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
const myMember = project?.teammember?.find(
  (m) => m.email === loginEmail
);
  useEffect(() => {
    fetchProject();
  }, [id]);

  if (!project)
    return <p className="text-white p-10">Loading...</p>;
    return (
           <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="bg-gray-900 p-4 rounded-xl mb-4">
          <h1 className="text-2xl text-blue-400">{project.teamName}</h1>
          <p>{project.projectTitle}</p>

          <p className="text-gray-400 mt-2">
            👤 Manager: {project.created_by}
          </p>

          <p className="text-gray-400">
            🕒 Start: {new Date(project.created_time).toLocaleString()}
          </p>

          <p className="text-gray-400 mt-2">
            👥 Members: {project.teammember.length}
          </p>

          
        </div>

       
        {/* TABLE */}
<div className="overflow-x-auto">
  <table className="w-full text-sm border border-gray-700">

    <thead className="bg-gray-800">
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
        <tr className="border-t border-gray-700 text-center">

          <td>{myMember.name}</td>
          <td>{myMember.email}</td>

          {["todo", "running", "done"].map((type) => (
            <td key={type}>
              <button
                className="bg-blue-600 px-2 py-1 rounded"
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
  <div className="fixed inset-0  bg-black/70 flex items-center justify-center p-4">
    
    {/* MODAL BOX */}
    <div className="bg-gray-900 mt-20 w-full max-w-xl rounded-xl shadow-2xl border border-gray-700">

      {/* HEADER */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-blue-400 font-semibold text-lg">
          {modal.type.toUpperCase()} TASKS
        </h2>

        
      </div>

      {/* CONTENT (SCROLL AREA) */}
      <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">

        {modal.member[modal.type].length > 0 ? (
          modal.member[modal.type].map((t) => (
            <div
              key={t.id}
              className="bg-gray-800 p-4 rounded-lg border border-gray-700"
            >
              <p className="text-gray-200">{t.text}</p>

              {/* STATUS CHANGE */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-gray-400">Move to:</span>


<select
  className="bg-gray-700 text-white p-1 rounded text-sm"
  value={modal.type}
  onChange={async (e) => {
    const to = e.target.value;

    const payload = {
      taskId: t.id,
      from: modal.type,
      to,
      email: modal.member.email,
    };

    await fetch(`http://localhost:5000/move-task/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    fetchProject(); // refresh UI
  }}
>
  <option value="todo">todo</option>
  <option value="running">running</option>
  <option value="done">done</option>
</select>
            
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No tasks found</p>
        )}
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-gray-700 flex justify-end">
        <button
          onClick={() => setModal({ open: false })}
          className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded text-sm"
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