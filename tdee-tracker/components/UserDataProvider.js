import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { createUserDoc, updateUserData, deleteUserDoc, firestore } from "../lib/firebase/firestoreService";
import { isInputValid } from "../lib/utils/validation";
import { calculateGoalDate } from "../lib/utils/calculateGoalDate";

const UserDataContext = createContext();

const UserDataProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const subscriber = firestore()
        .collection("users")
        .doc(user.uid)
        .onSnapshot((docSnap) => {
          if (docSnap.exists) {
            setUserData(docSnap.data());
            console.log(`user data loaded in for ${user.uid}`);
          } else {
            createUserDoc(user);
          }
          setIsLoading(false);
        });
      return subscriber;
    } else {
      setUserData(null);
      setIsLoading(false);
    }
  }, [user]);

  return (
    <UserDataContext.Provider
      value={{
        userData,
        isLoading,
        updateUserData : (changes) => updateUserData(user, changes),
        isInputValid,
        calculateGoalDate,
        deleteUserDoc,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export { UserDataContext, UserDataProvider };
