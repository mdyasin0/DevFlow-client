import { useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";

import { AuthContext } from "./AuthContext";
import app from "./firebase.config";
import { socket } from "../Socket";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

const [dbUser, setDbUser] = useState(null);
const [roleLoading, setRoleLoading] = useState(true);
useEffect(() => {
  const fetchUserRole = async () => {
    if (user?.email) {
      setRoleLoading(true);

      try {
        const res = await fetch(
          `http://localhost:5000/user/${user.email}`
        );
        const data = await res.json();

        if (data.success) {
          setDbUser(data.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setRoleLoading(false);
      }
    } else {
      setDbUser(null);
      setRoleLoading(false);
    }
  };

  fetchUserRole();
}, [user]);
useEffect(() => {
  if (user?.email) {
    socket.connect(); // connect only when user আছে

    socket.emit("join", user.email); // room join

    console.log("Socket connected & joined:", user.email);
  }

  return () => {
    socket.disconnect(); // logout বা unmount হলে disconnect
  };
}, [user]);

useEffect(() => {
  socket.on("newNotification", (data) => {
    console.log("🔔 Notification:", data);
  });

  socket.on("taskUpdated", (data) => {
    console.log("⚡ Task updated:", data);
  });

  return () => {
    socket.off("newNotification");
    socket.off("taskUpdated");
  };
}, []);
  // 🔹 Register
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // 🔹 Login
  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // 🔹 Google Login
  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, provider);
  };

  // 🔹 Logout
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // 🔥 NEW: Update Profile System (IMPORTANT)
  const updateUserProfile = (name, photoURL) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL,
    }).then(() => {
      // refresh local user state
      setUser({
        ...auth.currentUser,
      });
    });
  };

  // 🔥 User state track
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signInUser,
    googleLogin,
    logOut,
    updateUserProfile, // 🔥 added here
     role: dbUser?.role,
       roleLoading,
         dbUser, 
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;