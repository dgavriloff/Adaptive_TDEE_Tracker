import React from "react";
import { AuthProvider } from "./components/AuthProvider";
import { UserDataProvider } from "./components/UserDataProvider";
import { UserLogProvider } from "./components/UserLogProvider";
import { StorageProvider } from "./components/StorageProvider";
import Navigation from "./components/Navigation";

import { AuthContext } from "./components/AuthProvider";

export default function App() {
  return (
    <AuthProvider>
      <UserDataProvider>
        <UserLogProvider>
          <StorageProvider>
            <Navigation />
          </StorageProvider>
        </UserLogProvider>
      </UserDataProvider>
    </AuthProvider>
  );
}
