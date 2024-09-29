// lib/firestoreService.js
import firestore from "@react-native-firebase/firestore";
import { userSchema } from "../constants";

export const createUserDoc = (user) => {
  const { uid } = user;
  const userDocRef = firestore().collection("users").doc(uid);
  return userDocRef
    .set({
      ...userSchema,
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

export const updateUserData = (user, changes) => {
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

export const deleteUserDoc = (uid) => {
  const userDocRef = firestore().collection("users").doc(uid);
  return userDocRef
    .delete()
    .then(() => console.log("user doc deleted"))
    .catch((err) => console.log("error deleting user doc", err));
};

export const addUserLog = (log, user) => {
  /*
  log = {
    dateId: string,
    calories: number,
    weight: number
    weekId: number
  }

    */
  const logWithUserId = { ...log, userId: user.uid, timestamp: new Date() };
  return firestore()
    .collection("user-logs")
    .add(logWithUserId)
    .then(() => {
      console.log(`log added by ${user.uid} containing ${JSON.stringify(log)}`);
    })
    .catch((err) => {
      console.log(`error adding log for ${user.uid}`, err);
    });
};

export const setMultipleUserLogs = (newLogs) => {
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
      console.log("error committing batch write", err); 
    });
};

export const getSpecificLog = (userLogs, dateId) => {
  return  firestore()
  .collection("user-logs")
  .doc(userLogs.find((log) => log.dateId === dateId).id);
}

export const updateUserLog = (changes, logRef) => {

  return logRef
    .update(changes)
    .then(() => {
      console.log(
        `log updated with ${JSON.stringify(changes)}`
      );
    })
    .catch((err) => {
      console.log(`error updating log`, err);
    });
};

export const deleteUserLogs = (uid) => {
  firestore()
    .collection("user-logs")
    .where("userId", "==", uid)
    .orderBy("dateId", "desc")
    .get()
    .then((logsQuery) => {
      const batch = firestore().batch(); // Use a batch write for efficiency

      logsQuery.docs.forEach((doc) => {
        batch.delete(doc.ref); // Add delete operation to batch
      });

      return batch.commit(); // Commit the batch
    })
    .then(() => {
      console.log("All logs deleted successfully.");
    })
    .catch((error) => {
      console.error("Error deleting logs:", error);
    });
};

export { firestore };
