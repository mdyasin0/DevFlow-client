import React, { useContext, useState } from "react";
import { AuthContext } from "../Firebase/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const Project_form = ({ setform }) => {
  const [teamName, setTeamName] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [description, setDescription] = useState("");
const navigate = useNavigate();
  const [isCreated, setIsCreated] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, logOut } = useContext(AuthContext);

  const resetForm = () => {
    setTeamName("");
    setProjectTitle("");
    setDescription("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; 

    setLoading(true);

    const projectData = {
      teamName,
      projectTitle,
      description,
      email: user?.email,
    };

    try {
      const res = await fetch("https://devflow-server-s7bh.onrender.com/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(projectData),
      });

      const data = await res.json();

      if (res.status === 401) {
        toast.warn("Session expired. Please login again");
        await logOut();
        navigate("/login");
        return;
      }

      if (data?.isBlocked) {
        toast.warn("You are blocked by admin");
        await logOut();
      navigate("/login");
        return;
      }

      if (data?.code === "LIMIT_REACHED") {
        toast.info(data.message);
        return;
      }

      if (!res.ok) {
        toast.error(data.message || "Something went wrong");
        return;
      }

      if (data.success) {
        toast.success(
          "Your project created successfully. You can start work when admin approves the project.",
        );

        resetForm(); 
        setIsCreated(true); 
        setform(false);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 
  if (isCreated) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-(--card) text-(--text) p-6 rounded-lg shadow-lg space-y-4 w-80 border border-(--border)"
    >
      <h2 className="text-lg font-bold">Create Project</h2>

      <input
        type="text"
        placeholder="Team Name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        className="w-full border border-(--border) p-2 rounded bg-(--bg) text-(--text)"
        required
      />

      <input
        type="text"
        placeholder="Project Title"
        value={projectTitle}
        onChange={(e) => setProjectTitle(e.target.value)}
        className="w-full border border-(--border) p-2 rounded bg-(--bg) text-(--text)"
        required
      />

      <textarea
        placeholder="Project Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border border-(--border) p-2 rounded bg-(--bg) text-(--text)"
        required
      />

      <button
        type="submit"
        disabled={loading} 
        className="bg-(--primary) hover:bg-(--primary-hover) disabled:opacity-50 text-white w-full py-2 rounded"
      >
        {loading ? "Creating..." : "Submit"}
      </button>
    </form>
  );
};

export default Project_form;
