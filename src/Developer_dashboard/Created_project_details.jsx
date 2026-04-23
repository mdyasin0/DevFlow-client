import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const Created_project_details = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/project/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProject(data.data);
        }
      });
  }, [id]);
const handleInvite = async () => {
  if (!inviteEmail) return alert("Email required");

  try {
    const res = await fetch(`http://localhost:5000/invite/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: inviteEmail,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Invitation sent successfully!");
      setInviteEmail("");
      setShowInvite(false);
    } else {
      alert(`⚠️ ${data.message}`);
    }
  } catch (err) {
    console.log(err);
    alert("Something went wrong");
  }
};

  if (!project) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex justify-center items-center">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-lg space-y-4">

        <h2 className="text-2xl font-bold text-blue-400">
          {project.projectTitle}
        </h2>

        <p><span className="font-semibold">Team Name:</span> {project.teamName}</p>
        <p><span className="font-semibold">Created By:</span> {project.created_by}</p>

        <button
          onClick={() => setShowInvite(!showInvite)}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          Invite Member
        </button>

        {showInvite && (
          <div className="mt-3 space-y-2">
            <input
              type="email"
              placeholder="Enter email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full p-2 rounded text-black"
            />

            <button
              onClick={handleInvite}
              className="bg-green-500 px-4 py-2 rounded"
            >
              Send Invitation
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Created_project_details;