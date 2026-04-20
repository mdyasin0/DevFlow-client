import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../Firebase/AuthContext";

const Profile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);

  // ✅ SAFE INITIAL STATE (no useEffect needed)
  const [name, setName] = useState(() => user?.displayName || "");
  const [photo, setPhoto] = useState(() => user?.photoURL || "");
  const [loading, setLoading] = useState(false);

  // 🔥 ImgBB upload
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

  // 📸 image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      const url = await uploadImage(file);
      setPhoto(url);

      Swal.fire({
        icon: "success",
        title: "Image Uploaded!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.message,
      });
    }

    setLoading(false);
  };

  // 🔥 update profile
  const handleUpdate = (e) => {
    e.preventDefault();

    updateUserProfile(name, photo)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Profile Updated!",
          timer: 2000,
          showConfirmButton: false,
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: err.message,
        });
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--bg) text-(--text)">

      <div className="w-full max-w-md p-6 rounded-2xl border border-(--border) bg-(--card) shadow-lg">

        <h2 className="text-2xl font-bold mb-4">My Profile</h2>

        {/* PROFILE */}
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
            className="mt-3 text-sm"
          />

          {loading && (
            <p className="text-xs text-(--text-secondary)">Uploading...</p>
          )}
        </div>

        {/* FORM */}
        <form onSubmit={handleUpdate} className="space-y-4">

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg bg-(--bg-secondary) border border-(--border)"
          />

          <input
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            className="w-full p-3 rounded-lg bg-(--bg-secondary) border border-(--border)"
          />

          <button className="w-full py-3 rounded-lg bg-(--primary) text-white">
            Update Profile
          </button>

        </form>

      </div>
    </div>
  );
};

export default Profile;