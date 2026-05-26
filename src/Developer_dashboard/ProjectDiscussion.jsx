import React, { useEffect, useState, useContext, useRef } from "react";
import { socket } from "../Socket";
import { AuthContext } from "../Firebase/AuthContext";
import { HiDotsVertical } from "react-icons/hi";

const emojiGroups = {
  happy: ["😀","😃","😄","😁","😆"],
  sad: ["😢","😭","😞"],
  angry: ["😡","😠"],
  love: ["😍","❤️","😘"],
  laugh: ["😂","🤣"],
  thinking: ["🤔","😐"],
  ok: ["👍","👌"],
};

const ProjectDiscussion = ({ projectId, onClose }) => {
  const { user } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [menuId, setMenuId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const menuRef = useRef();
  const textareaRef = useRef();
  const bottomRef = useRef();

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuId(null);
      }
      if (!e.target.closest(".emoji-box")) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const timeAgo = (date) => {
    const sec = Math.floor((new Date() - new Date(date)) / 1000);
    if (sec < 60) return "just now";
    if (sec < 3600) return Math.floor(sec / 60) + " min ago";
    if (sec < 86400) return Math.floor(sec / 3600) + " hr ago";
    return Math.floor(sec / 86400) + " day ago";
  };

  useEffect(() => {
    fetch(`https://devflow-server-777f.onrender.com/project-message/${projectId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => data.success && setMessages(data.data));
  }, [projectId]);

  useEffect(() => {
    socket.emit("joinProject", projectId);

    socket.on("newMessage", (msg) => setMessages((p) => [...p, msg]));
    socket.on("deleteMessage", (id) =>
      setMessages((p) => p.filter((m) => m._id !== id))
    );
    socket.on("updateMessage", (updated) =>
      setMessages((p) => p.map((m) => (m._id === updated._id ? updated : m)))
    );

    return () => {
      socket.off("newMessage");
      socket.off("deleteMessage");
      socket.off("updateMessage");
    };
  }, [projectId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

 const sendMessage = async () => {
  if (!text.trim()) return;

  try {
    const res = await fetch("https://devflow-server-777f.onrender.com/project-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        projectId,
        message: text,
        senderName: user.displayName,
      }),
    });

    const data = await res.json();

    if ( data.code === "PLAN_RESTRICTED for msaage send") {
      alert("Upgrade your plan to use chat 🚀");
      return;
    }

    if (data.success) {
      setText("");
    }
  } catch (err) {
    console.error(err);
  }
};

  const handleDelete = async (id) => {
    await fetch(`https://devflow-server-777f.onrender.com/project-message/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  };

  const handleUpdate = async (id) => {
    if (!editText.trim()) return;

    await fetch(`https://devflow-server-777f.onrender.com/project-message/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ message: editText }),
    });

    setEditId(null);
    setEditText("");
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] bg-(--bg-secondary) text-(--text) rounded-xl flex flex-col shadow-xl">

        {/* HEADER */}
        <div className="p-4 border-b border-(--border) flex justify-between items-center">
          <h2 className="font-semibold text-(--primary) text-lg">
            Project Discussion
          </h2>
          <button onClick={onClose}>❌</button>
        </div>

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => {
            const isMe = msg.senderEmail === user.email;

            return (
              <div
                key={msg._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div className="relative max-w-[70%] group">

                  {isMe && (
                    <div
                      ref={menuRef}
                      className="absolute top-1 -right-1 opacity-0 group-hover:opacity-100 transition z-10"
                    >
                      <button onClick={() => setMenuId(msg._id)}>
                        <HiDotsVertical />
                      </button>

                      {menuId === msg._id && (
                        <div className="absolute right-0 mt-1 bg-(--bg) border border-(--border) rounded shadow-xl z-50">
                          <button
                            onClick={() => {
                              setEditId(msg._id);
                              setEditText(msg.message);
                              setMenuId(null);
                            }}
                            className="block px-4 py-2 hover:bg-(--bg-secondary)w-full text-left"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(msg._id)}
                            className="block px-4 py-2 text-(--danger) hover:bg-(--bg-secondary) w-full text-left"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* MESSAGE */}
                  <div
                    className={`px-3 py-2 rounded-lg shadow-md ${
                      isMe
                        ? "bg-(--primary) text-white"
                        : "bg-(--bg)"
                    }`}
                  >
                    {!isMe && (
                      <p className="text-xs text-(--text-secondary) mb-1">
                        {msg.senderName}
                      </p>
                    )}

                    {editId === msg._id ? (
                      <>
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full p-1 text-black rounded"
                        />
                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() => handleUpdate(msg._id)}
                            className="text-(--success) text-xs"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="text-(--danger) text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="whitespace-pre-wrap">{msg.message}</p>
                        <p className="text-[10px] text-(--text-secondary) mt-1">
                          {timeAgo(msg.createdAt)} {msg.edited && "(edited)"}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={bottomRef}></div>
        </div>

        {/* INPUT */}
        <div className="p-3 border-t border-(--border) flex gap-2 items-center">

          {/* EMOJI */}
          <div className="relative emoji-box">
            <button
              onClick={() => setShowEmoji(!showEmoji)}
              className="text-xl"
            >
              😊
            </button>

            {showEmoji && (
              <div className="absolute bottom-12 left-0 bg-(--bg) border border-(--border) p-3 rounded-lg shadow-xl w-64 z-50">
                {Object.entries(emojiGroups).map(([group, list]) => (
                  <div key={group} className="mb-2">
                    <p className="text-xs text-(--text-secondary) mb-1 capitalize">
                      {group}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {list.map((e) => (
                        <span
                          key={e}
                          className="text-xl cursor-pointer hover:scale-125 transition"
                          onClick={() => {
                            setText((p) => p + e);
                            textareaRef.current.focus();
                          }}
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 p-2 rounded bg-(--bg) text-(--text) outline-none focus:ring-2 focus:ring-(--primary)"
            placeholder="Type message..."
          />

          <button
            onClick={sendMessage}
            className="bg-(--primary) px-4 py-2 rounded hover:opacity-90 text-white"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDiscussion;