import React, { useContext, useState } from "react";
import { AuthContext } from "../Firebase/AuthContext";

const Project_form = ({setform }) => {
  const [teamName, setTeamName] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [description, setDescription] = useState("");

  const [isCreated, setIsCreated] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ new

  const { user, logOut } = useContext(AuthContext);

  const resetForm = () => {
    setTeamName("");
    setProjectTitle("");
    setDescription("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // ✅ prevent double click

    setLoading(true);

    const projectData = {
      teamName,
      projectTitle,
      description,
      email: user?.email,
    };

    try {
      const res = await fetch("http://localhost:5000/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(projectData),
      });

      const data = await res.json();

      if (res.status === 401) {
        alert("Session expired. Please login again");
        await logOut();
        window.location.href = "/login";
        return;
      }

      if (data?.isBlocked) {
        alert("You are blocked by admin");
        await logOut();
        window.location.href = "/login";
        return;
      }

      if (data?.code === "LIMIT_REACHED") {
        alert(data.message);
        return;
      }

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      if (data.success) {
        alert(
          "Your project created successfully. You can start work when admin approves the project."
        );

        resetForm();       // ✅ clear inputs
        setIsCreated(true); // ✅ hide form
          setform(false);
      }
    } catch (error) {
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ hide form after create
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
        disabled={loading}   // ✅ disable button
        className="bg-(--primary) hover:bg-(--primary-hover) disabled:opacity-50 text-white w-full py-2 rounded"
      >
        {loading ? "Creating..." : "Submit"}
      </button>
    </form>
  );
};

export default Project_form;