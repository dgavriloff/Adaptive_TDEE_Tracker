import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import { UserDataContext } from "./UserDataProvider";

import firestore from "@react-native-firebase/firestore";

const UserLogContext = createContext();

const UserLogProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { userData, updateUserData } = useContext(UserDataContext); //
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
        setIsLoading(false);
        updateUserData({ currentWeight: userLogs[0].weight? userLogs[0].weight : null });
      });
      return unsubscribe;
    } else {
      console.log("no user in log");
      setUserLogs([]);
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (weeklyLogs.length === 0 && userLogs[0] && userData)
      setWeeklyLogs(generateWeeklyLogs(userLogs));
  }, [userData]);

  useEffect(() => {
    if (user && userLogs[0] && userData) {
      setWeeklyLogs(generateWeeklyLogs(userLogs));
    }
  }, [userLogs, user]);

  const addUserLog = (log) => {
    /*
  log = {
    dateId: string,
    calories: number,
    weight: number
    weekId: number
  }

    */
    if (user) {
      const logWithUserId = { ...log, userId: user.uid, timestamp: new Date() };
      return firestore()
        .collection("user-logs")
        .add(logWithUserId)
        .then(() => {
          console.log(
            `log added by ${user.uid} containing ${JSON.stringify(log)}`
          );
        })
        .catch((err) => {
          console.log(`error adding log for ${user.uid}`, err);
        });
    }
  };

  const setMultipleUserLogs = (newLogs) => {
    const batch = firestore().batch();
    newLogs.forEach((newLog, index) => {
      const docRef = firestore()
        .collection("user-logs")
        .doc(`log-${user.uid}-${index}`);
      batch.set(docRef, {
        ...newLog,
        userId: user.uid,
        timestamp: new Date(),
      });
    });

    return batch
      .commit()
      .then(() => {
        console.log("Batch write successfully committed");
      })
      .catch((err) => {
        console.log("error committing batch write", err); //
      });
  };

  const updateUserLog = (changes, dateId) => {
    const docRef = firestore()
      .collection("user-logs")
      .doc(userLogs.find((log) => log.dateId === dateId).id);

    setIsLoading(true);

    return docRef
      .update(changes)
      .then(() => {
        console.log(
          `log ${dateId} updated for ${user.uid} with ${JSON.stringify(
            changes
          )}`
        );
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(`error updating log ${dateId} for ${user.uid}`, err);
        setIsLoading(false);
      });
  };

  const generateWeeklyLogs = (logs) => {
    let data = [];

    for (
      let i = logs[logs.length - 1].weekId, weekIndex = 0;
      i <= logs[0].weekId;
      i++, weekIndex++
    ) {
      week = logs.filter(
        (log) =>
          log.weekId === i &&
          isValidNumber(log.calories) &&
          isValidNumber(log.weight)
      );
      if (week[0])
        data.push({
          title: `${getWeekFromWeekId(week[week.length - 1].weekId + 1)}`,
          data: [
            {
              avgCalories: Math.floor(
                week.reduce((sum, log) => {
                  return sum + log.calories / week.length;
                }, 0)
              ),
              avgWeight: reduceAvgWeight(week).toFixed(2),
              weightDelta: parseFloat(
                (data[weekIndex - 1]
                  ? reduceAvgWeight(week) -
                    data[weekIndex - 1].data[0].avgWeight
                  : 0
                ).toFixed(2)
              ),
              weekId: week[0].weekId,
            },
          ],
        });
    }
    data = data.map(({ data, title }) => ({
      title: title,
      data: [
        {
          ...data[0],
          tdee:
            userData.weightUnits === "lbs"
              ? data[0].weightDelta * -1 * 500 + data[0].avgCalories
              : data[0].weightDelta * -2.20462 * 500 + data[0].avgCalories,
        },
      ],
    }));
    updateUserTdeeAndWeightDelta(data);
    console.log("weekly logs generated");
    return data;
  };

  const getWeekFromWeekId = (weekId) => {
    const sunday = new Date(weekId * 604800000 - 259200000);
    const monday = new Date(weekId * 604800000 - 259200000 - 518400000);
    return `${monday.getFullYear()}${String(monday.getMonth() + 1).padStart(
      2,
      0
    )}${String(monday.getDate()).padStart(
      2,
      0
    )} - ${sunday.getFullYear()}${String(sunday.getMonth() + 1).padStart(
      2,
      0
    )}${String(sunday.getDate()).padStart(2, 0)}`;
  };

  const isValidNumber = (num) => {
    return typeof num === "number" && !isNaN(num);
  };

  const reduceAvgWeight = (array) => {
    return (
      array.reduce((sum, log) => {
        return sum + log.weight;
      }, 0) / array.length
    );
  };

  const updateUserTdeeAndWeightDelta = (logs) => {
    const tdee = Math.floor(
      logs.slice(0, logs.length - 2).reduce((sum, log) => {
        return sum + log.data[0].tdee;
      }, 0) /
        (logs.length - 2)
    );
    const weightDelta = logs.reduce((sum, log) => {
      return sum + log.data[0].weightDelta;
    }, 0);
    const shownTdee =
      weeklyLogs.length > 2
        ? Math.round(tdee / 50) * 50
        : Math.round(userData.calculatedTDEE / 50) * 50;
    updateUserData({
      currentTDEE: shownTdee,
      weightDelta: parseFloat(weightDelta.toFixed(2)),
    });
  };

  const getWeekIdFromDateId = (dateId) => {
    return Math.floor(
      (getDateFromDateId(dateId).getTime() + 259200000) / 604800000
    );
  };

  const getDateFromDateId = (dateId) => {
    return new Date(
      dateId.slice(0, 4),
      parseInt(dateId.slice(4, 6)) - 1,
      parseInt(dateId.slice(6, 8)),
      0,
      0,
      0,
      0
    );
  };

  const getDateIdFormat = (date) => {
    return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(
      2,
      0
    )}${String(date.getDate()).padStart(2, 0)}`;
  };

  const getRangedData = (rangeInDays) => {
    return graphData
      .slice(-rangeInDays)
      .map((log, index) => ({ y: log.y, x: index, meta: log.meta }));
  };

  //returns array of data with first index being the oldest entry and with no NaN weights
  const cleanGraphData = (userLogs) => {
    if (userLogs[0]) {
      const cleanData = removeGarbageData(userLogs.toReversed());
      const completeData = replaceGarbageData(
        cleanData,
        cleanData[0].weight,
        1
      );
      //console.log(userLogs.map(log => ({x: log.weight, y: log.dateId})))
      return completeData;
    }
  };

  //replaces chunks of missing data for continuity in graph
  const replaceGarbageData = (data, placeholder, index) => {
    if (index >= data.length) return data;
    if (isNaN(data[index].weight)) {
      data[index].weight = placeholder;
      return replaceGarbageData(data, placeholder, ++index);
    } else return replaceGarbageData(data, data[index].weight, ++index);
  };
  //removes chunks of missing data at beginning of dataset
  const removeGarbageData = (data) => {
    if (isNaN(data[0]?.weight) && data[0]) {
      return removeGarbageData(data.slice(1));
    }
    return data;
  };

  function fillMissingData(logs) {
    if (!logs) return [];
    // Helper to format dateId into MM/DD
    const formatDate = (dateId) => {
      return dateId;
    };

    // Helper to get the next day in YYYYMMDD format
    const getNextDay = (dateId) => {
      const date = getDateFromDateId(dateId);
      date.setDate(date.getDate() + 1);
      return date.toISOString().slice(0, 10).replace(/-/g, "");
    };

    // Helper to get the current date in YYYYMMDD format
    const getCurrentDateId = () => {
      return getDateIdFormat(new Date());
    };

    // Sort the logs by dateId
    logs.sort((a, b) => a.dateId.localeCompare(b.dateId));

    // Initialize output array and last known weight
    const result = [];
    let lastWeight = logs[0]?.weight || null;
    let index = 0;

    // Start from the first dateId
    let currentDateId = logs[0].dateId;
    const endDateId = getCurrentDateId(); // Set to the current date

    let i = 0;
    while (currentDateId <= endDateId) {
      // If the current log matches the dateId, use its weight
      if (logs[i] && logs[i].dateId === currentDateId) {
        lastWeight = logs[i].weight; // Update last known weight
        result.push({
          x: index,
          y: logs[i].weight,
          meta: formatDate(logs[i].dateId),
        });
        //console.log(lastWeight, logs[i], result[result.length-1], currentDateId)
        i++; //
      } else {
        // Use the last known weight for missing dates
        result.push({
          x: index,
          y: lastWeight,
          meta: formatDate(currentDateId),
        });
        //console.log(lastWeight, logs[i], result[result.length-1], currentDateId)
      }
      // Move to the next date and increment index
      currentDateId = getNextDay(currentDateId);
      index++;
      //console.log(result);
      // Break the loop if we pass the endDateId to prevent infinite loop
      if (currentDateId > endDateId) {
        break;
      }
    }
    //console.log(result)
    return result;
  }

  return (
    <UserLogContext.Provider
      value={{
        userLogs,
        isLoading,
        weeklyLogs,
        addUserLog,
        updateUserLog,
        updateUserTdeeAndWeightDelta,
        getWeekIdFromDateId,
        getDateIdFormat,
        setMultipleUserLogs,
        getDateFromDateId,
        getRangedData,
        graphData,
      }}
    >
      {children}
    </UserLogContext.Provider>
  );
};

export { UserLogContext, UserLogProvider };
