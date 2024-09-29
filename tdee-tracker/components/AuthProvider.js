import React, { createContext, useState, useEffect } from "react";
import { auth } from "../lib/authProviders";
import {
  login,
  logout,
  register,
  onAppleButtonPress,
  onGoogleButtonPress,
  onFacebookButtonPress,
  forgotPassword,
  deleteCurrentAuthRecord,
} from "../lib/firebase/authService";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          await currentUser.reload();
          if (!auth().currentUser) {
            setUser(null);
            await auth().signOut();
          } else {
            setUser(currentUser);
          }
        } catch (error) {
          console.log("Error reloading user", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });
    return subscriber;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login: (email, password) => login(email, password),
        register: (email, password) => register(email, password),
        logout: () => logout(user),
        onAppleButtonPress,
        onGoogleButtonPress,
        onFacebookButtonPress,
        forgotPassword,
        deleteCurrentAuthRecord: () => deleteCurrentAuthRecord(setUser),
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
