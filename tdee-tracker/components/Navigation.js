import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from '../screens/Login.js';
import Dashboard from '../screens/Dashboard.js'
import UserInfo from "../screens/UserInfo.js";
import { AuthContext } from "./AuthProvider";
import ProtectedRoute from "./ProtectedRoute";

const Stack = createStackNavigator();

const Navigation = () => {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name ="Dashboard" component={Dashboard} />     
          </>

        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;