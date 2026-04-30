import React, { useContext, useState } from "react";
import { Link } from "react-router";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../Firebase/AuthContext";

const Register = () => {
  const { createUser, googleLogin, logOut, updateUserProfile } =
    useContext(AuthContext);

  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false); // register loading
  const [googleLoading, setGoogleLoading] = useState(false);
  const [uploading, setUploading] = useState(false); // ⭐ image upload state
  const [photoURL, setPhotoURL] = useState(""); // store uploaded image

  
const checkIfBlocked = async (email) => {
  try {
    const res = await fetch(`http://localhost:5000/users/${email}`);
    const data = await res.json();

    if (!data.success) return false;

    if (data.data.isBlocked) {
      Swal.fire({
        icon: "error",
        title: "You are blocked",
        text: "Contact admin",
      });

      return true; // blocked
    }

    return false; // not blocked
  } catch (err) {
    console.log(err.message);
    return false;
  }
};
  // 📸 IMAGE UPLOAD
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        "https://api.imgbb.com/1/upload?key=c0c2b847b1b59290ac14668dd140a262",
        {
          method: "POST",
          body: formData,
        }
      );

      const imgData = await res.json();
      setPhotoURL(imgData.data.url);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Image Upload Failed",
        text: err.message,
      });
    } finally {
      setUploading(false);
    }
  };

  // 🧠 REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading || uploading) return; // 🚫 block if uploading

    if (!photoURL) {
      Swal.fire({
        icon: "warning",
        title: "Please wait",
        text: "Image is still uploading...",
      });
      return;
    }

    setLoading(true);

    const form = e.target;

    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await createUser(email, password);
      await updateUserProfile(name, photoURL);

      await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role: "developer" }),
      });

      Swal.fire({
        icon: "success",
        title: "Account Created!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔵 GOOGLE LOGIN
  const handleGoogle = () => {
    if (googleLoading) return;
    setGoogleLoading(true);

    googleLogin()
      .then(async (res) => {

        const user = res.user;

      const blocked = await checkIfBlocked(user.email);

      if (blocked) {
        // 🚨 FORCE LOGOUT
   
        await logOut(); // IMPORTANT (Firebase logout)

        setGoogleLoading(false);
        return;
      }
        await fetch("http://localhost:5000/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.displayName,
            email: user.email,
            role: "developer",
          }),
        });

        Swal.fire({
          icon: "success",
          title: "Logged in!",
          timer: 2000,
          showConfirmButton: false,
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Google Login Failed",
          text: err.message,
        });
      })
      .finally(() => setGoogleLoading(false));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--bg)">
      <div className="w-full max-w-md p-6 rounded-2xl shadow-lg bg-(--card) border border-(--border)">
        <h2 className="text-2xl font-bold text-(--text) mb-2">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded-lg border border-(--border)"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg border border-(--border)"
            required
          />

          <div className="relative">
            <input
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 rounded-lg border border-(--border)"
              required
            />

            <span
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-3 cursor-pointer"
            >
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* 📸 IMAGE INPUT */}
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-3 rounded-lg border border-(--border)"
            disabled={uploading}
            required
          />

          {/* 🔥 Upload status */}
          {uploading && (
            <p className="text-sm text-yellow-500">
              ⏳ Image uploading... please wait
            </p>
          )}

          <button
            disabled={loading || uploading || !photoURL}
            className={`w-full py-3 rounded-lg text-white bg-(--primary) ${
              loading || uploading || !photoURL
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {uploading
              ? "Uploading Image..."
              : loading
              ? "Creating Account..."
              : "Register"}
          </button>
        </form>

        <div className="my-4 text-center text-(--text-secondary)">OR</div>

        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg border ${
            googleLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FaGoogle />
          {googleLoading ? "Processing..." : "Continue with Google"}
        </button>

        <p className="text-sm mt-4 text-(--text-secondary)">
          Already have account?{" "}
          <Link to="/login" className="text-(--primary)">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;