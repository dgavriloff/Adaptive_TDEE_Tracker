import React from "react";
import { AuthProvider } from "./components/AuthProvider";
import { UserDataProvider } from "./components/UserDataProvider";
import Navigation from "./components/Navigation";

export default function App() {
  return (

    <AuthProvider>
      <UserDataProvider>
        <Navigation />
      </UserDataProvider>
    </AuthProvider>
    
  );
}

