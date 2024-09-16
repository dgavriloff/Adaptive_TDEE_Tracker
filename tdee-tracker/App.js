import React from "react";
import * as Notifications from "expo-notifications";

import { AuthProvider } from "./components/AuthProvider";
import { UserDataProvider } from "./components/UserDataProvider";
import { UserLogProvider } from "./components/UserLogProvider";
import { StorageProvider } from "./components/StorageProvider";
import { NotificationProvider } from "./components/NotificationProvider";
import { ThemeProvider } from "./components/ThemeProvider";
import Navigation from "./components/Navigation";

import { AuthContext } from "./components/AuthProvider";

import FlashMessage from "react-native-flash-message";

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    };
  },
});

export default function App() {
  return (
    <AuthProvider>
      <UserDataProvider>
        <UserLogProvider>
          <StorageProvider>
            <NotificationProvider>
              <ThemeProvider>
                <Navigation />
                <FlashMessage position={"top"} />
              </ThemeProvider>
            </NotificationProvider>
          </StorageProvider>
        </UserLogProvider>
      </UserDataProvider>
    </AuthProvider>
  );
}
