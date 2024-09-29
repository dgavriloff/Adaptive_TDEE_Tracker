import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import { UserDataContext } from "./UserDataProvider";
import {
  addUserLog,
  setMultipleUserLogs,
  updateUserLog,
  updateUserTdeeAndWeightDelta,
  deleteUserLogs,
  getSpecificLog,
} from "../lib/firebase/firestoreService";
import {
  calculateTdee,
  calculateWeeklyWeightDelta,
  generateWeeklyLogs,
  getAverageCalories,
  posOrNeg,
} from "../lib/utils/logUtils";

import {
  getDateFromDateId,
  getDateIdFormat,
  getWeekIdFromDateId,
} from "../lib/utils/dateUtils";

import {
  fillMissingData,
  cleanGraphData,
  getRangedData,
  createRange,
} from "../lib/utils/graphUtils";

import firestore from "@react-native-firebase/firestore";

const UserLogContext = createContext();

const UserLogProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { userData, updateUserData } = useContext(UserDataContext);
  const [userLogs, setUserLogs] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [weeklyLogs, setWeeklyLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const logsQuery = firestore()
        .collection("user-logs")
        .where("userId", "==", user.uid)
        .orderBy("dateId", "desc");

      const unsubscribe = logsQuery.onSnapshot((querySnapshot) => {
        const logs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("user logs loaded for", user.uid);
        setUserLogs(logs);
        setGraphData(fillMissingData(cleanGraphData(logs)));
        logs[0] &&
          updateUserData({
            currentWeight: userLogs[0] ? userLogs[0].weight : logs[0].weight,
          });
        setIsLoading(false);
      });
      return unsubscribe;
    } else {
      console.log("no user in log");
      setUserLogs([]);
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (weeklyLogs.length === 0 && userLogs[0] && userData) {
      setWeeklyLogs(generateWeeklyLogs(userLogs), userData.weightUnits);
      updateUserData({
        currentTDEE: calculateTdee(weeklyLogs),
        weightDelta: calculateWeeklyWeightDelta(weeklyLogs).toFixed(2),
      });
    }
  }, [userData]);

  useEffect(() => {
    if (user && userLogs[0] && userData) {
      setWeeklyLogs(generateWeeklyLogs(userLogs, userData.weightUnits));
      updateUserData({
        currentTDEE: calculateTdee(weeklyLogs),
        weightDelta: calculateWeeklyWeightDelta(weeklyLogs).toFixed(2),
      });
    }
  }, [userLogs, user]);

  return (
    <UserLogContext.Provider
      value={{
        userLogs,
        isLoading,
        weeklyLogs,
        addUserLog: (log) => addUserLog(log, user),
        updateUserLog: (changes, dateId) =>
          updateUserLog(changes, getSpecificLog(userLogs, dateId)),
        updateUserTdeeAndWeightDelta,
        getWeekIdFromDateId,
        getDateIdFormat,
        setMultipleUserLogs,
        getDateFromDateId,
        getRangedData: (rangeInDays) => getRangedData(rangeInDays, graphData),
        graphData,
        getAverageCalories: () => getAverageCalories(weeklyLogs),
        posOrNeg,
        createRange,
        deleteUserLogs,
      }}
    >
      {children}
    </UserLogContext.Provider>
  );
};

export { UserLogContext, UserLogProvider };
