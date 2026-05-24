import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AuthContext } from "../Firebase/AuthContext";
import { socket } from "../Socket";
import { FcManager } from "react-icons/fc";
import { GoStopwatch } from "react-icons/go";
import { IoIosPeople } from "react-icons/io";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import ProjectDiscussion from "./ProjectDiscussion";

const Joined_Team_Details = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const { user, logOut } = useContext(AuthContext);
  const loginEmail = user?.email;
  
  const liveMember = project?.teammember?.find((m) => m.email === loginEmail);
  const [modal, setModal] = useState({
    open: false,
    member: null,
    type: "",
  });

  const fetchProject = async () => {
    const res = await fetch(`http://localhost:5000/project/${id}`, {
      credentials: "include",
    });
    if (res.status === 401 || res.status === 403) {
      alert("Session expired. Please login again");
      await logOut();
      window.location.href = "/login";
      return;
    }
    const data = await res.json();

    if (data.success) setProject(data.data);
  };

  const myMember = project?.teammember?.find((m) => m.email === loginEmail);
  const isFreeManager = project?.manager?.plan?.type === "free";
  useEffect(() => {
    if (id) {
      socket.emit("joinProject", id);
    }
  }, [id]);
  useEffect(() => {
    if (!id) return;

    socket.emit("joinProject", id);

    const handleUpdate = () => {
      fetchProject(); // always fresh data
    };

    socket.on("projectUpdated", handleUpdate);

    return () => {
      socket.off("projectUpdated", handleUpdate);
    };
  }, [id]);
  useEffect(() => {
    fetchProject();
  }, [id, fetchProject]);
 
  if (!project)
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );

  return (
    <div className="min-h-screen bg-(--bg) text-(--text) p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="bg-(--card) p-4 rounded-xl mb-4 border border-(--border)">
          <h1 className="text-2xl text-(--primary)">{project.teamName}</h1>
          <p>{project.projectTitle}</p>

          <p className="text-(--text-secondary) flex items-center gap-1  mt-2">
            <FcManager /> Manager: {project.created_by}
          </p>

          <p className="text-(--text-secondary) flex items-center gap-1 ">
            <GoStopwatch /> Start:{" "}
            {new Date(project.created_time).toLocaleString()}
          </p>

          <p className="text-(--text-secondary) flex items-center gap-1  mt-2">
            <IoIosPeople /> Members: {project.teammember.length}
          </p>
                  <button
  onClick={() => {
    if (isFreeManager) {
      alert(" say manager to Upgrade plan to use project discussion chat 🚀");
      return;
    }
    setShowChat(true);
  }}
  className="bg-green-600 px-4 py-2 rounded-lg ml-2"
>
  Discuss on Project
</button>
         
          {showChat && isFreeManager ? (
  <div className="p-4 bg-red-100 text-red-600 rounded">
    say manager to Upgrade plan to use project discussion cha
  </div>
) : (
showChat && (
            <ProjectDiscussion
              projectId={project._id}
              onClose={() => setShowChat(false)}
            />
  )
)}
    
      
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
              <div className="p-4 max-h-[60vh] max-w-xl overflow-y-auto space-y-3">
                {modal.member?.[modal.type]?.length > 0 ? (
                  liveMember?.[modal.type]?.map((t) => {
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
                        {/* ATTACHMENTS */}
                        {t.attachments?.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-sm text-(--text-secondary)">
                              Attachments:
                            </p>

                            {t.attachments.map((file, index) => {
                              const isImage = file.type.startsWith("image");
                              const isVideo = file.type.startsWith("video");
                              const isAudio = file.type.startsWith("audio");

                              return (
                                <div
                                  key={index}
                                  className="border p-2 rounded bg-(--bg)"
                                >
                                  {/* IMAGE */}
                                  {isImage && (
                                    <img
                                      src={file.url}
                                      alt={file.name}
                                      className="w-40 rounded mb-2"
                                    />
                                  )}

                                  {/* VIDEO */}
                                  {isVideo && (
                                    <video controls className="w-48 mb-2">
                                      <source src={file.url} />
                                    </video>
                                  )}

                                  {/* AUDIO */}
                                  {isAudio && (
                                    <audio controls className="mb-2">
                                      <source src={file.url} />
                                    </audio>
                                  )}

                                  {/* FILE NAME + DOWNLOAD */}
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs">{file.name}</span>

                                    <a
                                      href={`${file.url}?fl_attachment=true`}
                                      target="_blank"
                                      className="text-blue-400 text-xs underline"
                                    >
                                      Download
                                    </a>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {/* META */}
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            Start: {new Date(t.createdAt).toLocaleString()}
                          </span>

                          <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            Deadline: {new Date(t.deadline).toLocaleString()}
                          </span>

                          {t.submittedAt && (
                            <span className="px-2 py-1 text-xs rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                              Done: {new Date(t.submittedAt).toLocaleString()}
                            </span>
                          )}

                          <span
                            className={`px-2 py-1 text-xs rounded-full border ${priorityColor}`}
                          >
                            {t.priority}
                          </span>

                          {t.submittedAt && (
                            <span
                              className={`px-2 py-1 text-xs rounded-full border ${
                                isLate
                                  ? "bg-red-500/10 text-red-500 border-red-500/30"
                                  : "bg-green-500/10 text-green-500 border-green-500/30"
                              }`}
                            >
                              {isLate ? "Late " : "In Time "}
                            </span>
                          )}
                        </div>

                        {/* ACTION */}
                        <div className="mt-4 flex justify-end">
                          {modal.type === "todo" && (
                            <button
                              onClick={async () => {
                                const res = await fetch(
                                  `http://localhost:5000/move-task/${id}`,
                                  {
                                    method: "PATCH",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    credentials: "include",
                                    body: JSON.stringify({
                                      taskId: t.id,
                                      from: "todo",
                                      to: "running",
                                      email: modal.member.email,
                                    }),
                                  },
                                );
                                if (res.status === 401 || res.status === 403) {
                                  alert("Session expired. Please login again");
                                  await logOut();
                                  window.location.href = "/login";
                                  return;
                                }
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
                                const res = await fetch(
                                  `http://localhost:5000/move-task/${id}`,
                                  {
                                    method: "PATCH",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    credentials: "include",
                                    body: JSON.stringify({
                                      taskId: t.id,
                                      from: "running",
                                      to: "done",
                                      email: modal.member.email,
                                    }),
                                  },
                                );
                                if (res.status === 401 || res.status === 403) {
                                  alert("Session expired. Please login again");
                                  await logOut();
                                  window.location.href = "/login";
                                  return;
                                }
                                fetchProject();
                              }}
                              className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700"
                            >
                              Move → Done
                            </button>
                          )}

                          {modal.type === "done" && (
                            <span className="text-xs text-gray-400 flex items-center gap-1 italic">
                              Completed <IoCheckmarkDoneOutline />
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
