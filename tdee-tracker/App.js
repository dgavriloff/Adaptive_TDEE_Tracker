import React from "react";
import { AuthProvider } from "./components/AuthProvider";
import { UserDataProvider } from "./components/UserDataProvider";
import { UserLogProvider } from './components/UserLogProvider';
import Navigation from "./components/Navigation";

export default function App() {
  return (

    <AuthProvider>
      <UserDataProvider>
        <UserLogProvider>
          <Navigation />
        </UserLogProvider>
      </UserDataProvider>
    </AuthProvider>
    
  );
}

