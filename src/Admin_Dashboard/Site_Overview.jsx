import { useEffect, useState } from "react";

const Site_Overview = () => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch users
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.data));

    // Fetch projects
    fetch("http://localhost:5000/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data.data));
  }, []);

  // 🧠 CURRENT TIME
  const now = new Date();

  // ✅ Total Users
  const totalUsers = users.length;

  // ✅ Total Admin
  const totalAdmin = users.filter((u) => u.role === "admin").length;

  // ✅ Active Users (lastActiveAt ≤ 10 days)
  const activeUsers = users.filter((user) => {
    if (!user.lastActiveAt) return false;

    const lastActive = new Date(user.lastActiveAt);
    const diffDays = (now - lastActive) / (1000 * 60 * 60 * 24);

    return diffDays <= 10;
  }).length;

  // ✅ Total Managers (unique created_by)
  const managers = [
    ...new Set(projects.map((p) => p.created_by)),
  ].length;

  // ✅ Total Projects
  const totalProjects = projects.length;

  // ✅ Active Projects (latest todo task ≤ 7 days)
  const activeProjects = projects.filter((project) => {
    let latestDate = null;

    project.teammember.forEach((member) => {
      member.todo?.forEach((task) => {
        const taskDate = new Date(task.createdAt);

        if (!latestDate || taskDate > latestDate) {
          latestDate = taskDate;
        }
      });
    });

    if (!latestDate) return false;

    const diffDays = (now - latestDate) / (1000 * 60 * 60 * 24);

    return diffDays <= 7;
  }).length;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* Card */}
      <Card title="Total Users" value={totalUsers} />
      <Card title="Total Admin" value={totalAdmin} />
      <Card title="Active Users" value={activeUsers} />

      <Card title="Total Managers" value={managers} />
      <Card title="Total Projects" value={totalProjects} />
      <Card title="Active Projects" value={activeProjects} />

    </div>
  );
};

// 🔥 Reusable Card
const Card = ({ title, value }) => {
  return (
    <div className="p-6 rounded-xl shadow bg-white border">
      <h2 className="text-gray-500 text-sm">{title}</h2>
      <p className="text-3xl font-bold text-blue-600">{value}</p>
    </div>
  );
};

export default Site_Overview;