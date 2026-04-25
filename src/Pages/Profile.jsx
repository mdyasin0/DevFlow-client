import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../Firebase/AuthContext";

const Profile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);

  const [name, setName] = useState(() => user?.displayName || "");
  const [photo, setPhoto] = useState(() => user?.photoURL || "");
  const [imageUrl, setImageUrl] = useState(() => user?.photoURL || "");

  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // 🔥 Image upload function
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      "https://api.imgbb.com/1/upload?key=c0c2b847b1b59290ac14668dd140a262",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.data.url;
  };

  // 📸 Handle image upload (NO SWEET ALERT)
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

  // 🔥 Update profile
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (uploading || updating) return; // prevent double click

    setUpdating(true);

    try {
      // Firebase update
      await updateUserProfile(name, imageUrl);

      // MongoDB update
      await fetch(`http://localhost:5000/users/${user.email}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          photo: imageUrl,
        }),
      });

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
    <div className="min-h-screen flex items-center justify-center bg-(--bg) text-(--text)">
      <div className="w-full max-w-md p-6 rounded-2xl border border-(--border) bg-(--card) shadow-lg">

        <h2 className="text-2xl font-bold mb-4">My Profile</h2>

        {/* PROFILE IMAGE */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={photo || "https://i.pravatar.cc/100"}
            className="w-24 h-24 rounded-full border border-(--border)"
            alt="profile"
          />

          <p className="text-sm mt-2 text-(--text-secondary)">
            {user?.email}
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="mt-3 text-sm"
          />

          {uploading && (
            <p className="text-xs text-yellow-500 mt-1">
              ⏳ Image uploading...
            </p>
          )}
        </div>

        {/* FORM */}
        <form onSubmit={handleUpdate} className="space-y-4">

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg bg-(--bg-secondary) border border-(--border)"
            placeholder="Your name"
          />

          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-3 rounded-lg bg-(--bg-secondary) border border-(--border)"
            placeholder="Image URL"
          />

          <button
            disabled={uploading || updating}
            className={`w-full py-3 rounded-lg text-white bg-(--primary) ${
              uploading || updating ? "opacity-50 cursor-not-allowed" : ""
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