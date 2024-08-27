import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthProvider";

import firestore from "@react-native-firebase/firestore";

import { showMessage } from "react-native-flash-message";

const UserDataContext = createContext();

const schema = {
  email: null,
  registrationComplete: null,
  createdAt: null,
  weightUnits: null,
  heightUnits: null,
  gender: null,
  startWeight: null,
  currentWeight: null,
  weeklyWeightDelta: null,
  dailyCalorieDelta: null,
  loseOrGain: null, //false = goal to lose weight, true = goal to gain weight
  goalWeight: null,
  age: null,
  activityLevel: null,
  height: null,
  currentTDEE: null,
  weightDelta: null,
};

const UserDataProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const subscriber = firestore()
        .collection("users")
        .doc(user.uid ? user.uid : null)
        .onSnapshot((docSnap) => {
          if (docSnap.exists) {
            setUserData(docSnap.data());
            console.log(`user data loaded in for ${user.uid}`);
          } else {
            console.log("no doc for user, creating new doc");
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

  const createUserDoc = (user) => {
    const { uid } = user;
    const userDocRef = firestore().collection("users").doc(uid);
    return userDocRef
      .set({
        ...schema,
        email: user.email,
        registrationComplete: false,
        createdAt: new Date(),
      })
      .then(() => {
        console.log(`doc created with ${user.email} and uid ${uid}`);
      })
      .catch((err) => {
        console.log("doc creation error", err);
        throw err;
      });
  };

  const updateUserData = (changes) => {
    const userDocRef = firestore().collection("users").doc(user.uid);

    return userDocRef
      .update(changes)
      .then(() => {
        console.log(
          `doc updated with ${JSON.stringify(changes)} for ${user.uid}`
        );
      })
      .catch((err) => {
        console.log("error updating doc", err);
      });
  };

  const isNumberWithinRange = (num, min, max, name) => {
    if (num <= max && num >= min) return true;
    else {
      showMessage({
        message: `${name} has to be a number between ${min} and ${max}.`,
        type: "danger",
        titleStyle:{textAlign: 'center', fontSize: 18},
        duration: 2000
      });
    }
  };

  const isInputValid = (value, min, max, name, nullOkay) => {
    if (nullOkay && !value) return true;
    return isNumberWithinRange(parseFloat(value), min, max, name) && value;
  };

  return (
    <UserDataContext.Provider
      value={{ userData, isLoading, updateUserData, isInputValid }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export { UserDataContext, UserDataProvider };
