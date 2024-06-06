import React, { createContext, useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig'

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) => { 
      signInWithEmailAndPassword(auth, email, password)
      .then(() => console.log(`${email} has signed in`))
      .catch(err => {
        console.error('login error', err);
        throw err;
      });
  };

  const logout = () => {
    signOut(auth)
      .then(() => console.log(`${user.email} has signed out`))
      .catch(err => {
        console.log('logout error', err);
        throw err;
      })
  }

  const register = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => console.log(`account created with ${email}`))
      .catch(err => {
        console.log('register error', err);
        throw err;
      })
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider};