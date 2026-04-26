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
    return <p className="text-(--text) p-10">Loading...</p>;

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
                  modal.member[modal.type].map((t) => (
                    <div
                      key={t.id}
                      className="bg-(--bg-secondary) p-4 rounded-lg border border-(--border)"
                    >
                      <p className="text-(--text)">{t.text}</p>

                      {/* STATUS CHANGE */}
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs text-(--text-secondary)">
                          Move to:
                        </span>

                        <select
                          className="bg-(--card) border border-(--border) text-(--text) p-1 rounded text-sm"
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

                            fetchProject();
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