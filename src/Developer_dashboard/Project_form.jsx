import React, { useContext, useState } from "react";
import { AuthContext } from "../Firebase/AuthContext";

const Project_form = () => {
  const [teamName, setTeamName] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const { user, logOut } = useContext(AuthContext);
  const [description, setDescription] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectData = {
      teamName,
      projectTitle,
      description,
      email: user?.email,
    };

    try {
      const res = await fetch("https://devflow-server-777f.onrender.com/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(projectData),
      });

      const data = await res.json();

      // ✅ 1. AUTH সমস্যা → logout
      if (res.status === 401) {
        alert("Session expired. Please login again");
        await logOut();
        window.location.href = "/login";
        return;
      }

      // ✅ 2. BLOCKED USER
      if (data?.isBlocked) {
        alert("You are blocked by admin");
        await logOut();
        window.location.href = "/login";
        return;
      }

      // ✅ 3. LIMIT REACHED
      if (data?.code === "LIMIT_REACHED") {
        alert(data.message); // 🔥 upgrade message
        return;
      }

      // ✅ 4. OTHER ERROR
      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      // ✅ SUCCESS
      if (data.success) {
        alert("Project Created");
      }
    } catch (error) {
      alert(error);
    }
  };

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
        className="bg-(--primary) hover:bg-(--primary-hover) text-white w-full py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
};

export default Project_form;
