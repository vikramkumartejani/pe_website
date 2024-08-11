import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import auth from "../firebase/firebase.config";
import checkEmail from "../utils/checkEmail";
import displayError from "../utils/displayError";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithPassword = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const updateInfo = (user, profile) => {
    Object.assign(user, profile);
    return updateProfile(user, profile);
  };

  const passwordReset = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      //   console.log("currentUser ", currentUser);

      if (currentUser) {
        if (!currentUser.emailVerified) {
          console.log("currentUser ", currentUser);
          sendEmailVerification(currentUser)
            .then(() => {
              checkEmail(currentUser.email, "to verify your email");
              signOut(auth)
                .then(() => {
                  console.log("user not verified");
                })
                .catch((err) => {
                  console.log(err.message);
                  displayError(err);
                });
            })
            .catch((err) => {
              console.log(err.message);
              displayError(err);
            });
        } else {
          setUser(currentUser);
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => {
      unSubscribe();
    };
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signInWithPassword,
    updateInfo,
    logOut,
    passwordReset,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
