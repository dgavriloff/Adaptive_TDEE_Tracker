import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, View } from 'react-native';
import DismissKeyboard from "./DismissKeyboard.js";

import Login from '../screens/Login.js';

//logged in user screens
import Dashboard from '../screens/Dashboard.js'
import UserLog from '../screens/UserLog';
import Graph from '../screens/Graph';
import Account from '../screens/Account';
import NavigationBar from './NavigationBar.js';

//registration screens
import UnitSelection from "../screens/registration-forms/UnitSelection.js"
import BasicInformation from "../screens/registration-forms/BasicInformation.js";
import InitialGoals from "../screens/registration-forms/InitialGoals.js";
import BaselineResults from "../screens/registration-forms/BaselineResults.js";

import Loading from "../screens/Loading.js";

//contexts and providers
import { AuthContext } from "./AuthProvider.js";
import { UserDataContext } from "./UserDataProvider.js";
import { NavigationContext } from "@react-navigation/native";
import { NavigationProvider } from "./NavigationContext.js";



const Stack = createStackNavigator();

const Navigation = () => {
  const { user, isLoading: authLoading } = useContext(AuthContext);
  const { userData, isLoading: dataLoading } = useContext(UserDataContext);



  return (
<DismissKeyboard>
    <NavigationContainer>
      <NavigationProvider>
      <Stack.Navigator>
        {user ? (
          <>
            {!userData ? (
              <Stack.Screen name= "Loading" component={Loading} />
            ) : (
              <>
              {userData.registrationComplete ? (
                <>
                  <Stack.Screen name="Dashboard" component={Dashboard} />
                  <Stack.Screen name="UserLog" component={UserLog} />
                  <Stack.Screen name="Graph" component={Graph} />
                  <Stack.Screen name="Account" component={Account} />
                </>
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
      </NavigationProvider>
    </NavigationContainer>
    </DismissKeyboard>
  );
}

export default Navigation;