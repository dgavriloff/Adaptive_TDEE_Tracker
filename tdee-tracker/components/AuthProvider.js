import React, { createContext, useState, useEffect} from "react";

import auth from '@react-native-firebase/auth'

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });
    return subscriber;
  }, [])

  const login = (email, password) => {
    return auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log(`${email} has signed in`);
      })
      .catch((err) => {
        console.error("login error", err.code);
        throw err;
      });
  };

  const logout = () => {
    return auth().signOut()
      .then(() => console.log(`${user.email} has signed out`))
      .catch((err) => {
        console.log("logout error", err);
        throw err;
      });
  };

  const register = (email, password) => {
    return auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log(
          `account created and signed in as ${userCredential.user.email}`
        );
      })
      .catch((err) => {
        console.log("register error", err);
        throw err;
      });
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
