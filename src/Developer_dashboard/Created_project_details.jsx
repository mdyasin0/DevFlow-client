import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const Created_project_details = () => {
      const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/project/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data); 
        if (data.success) {
          setProject(data.data);
        }
      });
  }, [id]);

  if (!project) {
    return <p className="text-center mt-10">Loading...</p>;
  }
    return (
         <div className="min-h-screen bg-gray-900 text-white p-6 flex justify-center items-center">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-lg space-y-4">

        <h2 className="text-2xl font-bold text-blue-400">
          {project.projectTitle}
        </h2>

        <p>
          <span className="font-semibold">Team Name:</span>{" "}
          {project.teamName}
        </p>

        <p>
          <span className="font-semibold">Created By:</span>{" "}
          {project.created_by}
        </p>

        <p>
          <span className="font-semibold">Created Time:</span>{" "}
          {new Date(project.created_time).toLocaleString()}
        </p>

        <div>
          <span className="font-semibold">Team Members:</span>
          {project.teammember.length === 0 ? (
            <p className="text-gray-400 text-sm mt-1">
              No members yet
            </p>
          ) : (
            <ul className="list-disc ml-5 mt-2">
              {project.teammember.map((member, index) => (
                <li key={index}>{member}</li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
    );
};

export default Created_project_details;