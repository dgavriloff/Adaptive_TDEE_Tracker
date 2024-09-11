import React, { createContext, useContext, useState, useEffect } from "react";
import * as Notifications from "expo-notifications";
import { AuthContext } from "./AuthProvider";

// Create the context
const NotificationContext = createContext();

// Custom hook to use the Notification context
const useNotification = () => useContext(NotificationContext);

// Provider component
const NotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [permissionStatus, setPermissionStatus] = useState(null);
  const [notification, setNotification] = useState(null);
  const [refresh, setRefresh] = useState(false);

  // Get the current notification permission status
  useEffect(() => {
    if(!refresh)
      return
    getNotifications().then((res) => {
      const foundNotification = res.filter((noti) => {
        return noti.identifier === user.uid;
      })[0];
      setNotification(foundNotification);
    });
    setRefresh(false);
  }, [refresh]);

  const getPermission = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setPermissionStatus(status);
      return status;
    } catch (error) {
      console.error("Error getting permissions:", error);
    }
  };

  // Request notification permissions if not already granted
  const requestPermission = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setPermissionStatus(status);
      return status;
    } catch (error) {
      console.error("Error requesting permissions:", error);
    }
  };

  // Schedule a reminder notification
  const setReminder = async (date, uid) => {
    try {
      if (permissionStatus !== "granted") {
        const status = await requestPermission();
        if (status !== "granted") {
          alert("Notifications permission not granted");
          return;
        }
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Reminder",
          body: "Don't forget to log your weight and calories today!",
        },
        trigger: {
          hour: date.getHours(),
          minute: date.getMinutes(),
          repeats: true,
        },
        identifier: uid,
      });
    } catch (error) {
      console.error("Error scheduling notification:", error);
    }
    setRefresh(true);
  };

  const getNotifications = async () => {
    try {
      const notifications =
        await Notifications.getAllScheduledNotificationsAsync();
      return notifications;
    } catch (error) {
      console.error("Error getting scheduled notifications:", error);
    }
  };

  const clearAllScheduledNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log("All notifications cleared");
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
    setRefresh(true);
  };

  const cancelNotificationByUid = async (uid) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(uid);
      console.log(`Notification with UID: ${uid} has been canceled`);
    } catch (error) {
      console.error(`Error canceling notification with UID: ${uid}`, error);
    }
    setRefresh(true);
  };

  const createDateFromNotification = (notification) => {
    // Use the current date as the default
    const now = new Date();
  
    if (notification && notification.trigger) {
      const { hour, minute } = notification.trigger.dateComponents;
  
      // Create a new Date object with the current date and the specified time
      return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0,0);
    } else {
      // Fallback to the current date and time if no trigger is provided
      return now;
    }
  }

  // Provider value
  const value = {
    getPermission,
    requestPermission,
    setReminder,
    permissionStatus,
    getNotifications,
    clearAllScheduledNotifications,
    notification,
    createDateFromNotification,
    setRefresh,
    cancelNotificationByUid
  };

  // Provider to wrap app
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Export the context and provider
export { NotificationContext, NotificationProvider, useNotification };
