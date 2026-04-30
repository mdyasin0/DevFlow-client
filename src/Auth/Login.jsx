import React, { useContext, useState } from "react";
import { Link } from "react-router";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { AuthContext } from "../Firebase/AuthContext";
import Swal from "sweetalert2";

const Login = () => {
  const { signInUser, googleLogin , logOut } = useContext(AuthContext);
  const [showPass, setShowPass] = useState(false);


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
  const handleLogin = async (e) => {
  e.preventDefault();

  const form = e.target;
  const email = form.email.value;
  const password = form.password.value;

  try {
    await signInUser(email, password);

    const blocked = await checkIfBlocked(email);

    if (blocked) {
      await logOut(); // 🔥 IMPORTANT
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Login Successful!",
      timer: 2000,
      showConfirmButton: false,
    });

  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: err.message,
    });
  }
};

const handleGoogle = () => {
  googleLogin()
    .then(async (res) => {
      const user = res.user;

      const blocked = await checkIfBlocked(user.email);

      if (blocked) {
        await logOut(); // 🔥 FORCE LOGOUT
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
        title: "Logged in with Google!",
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
          Welcome Back 👋
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">

          <input name="email" type="email" placeholder="Email"
            className="w-full p-3 rounded-lg bg-(--bg-secondary) border border-(--border)" required />

          <div className="relative">
            <input
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-(--bg-secondary) border border-(--border)"
              required
            />
            <span onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 cursor-pointer">
              {showPass ? <FaEyeSlash className="text-(--text-secondary)" /> : <FaEye  className="text-(--text-secondary)"/>}
            </span>
          </div>

          <button className="w-full py-3 rounded-lg text-white bg-(--primary)">
            Login
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
          No account? <Link to="/register" className="text-(--primary)">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;