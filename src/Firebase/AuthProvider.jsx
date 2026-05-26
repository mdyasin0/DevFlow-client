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

const getJwtToken = async (email) => {
  try {
    const res = await fetch("https://devflow-server-777f.onrender.com/jwt", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include", //  MUST
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    alert( error);
  }
}; 
  // 🔹 Logout
  const logOut = () => {
    setLoading(true);
   fetch("https://devflow-server-777f.onrender.com/logout", {
    method: "POST",
    credentials: "include",
  });
    socket.disconnect();
    return signOut(auth);
  };

useEffect(() => {
  const fetchUserRole = async () => {
    if (user?.email) {
      setRoleLoading(true);

      try {
        const res = await fetch(
          `https://devflow-server-777f.onrender.com/user/${user.email}`
        );
        
        const data = await res.json();

        if (data.success) {
          setDbUser(data.data);
        }
      } catch (err) {
        alert(err);
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

    if (currentUser?.email) {
      //  JWT CREATE
      await getJwtToken(currentUser.email);
    } else {
      //  if  logout  token remove
    
      
    }

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
    updateUserProfile, //  added here
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