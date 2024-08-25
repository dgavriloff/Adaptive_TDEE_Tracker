import React from "react";
import { AuthProvider } from "./components/AuthProvider";
import { UserDataProvider } from "./components/UserDataProvider";
import { UserLogProvider } from "./components/UserLogProvider";
import { StorageProvider } from "./components/StorageProvider";
import Navigation from "./components/Navigation";

import { AuthContext } from "./components/AuthProvider";

import FlashMessage from "react-native-flash-message";

export default function App() {
  return (
    <AuthProvider>
      <UserDataProvider>
        <UserLogProvider>
          <StorageProvider>
            <Navigation />
            <FlashMessage position={'top'}/>
          </StorageProvider>
        </UserLogProvider>
      </UserDataProvider>
    </AuthProvider>
  );
}
