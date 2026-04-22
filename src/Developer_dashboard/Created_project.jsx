import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Firebase/AuthContext';
import { useNavigate } from 'react-router';

const Created_project = () => {
      const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
const navigate = useNavigate();
  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/projects/${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setProjects(data.data);
          }
        });
    }
  }, [user]);
    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-6">📂 My Projects</h2>

      {projects.length === 0 ? (
        <p className="text-gray-400">No projects found</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div
              key={project._id}
               onClick={() => navigate(`/developer_dashboard/created_project_details/${project._id}`)}
              className="bg-gray-800 p-5 rounded-xl shadow-md border border-gray-700"
            >
              <h3 className="text-lg font-semibold text-blue-400">
                {project.projectTitle}
              </h3>
              <p className="text-sm text-gray-300 mt-2">
                Team: {project.teamName}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
    );
};

export default Created_project;