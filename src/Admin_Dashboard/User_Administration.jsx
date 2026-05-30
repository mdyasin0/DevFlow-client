import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Firebase/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const User_Administration = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  // Load users
  useEffect(() => {
    fetch("http://localhost:5000/users", {
      credentials: "include",
    })
      .then(async (res) => {
       
        if (res.status === 401) {
          toast.error("Session expired. Please login again");
          await logOut();
         navigate("/login");
          return;
        }

        const data = await res.json(); 

        // 2. BLOCKED USER
        if (data?.isBlocked) {
          toast.error("You are blocked by admin");
          await logOut();
          navigate("/login");
          return;
        }

        return data;
      })
      .then((data) => {
        if (data) {
          setUsers(data.data);
        }
      });
  });

  // Filter users by email
  const filteredUsers = users?.filter((user) =>
    user.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleBlock = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/users/block/${id}`, {
        method: "PATCH",
        credentials: "include",
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again");
        await logOut();
        navigate("/login");
        return;
      }

      const data = await res.json();

      if (data?.success) {
        const updated = users?.map((user) =>
          user._id === id ? { ...user, isBlocked: true } : user,
        );
        setUsers(updated);
      }
    } catch (err) {
      toast.error(err);
      toast.error("Something went wrong!");
    }
  };

  const handleUnblock = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/users/unblock/${id}`, {
        method: "PATCH",
        credentials: "include",
      });

      //  1. AUTH logout
      if (res.status === 401) {
        toast.error("Session expired. Please login again");
        await logOut();
        navigate("/login");
        return;
      }

      const data = await res.json();

      // 2. Success check
      if (data.success) {
        toast.success("User unblocked successfully");

        const updated = users?.map((user) =>
          user._id === id ? { ...user, isBlocked: false } : user,
        );
        setUsers(updated);
      } else {
        toast.error(data.message || "Failed to unblock user");
      }
    } catch (error) {
      toast.error(error);
      toast.error("Something went wrong. Please try again");
    }
  };

  const handleRoleChange = (id, newRole) => {
    fetch(`http://localhost:5000/users/role/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ role: newRole }),
    })
      .then(async (res) => {
        const data = await res.json(); 

        if (res.status === 401) {
          toast.error("Session expired. Please login again");
          await logOut();
          navigate("/login");
          throw new Error("Unauthorized");
        }

        if (!res.ok) {
          // backend error message show
          toast.error(data?.message || "Something went wrong");
          throw new Error(data?.message || "Error");
        }

        return data;
      })
      .then((data) => {
        if (data?.success) {
          const updatedUsers = users?.map((user) =>
            user._id === id ? { ...user, role: newRole } : user,
          );
          setUsers(updatedUsers);

          // optional success message
          toast.success(data?.message || "Role updated successfully");
        } else {
          // backend validation message (manager/team member)
          toast(data?.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
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
            {filteredUsers?.map((user) => (
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
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
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

        {filteredUsers?.length === 0 && (
          <p className="text-center mt-4 text-(--text-secondary)">
            No users found
          </p>
        )}
      </div>
    </div>
  );
};

export default User_Administration;
