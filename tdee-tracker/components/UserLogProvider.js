import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebaseConfig';
import { collection, addDoc, query, where, onSnapshot, updateDoc, doc, orderBy} from 'firebase/firestore';
import { AuthContext } from './AuthProvider';
import { UserDataContext } from './UserDataProvider';

const UserLogContext = createContext();



const UserLogProvider = ({children}) => {
  const { user } = useContext(AuthContext);
  const { userData, updateUserData } = useContext(UserDataContext);
  const [userLogs, setUserLogs] = useState([]);
  const [weeklyLogs, setWeeklyLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && userData) {
      const logsQuery = query(collection(db, 'user-logs'), where('userId', '==', user.uid), orderBy('dateId', 'desc'));
      const unsubscribe = onSnapshot(logsQuery, (querySnapshot) => {
        const logs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const weeklyLogs = generateWeeklyLogs(logs);
        console.log('user logs loaded for', user.uid);
        setUserLogs(logs);
        setWeeklyLogs(weeklyLogs);
        setIsLoading(false);
      });
      return unsubscribe;
    } else {
      console.log('no user in log')
      setUserLogs([]);
      setIsLoading(false);
    }
  }, [user, userData]);

  const addUserLog = (log) => {
    if(user) {
      const logWithUserId = {...log, userId: user.uid, timestamp: new Date() };
      return addDoc(collection(db, 'user-logs'), logWithUserId)
        .then(() => {
          console.log(`log added by ${user.uid} containing ${log}`)
        })
        .catch((err) => {
          console.log(`error adding log for ${user.uid}`, err);
        });
    }
  }

  const updateUserLog = (changes, dateId) => {
    const docRef = doc(collection(db, 'user-logs'), userLogs.find(log => log.dateId === dateId).id);

    return updateDoc(docRef, changes)
      .then(() => {
        console.log(`log ${dateId} updated for ${user.uid} with ${JSON.stringify(changes)}`);
      })
      .catch(err => {
        console.log(`error updating log ${dateId} for ${user.uid}`, err);
      });
  };
  
  const generateWeeklyLogs = (logs) => {
    let data = [];
    
    for(let i = logs[logs.length-1].weekId, weekIndex = 0; i <= logs[0].weekId ; i++, weekIndex++){
      week = logs.filter(log => log.weekId === i && isValidNumber(log.calories) && isValidNumber(log.weight));
      data.push({
      title: `${getWeekFromWeekId(week[week.length-1].weekId+1)}`, 
      data: [{ 
        avgCalories: Math.floor(week.reduce((sum, log) => { return sum + log.calories/week.length}, 0 )),
        avgWeight: reduceAvgWeight(week).toFixed(2),
        weightDelta: parseFloat((data[weekIndex - 1] ? reduceAvgWeight(week) - data[weekIndex - 1].data[0].avgWeight : 0).toFixed(2)),
        weekId : week[0].weekId,
      }]
    });
    };
    data = data.map(({data, title}) => ({
      title: title,
      data: [{...data[0],
                  tdee: userData.weightUnits === 'lbs' ? 
                  (data[0].weightDelta * -1 * 500 + data[0].avgCalories
                  ):(
                  data[0].weightDelta * 2.20462 * 500 + data[0].avgCalories)
       }]
    }));
    return data;
  };

  const getWeekFromWeekId = (weekId) => {
    const sunday = new Date(weekId * 604800000 - 259200000);
    const monday = new Date(weekId * 604800000 - 259200000 - 518400000   );
    return `${monday.getFullYear()}${String(monday.getMonth()+1).padStart(2, 0)}${String(monday.getDate()).padStart(2, 0)} - ${sunday.getFullYear()}${String(sunday.getMonth()+1).padStart(2, 0)}${String(sunday.getDate()).padStart(2, 0)}`;
  };

  const isValidNumber = (num) => { 
    return typeof(num) === 'number' && !isNaN(num);
  };

  const reduceAvgWeight = (array) => {
    return array.reduce((sum, log) => { return sum + log.weight}, 0 )/array.length;
  };

  const updateUserTdeeAndWeightDelta = (logs) => {
    const tdee = Math.floor(logs.slice(0,logs.length-2).reduce((sum, log) => { return (sum + log.data[0].tdee) }, 0)/(logs.length-2));
    const weightDelta = logs.reduce((sum, log) => { return (sum + log.data[0].weightDelta) }, 0);
    updateUserData({currentTDEE: Math.round(tdee/50)*50, weightDelta: weightDelta});
  }

  
  
  return (
    <UserLogContext.Provider value={{ userLogs, isLoading, weeklyLogs, addUserLog, updateUserLog, updateUserTdeeAndWeightDelta }}>
      {children}
    </UserLogContext.Provider>
  );
}

export { UserLogContext, UserLogProvider };