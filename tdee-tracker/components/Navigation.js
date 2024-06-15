import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, TransitionPresets, ModalSlideFromBottomIOS  } from "@react-navigation/stack";
import { ActivityIndicator, View } from 'react-native';
import DismissKeyboard from "./DismissKeyboard.js";

import Login from '../screens/Login.js';

//logged in user screens
import Dashboard from '../screens/Dashboard.js'
import UserLog from '../screens/UserLog';
import Graph from '../screens/Graph';
import Account from '../screens/Account';
import UploadData from "../screens/UploadData.js";
import WeeklyProgress from "../screens/WeeklyProgress.js";
import ChangeBasicInformation from '../screens/ChangeBasicInformation.js';
import ChangeGoals from '../screens/ChangeGoals.js';

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
import { UserLogContext } from "./UserLogProvider.js";



const Stack = createStackNavigator();

const Navigation = () => {
  const { user, isLoading: authLoading } = useContext(AuthContext);
  const { userData, isLoading: dataLoading } = useContext(UserDataContext);
  const { userLogs, weeklyLogs } = useContext(UserLogContext);



  return (
    <NavigationContainer>
      <NavigationProvider>
      <Stack.Navigator
        screenOptions={{
          ...ModalSlideFromBottomIOS
        }}
      >
        {user ? (
          <>
            {!userData || !userLogs || !weeklyLogs ? (
              <Stack.Screen name= "Loading" component={Loading} />
            ) : (
              <>
              {userData.registrationComplete ? (
                <>
                  <Stack.Screen name="Dashboard" component={Dashboard} />
                  <Stack.Screen name="User Log" component={UserLog} />
                  <Stack.Screen name="Graph" component={Graph} />
                  <Stack.Screen name="Account" component={Account} />
                  <Stack.Screen name="Upload Data" component={UploadData} />
                  <Stack.Screen name="Weekly Progress" component={WeeklyProgress} />
                  <Stack.Screen name='Change Personal Details' component={ChangeBasicInformation} />
                  <Stack.Screen name='Change Goals' component={ChangeGoals} />
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
  );
}

export default Navigation;