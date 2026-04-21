import React, { useContext, useState } from "react";
import { Link } from "react-router";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

import Swal from "sweetalert2";
import { AuthContext } from "../Firebase/AuthContext";

const Register = () => {
  const { createUser, googleLogin, updateUserProfile } =
    useContext(AuthContext);
  const [showPass, setShowPass] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;

    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const image = form.image.files[0];

    // 🔥 1. Upload image to ImgBB
    const formData = new FormData();
    formData.append("image", image);

    const res = await fetch(
      "https://api.imgbb.com/1/upload?key=c0c2b847b1b59290ac14668dd140a262",
      {
        method: "POST",
        body: formData,
      },
    );

    const imgData = await res.json();
    const photoURL = imgData.data.url;

    // 🔥 2. Create user
    createUser(email, password)
      .then(async (res) => {
        const user = res.user;

        // 🔥 3. Update profile with name + image
        await updateUserProfile(name, photoURL);
        // 🔥 SAVE TO BACKEND
        await fetch("http://localhost:5000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            role: "developer",
          }),
        });
        Swal.fire({
          icon: "success",
          title: "Account Created!",
          text: "Welcome to DevFlow 🚀",
          timer: 2000,
          showConfirmButton: false,
        });

        console.log("User:", user);
        console.log("Photo:", photoURL);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: err.message,
        });
      });
  };

  const handleGoogle = () => {
    googleLogin()
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Logged in with Google!",
          text: "Welcome to DevFlow 🚀",
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
      });
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
            className="w-full p-3 rounded-lg bg-(--card) border border-(--border) text-(--text) placeholder:text-(--text-secondary) focus:outline-none focus:ring-2 focus:ring-(--primary)"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-(--card) border border-(--border) text-(--text) placeholder:text-(--text-secondary) focus:outline-none focus:ring-2 focus:ring-(--primary)"
            required
          />

          <div className="relative">
            <input
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-(--card) border border-(--border) text-(--text) placeholder:text-(--text-secondary) focus:outline-none focus:ring-2 focus:ring-(--primary)"
              required
            />
            <span
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-3 cursor-pointer"
            >
              {showPass ? (
                <FaEyeSlash className="text-(--text-secondary)" />
              ) : (
                <FaEye className="text-(--text-secondary)" />
              )}
            </span>
          </div>
          <input
            name="image"
            type="file"
            accept="image/*"
            className="w-full p-3 rounded-lg bg-(--card) border border-(--border) text-(--text)"
            required
          />
          <button className="w-full py-3 rounded-lg text-white bg-(--primary)">
            Register
          </button>
        </form>

        <div className="my-4 text-center text-(--text-secondary)">OR</div>

        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-(--border)  p-3  bg-(--card)  text-(--text) placeholder:text-(--text-secondary) focus:outline-none focus:ring-2 focus:ring-(--primary)"
        >
          <FaGoogle /> Continue with Google
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
