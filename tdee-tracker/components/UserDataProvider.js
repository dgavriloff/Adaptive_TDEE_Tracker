import React, {createContext, useState, useEffect, useContext} from 'react';
import { db, auth } from '../config/firebaseConfig'
import { collection, doc, setDoc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { AuthContext } from './AuthProvider';

const UserDataContext = createContext();

const schema  = {
  email: null,
  registrationComplete: null,
  createdAt: null,
  weightUnits: null,
  energyUnits: null,
  heightUnits: null,
  gender: null,
  startWeight: null,
  currentWeight: null,
  weeklyLoss: null,
  goalWeight: null,
  age: null,
  activityLevel: null,
  height: null,
  currentTDEE: null
}


const UserDataProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if(user){
      const docRef = doc(db, 'users', user.uid);
    

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if(docSnap.exists()){
        setUserData(docSnap.data());
      } else {
        console.log('no doc for user, creating new doc');
        createUserDoc(user);
      }
      setIsLoading(false);
    }, err => {
      console.error('error fetching data', err)
      setIsLoading(false);
    });
      return unsubscribe;
    } else {
      setUserData(null);
      setIsLoading(false);
    }
  }, [user]);
  
  const createUserDoc = (user) => {
    const { uid } = user;
    const userDocRef = doc(collection(db, "users"), uid);
    return setDoc(userDocRef, {...schema,   
      email: user.email,
      registrationComplete: false,
      createdAt: new Date()
    })
      .then(() => {
      console.log(`doc created with ${user.email} and uid ${uid}`);
    }).catch(err => {
      console.log('doc creation error', err)
      throw err;
    });
  };

  const getUserData = (user) => {
    const { uid } = user;
    const docRef = doc(collection(db, "users"), uid);
    return getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()){
          console.log(`successfully retrieved and loaded user data for ${uid}`, docSnap.data());
          return docSnap;
        } else {
          console.log(`no such document for ${uid}`);
          return null;
        }
      })
      .catch(err => {
        console.log(`error getting user doc for ${uid}`, err);
      });
  };

  const updateUserData = (changes) => {
    const docRef = doc(collection(db, "users"), user.uid);

    updateDoc(docRef, changes)
    .then(() => {
      console.log(`doc updated with ${JSON.stringify(changes)     } for ${user.uid}`)
    })
    .catch(err => {
      console.log('error updating doc', err)
    })
  };

  return (
    <UserDataContext.Provider value={{ userData, isLoading, updateUserData }}>
      {children}
    </UserDataContext.Provider>
  )
};

export {UserDataContext, UserDataProvider}