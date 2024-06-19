import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebaseConfig';
import { collection, addDoc, query, where, onSnapshot, updateDoc, doc, orderBy} from 'firebase/firestore';
import { AuthContext } from './AuthProvider';
import { UserDataContext } from './UserDataProvider';
import { NavigationContext } from '@react-navigation/native';

const UserLogContext = createContext();



const UserLogProvider = ({children}) => {
  const { user } = useContext(AuthContext);
  const { userData, updateUserData, isLoading:dataLoading } = useContext(UserDataContext);
  const [userLogs, setUserLogs] = useState([]);
  const [weeklyLogs, setWeeklyLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (user) {
      const logsQuery = query(collection(db, 'user-logs'), where('userId', '==', user.uid), orderBy('dateId', 'desc'));
      const unsubscribe = onSnapshot(logsQuery, (querySnapshot) => {
        const logs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('user logs loaded for', user.uid);
        setUserLogs(logs);
        setIsLoading(false);
      
      });
      return unsubscribe;
    } else {
      console.log('no user in log')
      setUserLogs([]);
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if(weeklyLogs.length === 0 && userLogs[0] && userData)
      setWeeklyLogs(generateWeeklyLogs(userLogs));
  }, [userData]);
  
  useEffect(() => {
      if(user && userLogs[0] && userData){
        setWeeklyLogs(generateWeeklyLogs(userLogs));
      }
  }, [userLogs, user]);

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
    setIsLoading(true);

    return updateDoc(docRef, changes)
      .then(() => {
        console.log(`log ${dateId} updated for ${user.uid} with ${JSON.stringify(changes)}`);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(`error updating log ${dateId} for ${user.uid}`, err);
        setIsLoading(false);
      });
      
  };
  
  const generateWeeklyLogs = (logs) => {
    let data = [];
    
    for(let i = logs[logs.length-1].weekId, weekIndex = 0; i <= logs[0].weekId ; i++, weekIndex++){
      week = logs.filter(log => log.weekId === i && isValidNumber(log.calories) && isValidNumber(log.weight));
      if(week[0])
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
                  data[0].weightDelta * -2.20462 * 500 + data[0].avgCalories)
       }]
    }));
    updateUserTdeeAndWeightDelta(data);
    console.log('weekly logs generated');
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
    const shownTdee = weeklyLogs.length > 2 ? Math.round(tdee/50)*50 : Math.round(userData.calculatedTDEE/50)*50
    updateUserData({currentTDEE: shownTdee, weightDelta: parseFloat(weightDelta.toFixed(2))});
  }

  const getWeekIdFromDateId = (dateId) => {
    return Math.floor(
      (getDateFromDateId(dateId)
      .getTime() + 259200000) / 604800000);
  };

  const getDateFromDateId = (dateId) => {
    return new Date(dateId.slice(0,4), parseInt(dateId.slice(4,6))-1, parseInt(dateId.slice(6,8)), 0, 0, 0, 0);
  }

  const getDateIdFormat = (date) => {
    return `${date.getFullYear()}${String(date.getMonth()+1).padStart(2, 0)}${String(date.getDate()).padStart(2, 0)}`;
  }

  
  
  return (
    <UserLogContext.Provider value={{ 
      userLogs, isLoading, weeklyLogs, 
      addUserLog, updateUserLog, updateUserTdeeAndWeightDelta, 
      getWeekIdFromDateId, getDateIdFormat 
      }}
    >
      {children}
    </UserLogContext.Provider>
  );
}

export { UserLogContext, UserLogProvider };