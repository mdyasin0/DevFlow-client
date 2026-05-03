import React, { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

const Inactive_Users = () => {
  const [users, setUsers] = useState([]);
  const [subject, setSubject] = useState("");

  const [recipientType, setRecipientType] = useState("allInactive");
  const [rangeValue, setRangeValue] = useState("");
  const [rangeType, setRangeType] = useState("days");

  const [selectedEmails, setSelectedEmails] = useState([]);

  // 🔥 QUILL
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

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!quill) return;

    const handler = () => {
      setMessage(quill.root.innerHTML);
    };

    quill.on("text-change", handler);

    return () => quill.off("text-change", handler);
  }, [quill]);

  useEffect(() => {
    fetch("http://localhost:5000/approved_users")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUsers(data.data);
      });
  }, []);

  const isActive = (date) => {
    const last = new Date(date);
    const now = new Date();
    const diff = (now - last) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  };

  const getInactiveUsers = () =>
    users.filter((u) => !isActive(u.lastActiveAt));

  const filterByRange = (inactiveUsers) => {
    if (!rangeValue) return inactiveUsers;

    const now = new Date();

    return inactiveUsers.filter((u) => {
      const last = new Date(u.lastActiveAt);
      const diffDays = (now - last) / (1000 * 60 * 60 * 24);

      if (rangeType === "days") return diffDays >= rangeValue;
      if (rangeType === "months") return diffDays >= rangeValue * 30;
      if (rangeType === "years") return diffDays >= rangeValue * 365;

      return true;
    });
  };

  const handleRecipient = () => {
    const inactive = getInactiveUsers();

    if (recipientType === "allInactive") {
      setSelectedEmails(inactive.map((u) => u.email));
      return;
    }

    if (recipientType === "custom") {
      const filtered = filterByRange(inactive);

      if (filtered.length === 0) {
        alert("No recipients in this range ❌");
        setSelectedEmails([]);
        return;
      }

      setSelectedEmails(filtered.map((u) => u.email));
    }
  };

  const sendEmail = async () => {
    if (selectedEmails.length === 0) {
      alert("No recipients selected ❌");
      return;
    }

    await fetch("http://localhost:5000/email/send-inactive", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emails: selectedEmails,
        subject,
        message,
      }),
    });

    alert("Email sent 🚀");
  };

  return (
   <div className="p-6 space-y-6 bg-(--bg) text-(--text)">

  {/* ===== CARDS ===== */}
  <div className="grid grid-cols-2 gap-4 mb-6">

    {/* Active Users */}
    <div className="p-4 rounded-xl shadow"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        boxShadow: "0 2px 10px var(--shadow)"
      }}
    >
      <h2 className="text-lg font-semibold text-(--text-secondary)">
        Active Users
      </h2>
      <p className="text-2xl font-bold text-(--success)">
        {
          users.filter((u) => {
            const last = new Date(u.lastActiveAt);
            const now = new Date();
            const diff = (now - last) / (1000 * 60 * 60 * 24);
            return diff <= 7;
          }).length
        }
      </p>
    </div>

    {/* Inactive Users */}
    <div className="p-4 rounded-xl shadow"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        boxShadow: "0 2px 10px var(--shadow)"
      }}
    >
      <h2 className="text-lg font-semibold text-(--text-secondary)">
        Inactive Users
      </h2>
      <p className="text-2xl font-bold text-(--danger)">
        {
          users.filter((u) => {
            const last = new Date(u.lastActiveAt);
            const now = new Date();
            const diff = (now - last) / (1000 * 60 * 60 * 24);
            return diff > 7;
          }).length
        }
      </p>
    </div>

  </div>

  {/* ===== RECIPIENT ===== */}
  <div
    className="p-4 rounded-xl shadow space-y-3"
    style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      boxShadow: "0 2px 10px var(--shadow)"
    }}
  >
    <h2 className="text-xl font-bold">
      Select Recipients
    </h2>

    <select
      className="w-full p-2 rounded border bg-(--bg-secondary) text-(--text)"
      onChange={(e) => setRecipientType(e.target.value)}
    >
      <option value="allInactive">All Inactive Users</option>
      <option value="custom">Custom Range</option>
    </select>

    {recipientType === "custom" && (
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Value (e.g 20)"
          className="w-full p-2 rounded border bg-(--bg-secondary)"
          onChange={(e) => setRangeValue(e.target.value)}
        />

        <select
          className="p-2 rounded border bg-(--bg-secondary)"
          onChange={(e) => setRangeType(e.target.value)}
        >
          <option value="days">Days</option>
          <option value="months">Months</option>
          <option value="years">Years</option>
        </select>
      </div>
    )}

    <button
      onClick={handleRecipient}
      className="w-full py-2 rounded font-semibold text-white"
      style={{ background: "var(--primary)" }}
    >
      Load Recipients
    </button>

    <p className="text-sm text-(--text-secondary)">
      Selected: {selectedEmails.length}
    </p>
  </div>

  {/* ===== EMAIL ===== */}
  <div
    className="p-4 rounded-xl shadow space-y-3"
    style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      boxShadow: "0 2px 10px var(--shadow)"
    }}
  >
    <h2 className="text-xl font-bold">
      Send Email
    </h2>

    <input
      className="w-full p-2 rounded border bg-(--bg-secondary)"
      placeholder="Subject"
      value={subject}
      onChange={(e) => setSubject(e.target.value)}
    />

    {/* QUILL EDITOR */}
    <div
      className="rounded border p-2"
      style={{
        background: "var(--bg-secondary)",
        color: "var(--text)"
      }}
    >
      <div ref={quillRef} />
    </div>

    <button
      onClick={sendEmail}
      className="w-full py-2 rounded font-semibold text-white"
      style={{ background: "var(--success)" }}
    >
      Send Email
    </button>

  </div>

</div>
  );
};

export default Inactive_Users;