import React, { createContext, useState, useEffect, useContext } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { auth} from '../config/firebaseConfig';

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
      .then(() => {
        console.log(`${email} has signed in`);
      })
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
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(`account created and signed in as ${userCredential.user.email}`);
    })
      .catch(err => {
      console.log('register error', err);
      throw err;
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider};