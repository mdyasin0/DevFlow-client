import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Firebase/AuthContext";
import { socket } from "../Socket";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const Invitations = () => {
  const [projects, setProjects] = useState([]);
  const { user, logOut } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  //  get user name
  useEffect(() => {
    if (!user?.email) return;

    fetch(`http://localhost:5000/user/${user.email}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUserName(data.data.name);
        }
      });
  }, [user?.email]);

  //  fetch invitations
  useEffect(() => {
    if (!user?.email) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:5000/my-invitations/${user.email}`,
          {
            credentials: "include",
          },
        );
        //  1. AUTH  logout
        if (res.status === 401) {
          toast.warn("Session expired. Please login again");
          await logOut();
         navigate("/login");
          return;
        }
        const data = await res.json();
        //  2. BLOCKED USER
        if (data?.isBlocked) {
          toast.warn("You are blocked by admin");
          await logOut();
        navigate("/login");
          return;
        }
        if (data.success) {
          setProjects(data.data);
        }

        setLoading(false);
      } catch (err) {
        toast.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.email, logOut]);
  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);
    }
  }, [user]);
  useEffect(() => {
    if (projects.length > 0) {
      projects.forEach((p) => {
        socket.emit("joinProject", p._id);
      });
    }
  }, [projects]);
  useEffect(() => {
    socket.on("projectUpdated", (updatedProject) => {
      setProjects((prev) =>
        prev.map((p) => (p._id === updatedProject._id ? updatedProject : p)),
      );
    });

    return () => socket.off("projectUpdated");
  }, []);
  useEffect(() => {
    const handler = async (data) => {
      try {
        const res = await fetch(
          `http://localhost:5000/my-invitations/${user.email}`,
          {
            credentials: "include",
          },
        );

        
        if (res.status === 401) {
          toast.warn("Session expired. Please login again");
          await logOut();
         navigate("/login");
          return;
        }

        const result = await res.json();

        // BLOCKED USER
        if (data?.isBlocked) {
          toast.warn("You are blocked by admin");
          await logOut();
         navigate("/login");
          return;
        }

        if (result.success) {
          setProjects(result.data);
        }
      } catch (err) {
        toast.error(err);
      }
    };

    socket.on("newInvitation", handler);

    return () => {
      socket.off("newInvitation", handler); 
    };
  }, [user?.email, logOut]);
  const filteredProjects = projects.filter(
    (project) =>
      project.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  //  action handler
  const handleAction = async (projectId, status) => {
    const confirmAction = window.confirm(
      "You have one chance. After selecting, you can't change it. Are you sure?",
    );

    if (!confirmAction) return;

    try {
      const res = await fetch(
        `http://localhost:5000/invite-status/${projectId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: user.email,
            name: userName,
            status,
          }),
        },
      );

      const data = await res.json();
      if (!res.ok) {
        if (data?.code === "TEAM_LIMIT_REACHED") {
          toast.info(data.message);
          return;
        }
      }
      if (data.success) {
        toast.success(data.message);

        setProjects((prev) =>
          prev.map((p) =>
            p._id === projectId
              ? {
                  ...p,
                  invite_email: p.invite_email.map((i) =>
                    i.email === user.email ? { ...i, status } : i,
                  ),
                }
              : p,
          ),
        );
      } else {
        toast(data.message);
      }
    } catch (err) {
      toast.error(err);
      toast.warn("Something went wrong");
    }
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-(--bg-secondary) min-h-full text-(--text)">
      {/* HEADER */}

      {filteredProjects.length === 0 ? (
        <>
          {" "}
          <p className="text-(--text-secondary)  justify-center items-center h-screen flex">
            No invitations found
          </p>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-6 text-(--primary)">
            Your Invitations
          </h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by team name or project title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/2 px-4 py-2 rounded-lg border border-(--border) bg-(--card) text-(--text)"
            />
          </div>
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
                    (i) => i.email === user.email,
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
        </>
      )}
    </div>
  );
};

export default Invitations;
