import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebaseConfig';
import { collection, addDoc, query, where, onSnapshot, updateDoc, doc} from 'firebase/firestore';
import { AuthContext } from './AuthProvider';

const UserLogContext = createContext();



const UserLogProvider = ({children}) => {
  const { user } = useContext(AuthContext);
  const [userLogs, setUserLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const logsQuery = query(collection(db, 'user-logs'), where('userId', '==', user.uid));
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

  
  
  return (
    <UserLogContext.Provider value={{ userLogs, isLoading, addUserLog, updateUserLog }}>
      {children}
    </UserLogContext.Provider>
  );
}

export { UserLogContext, UserLogProvider };