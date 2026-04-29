import axios from "axios";
import { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
 const FilterBtn = ({ text, onClick }) => (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-xl text-sm border border-(--border) hover:bg-(--primary) hover:text-white transition"
    >
      {text}
    </button>
  );
const Email_Communication = () => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { quill, quillRef } = useQuill({
    theme: "snow",
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
      ],
    },
  });
 
useEffect(() => {
  if (!quill) return;

  const handler = () => {
    setMessage(quill.root.innerHTML);
  };

  quill.on("text-change", handler);

  return () => quill.off("text-change", handler);
}, [quill]);
 

  const loadUsers = async () => {
    const res = await axios.get("http://localhost:5000/users");
    setUsers(res.data.data);
  };

  const loadProjects = async () => {
    const res = await axios.get("http://localhost:5000/projects");
    setProjects(res.data.data);
  };
 // load data
  useEffect(() => {
    loadUsers();
    loadProjects();
  }, []);
  // -------------------------
  // 🎯 Sorting Logic
  // -------------------------

  const getDeveloperEmails = () => {
    const projectEmails = projects.map((p) => p.created_by);

    const filtered = users.filter(
      (user) =>
        user.role === "developer" && !projectEmails.includes(user.email),
    );

    setSelectedEmails(filtered.map((u) => u.email));
  };

  const getManagerEmails = () => {
    const emails = projects.map((p) => p.created_by);
    setSelectedEmails(emails);
  };

  const getAllDevelopers = () => {
    const filtered = users.filter((user) => user.role === "developer");
    setSelectedEmails(filtered.map((u) => u.email));
  };

  const getAdmins = () => {
    const filtered = users.filter((user) => user.role === "admin");
    setSelectedEmails(filtered.map((u) => u.email));
  };

  const getAllUsers = () => {
    setSelectedEmails(users.map((u) => u.email));
  };

  // -------------------------
  // ✉️ Send Email
  // -------------------------

  const handleSend = async () => {
    await axios.post("http://localhost:5000/send-email", {
      emails: selectedEmails,
      subject,
      message,
    });

    alert("Email Sent!");
  };

  return (
    <div className="p-6 bg-(--bg) text-(--text) min-h-screen">
        
      {/* 🔹 Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Email Communication</h1>
        <p className="text-(--text-secondary) text-sm">
          Manage and send emails to users easily
        </p>
      </div>

      {/* 🔹 Cards */}
      <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 mb-8">
        <Card title="Total Users" value={users?.length || 0} />
        <Card
          title="Managers"
          value={[...new Set(projects.map((p) => p.created_by))].length}
        />
        <Card
          title="Developers"
          value={users?.filter((u) => u.role === "developer")?.length || 0}
        />
        <Card
          title="Admins"
          value={users?.filter((u) => u.role === "admin")?.length || 0}
        />
      </div>

      {/* 🔹 Filters */}
      <div className="bg-(--card) border border-(--border) rounded-2xl p-4 shadow mb-6">
        <h2 className="mb-3 font-semibold">Filter Emails</h2>

        <div className="flex flex-wrap gap-2">
          <FilterBtn text="team members" onClick={getDeveloperEmails} />
          <FilterBtn text="team-Managers" onClick={getManagerEmails} />
          <FilterBtn text="team members and team-Managers" onClick={getAllDevelopers} />
          <FilterBtn text="Admins" onClick={getAdmins} />
          <FilterBtn text="All login Users" onClick={getAllUsers} />
        </div>
      </div>

      {/* 🔹 Selected Emails */}
      <div className="bg-(--card) border border-(--border) rounded-2xl p-4 shadow mb-6">
       

     <div className="flex items-center justify-between">
  <h2 className="mb-3 font-semibold">Selected Emails</h2>

  <span className="px-4 py-1 rounded-full bg-(--primary)/10 text-(--primary) font-semibold">
    {selectedEmails.length} recipients
  </span>
</div>


      </div>

      {/* 🔹 Email Form */}
      <div className="bg-(--card) border border-(--border) rounded-2xl p-4 shadow">
        <h2 className="mb-4 font-semibold">Compose Email</h2>

        {/* Subject */}
        <input
          className="w-full mb-3 p-3 rounded-xl border border-(--border) bg-transparent focus:outline-none focus:ring-2 focus:ring-(--primary)"
          placeholder="Enter subject..."
          onChange={(e) => setSubject(e.target.value)}
        />

        {/* Message */}
        <div className="mb-4">
          <div
            className="bg-white text-black rounded-xl border border-(--border)"
           
          >
            <div ref={quillRef} />
          </div>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          className="w-full py-3 rounded-xl bg-(--primary) text-white font-semibold hover:bg-(--primary-hover) transition"
        >
          Send Email
        </button>
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-(--card) border border-(--border) p-4 rounded-2xl shadow hover:shadow-md transition">
    <p className="text-sm text-(--text-secondary)">{title}</p>
    <h2 className="text-2xl font-bold mt-2">{value}</h2>
  </div>
);

export default Email_Communication;
