import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../Firebase/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const Profile = () => {
  const { user, updateUserProfile, logOut } = useContext(AuthContext);

  const [name, setName] = useState(() => user?.displayName || "");
  const [photo, setPhoto] = useState(() => user?.photoURL || "");
  const [imageUrl, setImageUrl] = useState(() => user?.photoURL || "");
const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);

  //  Image upload function
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      "https://api.imgbb.com/1/upload?key=c0c2b847b1b59290ac14668dd140a262",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();

    return data.data.url;
  };

  //  Handle image upload (NO SWEET ALERT)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const url = await uploadImage(file);
      setPhoto(url);
      setImageUrl(url);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.message,
      });
    } finally {
      setUploading(false);
    }
  };

  // Update profile
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (uploading || updating) return; // prevent double click

    setUpdating(true);

    try {
      // Firebase update
      await updateUserProfile(name, imageUrl);

      // MongoDB update
      const res = await fetch(`https://devflow-server-s7bh.onrender.com/users/${user.email}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          photo: imageUrl,
        }),
      });
      const data = await res.json();
      //  1. AUTH logout
      if (res.status === 401) {
        toast.warn("Session expired. Please login again");
        await logOut();
       navigate("/login");
        return;
      }
      // 2. BLOCKED USER
      if (data?.isBlocked) {
        toast.warn("You are blocked by admin");
        await logOut();
       navigate("/login"); 
        return;
      }
      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.message,
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-(--bg) text-(--text)">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl p-4 sm:p-6 lg:p-8 rounded-2xl border border-(--border) bg-(--card) shadow-lg">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">
          My Profile
        </h2>

        {/* PROFILE IMAGE */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={photo || "https://i.pravatar.cc/100"}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-(--border) object-cover"
            alt="profile"
          />

          <p className="text-xs sm:text-sm mt-2 text-(--text-secondary) break-all text-center">
            {user?.email}
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="mt-3 text-xs sm:text-sm w-full max-w-xs"
          />

          {uploading && (
            <p className="text-xs text-yellow-500 mt-1 text-center">
              Image uploading...
            </p>
          )}
        </div>

        {/* FORM */}
        <form onSubmit={handleUpdate} className="space-y-3 sm:space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2.5 sm:p-3 text-sm sm:text-base rounded-lg bg-(--bg-secondary) border border-(--border)"
            placeholder="Your name"
          />

          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-2.5 sm:p-3 text-sm sm:text-base rounded-lg bg-(--bg-secondary) border border-(--border)"
            placeholder="Image URL"
          />

          <button
            disabled={uploading || updating}
            className={`w-full py-2.5 sm:py-3 text-sm sm:text-base rounded-lg text-white bg-(--primary) transition ${
              uploading || updating
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-90"
            }`}
          >
            {uploading
              ? "Uploading Image..."
              : updating
                ? "Updating Profile..."
                : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
