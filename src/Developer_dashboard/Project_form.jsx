import React, { useContext, useState } from 'react';
import { AuthContext } from '../Firebase/AuthContext';

const Project_form = () => {
  const [teamName, setTeamName] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
   const { user} = useContext(AuthContext);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectData = {
      teamName,
      projectTitle,
      email: user?.email,
    };

    try {
      const res = await fetch("http://localhost:5000/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      const data = await res.json();

      if (data.success) {
        alert("Project Created ✅");
        setTeamName("");
        setProjectTitle("");
      }
    } catch (error) {
      console.log(error);
    }
  };

    return (
          <form
      onSubmit={handleSubmit}
      className="bg-white text-black p-6 rounded-lg shadow-lg space-y-4 w-80"
    >
      <h2 className="text-lg font-bold">Create Project</h2>

      <input
        type="text"
        placeholder="Team Name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="text"
        placeholder="Project Title"
        value={projectTitle}
        onChange={(e) => setProjectTitle(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <button
        type="submit"
        className="bg-green-500 text-white w-full py-2 rounded"
      >
        Submit
      </button>
    </form>
    );
};

export default Project_form;