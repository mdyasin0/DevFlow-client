import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Firebase/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const Site_Overview = () => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const { logOut } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 useEffect(() => {
  setLoading(true);

  Promise.all([
    fetch("https://devflow-server-s7bh.onrender.com/users", {
      credentials: "include",
    }),
    fetch("https://devflow-server-s7bh.onrender.com/projects", {
      credentials: "include",
    }),
  ])
    .then(async ([userRes, projectRes]) => {
      // AUTH check (users)
      if (userRes.status === 401 || projectRes.status === 401) {
        toast.error("Session expired. Please login again");
        await logOut();
        navigate("/login");
        return;
      }

      const userData = await userRes.json();
      const projectData = await projectRes.json();

      // BLOCK check
      if (userData?.isBlocked || projectData?.isBlocked) {
        toast.error("You are blocked by admin");
        await logOut();
        navigate("/login");
        return;
      }

      return { userData, projectData };
    })
    .then((data) => {
      if (data) {
        setUsers(data.userData.data);
        setProjects(data.projectData.data);
      }
    })
    .catch(() => {
      toast.error("Failed to load data");
    })
    .finally(() => {
      setLoading(false); // spinner off
    });
}, [logOut,navigate]);

  // CURRENT TIME
  const now = new Date();

  // Total Users
  const totalUsers = users.length;

  // Total Admin
  const totalAdmin = users.filter((u) => u.role === "admin").length;

  // Active Users (lastActiveAt ≤ 10 days)
  const activeUsers = users.filter((user) => {
    if (!user.lastActiveAt) return false;

    const lastActive = new Date(user.lastActiveAt);
    const diffDays = (now - lastActive) / (1000 * 60 * 60 * 24);

    return diffDays <= 10;
  }).length;

  // Total Managers (unique created_by)
  const managers = [...new Set(projects.map((p) => p.created_by))].length;

  //  Total Projects
  const totalProjects = projects.length;

  //  Active Projects (latest todo task ≤ 7 days)
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
if (loading) {
  return (
    <div className="flex justify-center items-center h-screen">
     <span className="loading loading-spinner text-primary"></span>
    </div>
  );
}
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-(--bg-secondary) min-h-screen transition-colors duration-300">
      <Card title="Total Users" value={totalUsers} />
      <Card title="Total Admin" value={totalAdmin} />
      <Card title="Active Users" value={activeUsers} />

      <Card title="Total Managers" value={managers} />
      <Card title="Total Projects" value={totalProjects} />
      <Card title="Active Projects" value={activeProjects} />
    </div>
  );
};

//  Reusable Card
const Card = ({ title, value }) => {
  return (
    <div className="p-6 rounded-xl border shadow-sm bg-(--card) border-(--border) transition-colors duration-300">
      <h2 className="text-sm text-(--text-secondary)">{title}</h2>

      <p className="text-3xl font-bold text-(--primary) mt-2">{value}</p>
    </div>
  );
};

export default Site_Overview;
