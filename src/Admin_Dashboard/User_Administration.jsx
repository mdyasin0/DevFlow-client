import { useEffect, useState } from "react";

const User_Administration = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  // Load users
  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.data);
      });
  }, []);

  // Filter users by email
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleBlock = (id) => {
    fetch(`http://localhost:5000/users/block/${id}`, {
      method: "PATCH",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const updated = users.map((user) =>
            user._id === id ? { ...user, isBlocked: true } : user,
          );
          setUsers(updated);
        }
      });
  };

  const handleUnblock = (id) => {
    fetch(`http://localhost:5000/users/unblock/${id}`, {
      method: "PATCH",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const updated = users.map((user) =>
            user._id === id ? { ...user, isBlocked: false } : user,
          );
          setUsers(updated);
        }
      });
  };

  const handleRoleChange = (id, newRole) => {
    fetch(`http://localhost:5000/users/role/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: newRole }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // UI update
          const updatedUsers = users.map((user) =>
            user._id === id ? { ...user, role: newRole } : user,
          );
          setUsers(updatedUsers);
        }
      });
  };

  return (
   <div className="p-6 bg-(--bg) text-(--text) min-h-screen">
  {/* Search */}
  <div className="mb-4">
    <input
      type="text"
      placeholder="Search by email..."
      className="w-full md:w-1/3 px-4 py-2 rounded-lg border 
                 border-(--border) 
                 bg-(--card) 
                 text-(--text) 
                 placeholder:text-(--text-secondary)
                 focus:outline-none focus:ring-2 focus:ring-(--primary)"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>

  {/* Table */}
  <div className="overflow-x-auto">
    <table className="w-full border border-(--border) rounded-lg overflow-hidden">
      
      <thead className="bg-(--bg-secondary) text-(--text)">
        <tr>
          <th className="p-3 text-left">Name</th>
          <th className="p-3 text-left">Email</th>
          <th className="p-3 text-left">Role</th>
          <th className="p-3 text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        {filteredUsers.map((user) => (
          <tr
            key={user._id}
            className="border-t border-(--border) hover:bg-(--bg-secondary) transition"
          >
            <td className="p-3">{user.name}</td>
            <td className="p-3 text-(--text-secondary)">{user.email}</td>
            <td className="p-3 capitalize">{user.role}</td>

            <td className="p-3 flex gap-2 justify-center items-center">
              
              {user.isBlocked ? (
                <button
                  onClick={() => handleUnblock(user._id)}
                  className="px-3 py-1 rounded 
                             bg-(--success) text-white 
                             hover:opacity-90 transition"
                >
                  Unblock
                </button>
              ) : (
                <button
                  onClick={() => handleBlock(user._id)}
                  className="px-3 py-1 rounded 
                             bg-(--danger) text-white 
                             hover:opacity-90 transition"
                >
                  Block
                </button>
              )}

              <select
                value={user.role}
                onChange={(e) =>
                  handleRoleChange(user._id, e.target.value)
                }
                className="px-2 py-1 rounded border 
                           border-(--border) 
                           bg-(--card) 
                           text-(--text)"
              >
                <option value="developer">Developer</option>
                <option value="admin">Admin</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {filteredUsers.length === 0 && (
      <p className="text-center mt-4 text-(--text-secondary)">
        No users found
      </p>
    )}
  </div>
</div>
  );
};

export default User_Administration;
