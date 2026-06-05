import axios from "axios";
import { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import toast from "react-hot-toast";
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
  const [loading, setLoading] = useState(false);
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

const loadData = async () => {
  setLoading(true);
  try {
    const [usersRes, projectsRes] = await Promise.all([
      axios.get("https://devflow-server-s7bh.onrender.com/users", {
        withCredentials: true,
      }),
      axios.get("https://devflow-server-s7bh.onrender.com/projects", {
        withCredentials: true,
      }),
    ]);

    setUsers(usersRes.data.data);
    setProjects(projectsRes.data.data);
  } catch (err) {
    toast.error(err);
  } finally {
    setLoading(false);
  }
};
  // load data
  useEffect(() => {
   loadData();
  }, []);
  // -------------------------
  //  Sorting Logic
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
  //  Send Email
  // -------------------------

  const handleSend = async () => {
    if (!isValid) {
      toast.error("Please fill all fields and select recipients!");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        "https://devflow-server-s7bh.onrender.com/send-email",
        {
          emails: selectedEmails,
          subject,
          message,
        },
        {
          withCredentials: true,
        },
      );

      toast.success("Email Sent successfull !");

      //RESET ALL FIELDS AFTER SUCCESS
      setSubject("");
      setMessage("");
      setSelectedEmails([]);

      if (quill) {
        quill.setText(""); // quill reset
      }
    } catch (err) {
      toast.error(err);
      toast.error("Email sending failed!");
    } finally {
      setLoading(false);
    }
  };
  const isValid =
    selectedEmails.length > 0 &&
    subject.trim() !== "" &&
    message.trim().trim() !== "";
    if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-(--bg)">
     <span className="loading loading-spinner text-primary"></span>
    </div>
  );
}
  return (
   <div className="p-4 sm:p-6 bg-(--bg) text-(--text) min-h-screen">
  {/*  Header */}
  <div className="mb-6">
    <h1 className="text-xl sm:text-2xl font-bold">Email Communication</h1>
    <p className="text-(--text-secondary) text-xs sm:text-sm">
      Manage and send emails to users easily
    </p>
  </div>

  {/*  Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

  {/*  Filters */}
  <div className="bg-(--card) border border-(--border) rounded-2xl p-3 sm:p-4 shadow-[0_4px_10px_var(--shadow)] mb-6">
    <h2 className="mb-3 font-semibold text-sm sm:text-base">Filter Emails</h2>

    <div className="flex flex-wrap gap-2">
      <FilterBtn text="team members" onClick={getDeveloperEmails} />
      <FilterBtn text="team-Managers" onClick={getManagerEmails} />
      <FilterBtn
        text="team members and team-Managers"
        onClick={getAllDevelopers}
      />
      <FilterBtn text="Admins" onClick={getAdmins} />
      <FilterBtn text="All login Users" onClick={getAllUsers} />
    </div>
  </div>

  {/*  Selected Emails */}
  <div className="bg-(--card) border border-(--border) rounded-2xl p-3 sm:p-4 shadow-[0_4px_10px_var(--shadow)] mb-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <h2 className="mb-1 sm:mb-3 font-semibold text-sm sm:text-base">
        Selected Emails
      </h2>

      <span className="px-3 sm:px-4 py-1 rounded-full bg-(--primary)/10 text-(--primary) font-semibold text-xs sm:text-sm w-fit">
        {selectedEmails.length} recipients
      </span>
    </div>
  </div>

  {/*  Email Form */}
  <div className="bg-(--card) border border-(--border) rounded-2xl p-3 sm:p-4 shadow-[0_4px_10px_var(--shadow)]">
    <h2 className="mb-4 font-semibold text-sm sm:text-base">
      Compose Email
    </h2>

    {/* Subject */}
    <input
      value={subject}
      className="w-full mb-3 p-2 sm:p-3 rounded-xl border border-(--border) bg-(--bg-secondary) text-(--text) focus:outline-none focus:ring-2 focus:ring-(--primary) text-sm sm:text-base"
      placeholder="Enter subject..."
      onChange={(e) => setSubject(e.target.value)}
    />

    {/* Message */}
    <div className="mb-4">
      <div className="bg-(--bg-secondary) text-(--text) rounded-xl border border-(--border) overflow-x-auto">
        <div ref={quillRef} />
      </div>
    </div>

    {/* Send Button */}
    <button
      onClick={handleSend}
      disabled={!isValid || loading}
      className={`w-full py-2 sm:py-3 rounded-xl font-semibold transition text-sm sm:text-base 
  ${
    !isValid || loading
      ? "bg-gray-400 cursor-not-allowed text-white"
      : "bg-(--primary) hover:bg-(--primary-hover) text-white"
  }`}
    >
      {loading ? "Sending..." : "Send Email"}
    </button>
  </div>
</div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-(--card) border border-(--border) p-3 sm:p-4 md:p-5 rounded-2xl shadow-[0_4px_10px_var(--shadow)] hover:shadow-[0_6px_14px_var(--shadow)] transition w-full h-full flex flex-col justify-between">
  <p className="text-xs sm:text-sm md:text-base text-(--text-secondary) truncate">
    {title}
  </p>
  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mt-2 text-(--text) break-words">
    {value}
  </h2>
</div>
);

export default Email_Communication;
