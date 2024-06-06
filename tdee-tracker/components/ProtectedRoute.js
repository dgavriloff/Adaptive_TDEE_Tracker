import React, {Children, useContext} from "react";
import { View, ActivityIndicator } from "react-native";
import { AuthContext } from "./AuthProvider";
import Login from '../screens/Login';
import Dashboard from "../screens/Dashboard";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext( AuthContext );

  if (user === undefined) {
    return <ActivityIndicator size="large" color="#0000ff"/>
  }

  return user ? <Dashboard /> : <Login />
};

export default ProtectedRoute;