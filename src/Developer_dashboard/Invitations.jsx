import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Firebase/AuthContext";

const Invitations = () => {
  const [projects, setProjects] = useState([]);
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);

const [userName, setUserName] = useState("");

  useEffect(() => {
  if (!user?.email) return;

  fetch(`http://localhost:5000/user/${user.email}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setUserName(data.data.name); // 👈 এখানে name set হবে
      }
    });
}, [user?.email]);
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
          headers: {
            "Content-Type": "application/json",
          },
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
                    i.email === user.email
                      ? { ...i, status }
                      : i
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

  // 🔥 Loading UI
  if (loading || !user) {
    return (
      <p className="text-white text-center mt-10">
        Loading invitations...
      </p>
    );
  }

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl mb-4">Your Invitations</h2>

      {projects.length === 0 ? (
        <p>No invitations found</p>
      ) : (
        projects.map((project) => {
          const invite = project.invite_email?.find(
            (i) => i.email === user.email
          );

          if (!invite) return null;

          return (
            <div
              key={project._id}
              className="bg-gray-800 p-4 rounded mb-4"
            >
              <h3 className="text-xl text-blue-400">
                {project.projectTitle}
              </h3>
              <p>Team: {project.teamName}</p>

              {/* Pending state */}
              {invite.status === "pending" ? (
                <select
                  onChange={(e) =>
                    handleAction(project._id, e.target.value)
                  }
                  className="mt-2 p-2 text-black"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Action
                  </option>
                  <option value="approved">Approve</option>
                  <option value="rejected">Reject</option>
                </select>
              ) : (
                // Fixed button after selection
                <button
                  className={`mt-2 px-4 py-2 rounded text-white ${
                    invite.status === "approved"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {invite.status}
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Invitations;