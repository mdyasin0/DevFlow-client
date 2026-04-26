import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Firebase/AuthContext";

const Invitations = () => {
  const [projects, setProjects] = useState([]);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  // 👤 get user name
  useEffect(() => {
    if (!user?.email) return;

    fetch(`http://localhost:5000/user/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUserName(data.data.name);
        }
      });
  }, [user?.email]);

  // 📦 fetch invitations
  useEffect(() => {
    if (!user?.email) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:5000/my-invitations/${user.email}`
        );
        const data = await res.json();

        if (data.success) {
          setProjects(data.data);
        }

        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.email]);

  // ✅ action handler
  const handleAction = async (projectId, status) => {
    const confirmAction = window.confirm(
      "You have one chance. After selecting, you can't change it. Are you sure?"
    );

    if (!confirmAction) return;

    try {
      const res = await fetch(
        `http://localhost:5000/invite-status/${projectId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            name: userName,
            status,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert(data.message);

        setProjects((prev) =>
          prev.map((p) =>
            p._id === projectId
              ? {
                  ...p,
                  invite_email: p.invite_email.map((i) =>
                    i.email === user.email ? { ...i, status } : i
                  ),
                }
              : p
          )
        );
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  if (loading || !user) {
    return (
      <div className="h-full flex items-center justify-center text-(--text)">
        <div className="px-5 py-2 rounded-lg bg-(--primary) text-white shadow">
          Loading invitations...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-(--bg-secondary) min-h-full text-(--text)">

      {/* HEADER */}
      <h2 className="text-xl font-semibold mb-6 text-(--primary)">
        Your Invitations
      </h2>

      {projects.length === 0 ? (
        <p className="text-(--text-secondary)">
          No invitations found
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-(--border) bg-(--card) shadow">

          <table className="w-full text-sm">

            {/* TABLE HEAD */}
            <thead className="bg-(--bg-secondary) text-(--text-secondary)">
              <tr className="text-left">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Team Name</th>
                <th className="px-4 py-3">Project Name</th>
                <th className="px-4 py-3">Start Time</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody>
              {projects.map((project, index) => {
                const invite = project.invite_email?.find(
                  (i) => i.email === user.email
                );

                if (!invite) return null;

                return (
                  <tr
                    key={project._id}
                    className="border-t border-(--border) hover:bg-(--bg-secondary) transition"
                  >
                    <td className="px-4 py-3">{index + 1}</td>

                    <td className="px-4 py-3 font-medium">
                      {project.teamName}
                    </td>

                    <td className="px-4 py-3 text-(--text-secondary)">
                      {project.projectTitle}
                    </td>

                    <td className="px-4 py-3 text-(--text-secondary)">
                      {new Date(project.created_time).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {invite.status === "pending" ? (
                        <select
                          onChange={(e) =>
                            handleAction(project._id, e.target.value)
                          }
                          defaultValue=""
                          className="px-2 py-1 rounded-lg border border-(--border) bg-(--card) text-(--text)"
                        >
                          <option value="" disabled>
                            Select
                          </option>
                          <option value="approved">Approve</option>
                          <option value="rejected">Reject</option>
                        </select>
                      ) : (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            invite.status === "approved"
                              ? "bg-green-500/20 text-green-500"
                              : "bg-red-500/20 text-red-500"
                          }`}
                        >
                          {invite.status}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default Invitations;