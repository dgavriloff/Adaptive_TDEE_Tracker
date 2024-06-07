import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, View } from 'react-native';
import Login from '../screens/Login.js';
import Dashboard from '../screens/Dashboard.js'
import UserInfo from "../screens/UserInfo.js";
import UnitSelection from "../screens/registration-forms/UnitSelection.js"
import BasicInformation from "../screens/registration-forms/BasicInformation.js";
import InitialGoals from "../screens/registration-forms/InitialGoals.js";
import Loading from "../screens/Loading.js";
import { AuthContext } from "./AuthProvider";
import { UserDataContext } from "./UserDataProvider.js";
import BaselineResults from "../screens/registration-forms/BaselineResults.js";


const Stack = createStackNavigator();

const Navigation = () => {
  const { user, isLoading: authLoading } = useContext(AuthContext);
  const { userData, isLoading: dataLoading } = useContext(UserDataContext);

  if(authLoading || dataLoading ){
    return (
      <Loading />
    )
  } else

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            {!userData ? (
              <Stack.Screen name= "Loading" component={Loading} />
            ) : (
              <>
              {userData.registrationComplete ? (
                <Stack.Screen name ="Dashboard" component={Dashboard} />   
              ) : (
                <>
                  <Stack.Screen name ="Unit Selection" component={UnitSelection} />
                  <Stack.Screen name ="Basic Information" component={BasicInformation} />
                  <Stack.Screen name ="Initial Goals" component={InitialGoals} />
                  <Stack.Screen name="Baseline Results" component={BaselineResults} />
                </>
              )}
              </>
            )}
          </>
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;