import { useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

import { AuthContext } from "./AuthContext";
import app from "./firebase.config";
import { socket } from "../Socket";
import { toast } from "react-toastify";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenLoading, setTokenLoading] = useState(true);
  const [dbUser, setDbUser] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  const getJwtToken = async (email) => {
    const res = await fetch("https://devflow-server-s7bh.onrender.com/jwt", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!data.success) throw new Error("JWT failed");

    return true; 
  };
  //  Logout
  const logOut = async () => {
    setLoading(true);

    try {
      await fetch("https://devflow-server-s7bh.onrender.com/logout", {
        method: "POST",
        credentials: "include",
      });

      await signOut(auth);

      setUser(null);
      setDbUser(null);
      setTokenLoading(false);
      setRoleLoading(false);

      socket.disconnect();
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRole = async (email) => {
    if (!email) return;

    setRoleLoading(true);

    try {
      const res = await fetch(`https://devflow-server-s7bh.onrender.com/user/${email}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        setDbUser(data.data);
      } else {
        toast.warn(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRoleLoading(false);
    }
  };
  useEffect(() => {
    if (!dbUser?._id) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join", dbUser._id);

    return () => {
      socket.disconnect();
    };
  }, [dbUser?._id]);

  useEffect(() => {
    socket.on("newNotification");

    socket.on("taskUpdated");

    return () => {
      socket.off("newNotification");
      socket.off("taskUpdated");
    };
  }, []);
  //  Register
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  //  Login
  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  //  Google Login
  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, provider);
  };

  //  NEW: Update Profile System (IMPORTANT)
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

  //  User state track
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser?.email) {
        setDbUser(null);
        setTokenLoading(false);
        setRoleLoading(false);
        setLoading(false);
        return;
      }

      setTokenLoading(true);
      setRoleLoading(true);
      setLoading(true);

      try {
        await getJwtToken(currentUser.email);
        await fetchUserRole(currentUser.email);
      } catch (err) {
        toast.error(err);
      }

      setTokenLoading(false);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  useEffect(() => {
    if (user?.email && !tokenLoading) {
      fetch("https://devflow-server-s7bh.onrender.com/users", {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
        }),
      });
    }
  }, [user?.email, tokenLoading]);
  const authReady = loading || tokenLoading || roleLoading;
  const authInfo = {
    user,
    loading,
    tokenLoading,
    createUser,
    signInUser,
    authReady,
    googleLogin,
    logOut,
    updateUserProfile, //  added here
    role: dbUser?.role,
    roleLoading,
    dbUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
