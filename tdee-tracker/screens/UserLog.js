import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { UserLogContext } from "../components/UserLogProvider";
import { UserDataContext } from "../components/UserDataProvider";

import NavigationBar from "../components/NavigationBar";
import DismissKeyboard from "../components/DismissKeyboard";
import LabeledInput from "../components/LabeledInput";
import Segment from "../components/Segment";
import { showMessage } from "react-native-flash-message";
import { ThemeContext } from "../components/ThemeProvider";

const UserLog = () => {
  const {
    addUserLog,
    userLogs,
    updateUserLog,
    getWeekIdFromDateId,
    getDateIdFormat,
    getDateFromDateId,
  } = useContext(UserLogContext);
  const { userData, isInputValid } = useContext(UserDataContext);
  const { currentTheme, darkMode } = useContext(ThemeContext);

  const [date, setDate] = useState(new Date());
  const [today] = useState(getDateIdFormat(date));
  const [currentLog, setCurrentLog] = useState(
    userLogs.find((log) => log.dateId == today)
  );
  const [weight, setWeight] = useState(currentLog ? currentLog.weight : "");
  const [calories, setCalories] = useState(
    currentLog ? currentLog.calories : ""
  );

  const [saved, setSaved] = useState(
    currentLog ? currentLog.weight || currentLog.calories : false
  );

  const dateId = getDateIdFormat(date);

  useEffect(() => {
    const currentLog = userLogs.find(
      (log) => log.dateId == getDateIdFormat(date)
    );
    setCurrentLog(currentLog);
    setSaved(currentLog != undefined);
  }, [date, userLogs]);

  useEffect(() => {
    setWeight(currentLog ? currentLog.weight : "");
    setCalories(currentLog ? currentLog.calories : "");
  }, [currentLog]);

  const gotoPreviousLog = () => {
    const prevDay = new Date(date.getTime() - 86400000);
    setDate(prevDay);
  };

  const gotoNextLog = () => {
    const nextDay = new Date(date.getTime() + 86400000);
    setDate(nextDay);
  };

  const handleSave = () => {
    const weekId = getWeekIdFromDateId(dateId)
    if (
      isInputValid(parseFloat(weight), 20, 1000, "Weight", true) &&
      isInputValid(parseFloat(calories), 0, 10000, "Calories", true)
    ) {
      if (!currentLog) {
        addUserLog({
          weight: parseFloat(weight),
          calories: parseFloat(calories),
          dateId: dateId,
          weekId: weekId,
        });
      } else {
        updateUserLog(
          {
            weight: parseFloat(weight),
            calories: parseFloat(calories),
          },
          dateId
        );
      }
      setSaved(true);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 20,
      backgroundColor: currentTheme.backgroundColor,
      alignItems: "center",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "85%",
      backgroundColor: currentTheme.foregroundColor,
      padding: 20,
      borderRadius: 10,
    },
    date: {
      fontSize: currentTheme.fontSize,
      fontWeight: "bold",
    },
    button: {
      position: "absolute",
      bottom: 125,
      width: "85%",
      backgroundColor: currentTheme.foregroundColor,
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
    },
    unsavedButtonText: {
      fontSize: currentTheme.fontSize,
      fontWeight: "bold",
      color: currentTheme.buttonTextColor,
    },
    savedButtonText: {
      fontSize: currentTheme.fontSize,
      fontWeight: "bold",
      color: currentTheme.fontColor,
    },
  });

  return (
    <DismissKeyboard>
      <View style={styles.container}>
        <View style={styles.header}>
          <Button title="< Prev" onPress={gotoPreviousLog} color={currentTheme.buttonTextColor}/>
          <DateTimePicker
            mode="date"
            value={date}
            onChange={(res) => setDate(new Date(res.nativeEvent.timestamp))}
            maximumDate={getDateFromDateId(today)}
            dateFormat="dayofweek day month"
            style={{ paddingLeft: 5, right: 2.5}}
            themeVariant={darkMode ? 'dark' : 'light'}
          />
          {today !== dateId ? (
            <Button title="Next >" onPress={gotoNextLog} color={currentTheme.buttonTextColor}/>
          ) : (
            <View style={{ width: 75 }} />
          )}
        </View>

        <Segment>
          <LabeledInput
            placeholder={`Enter weight`}
            keyboardType="numeric"
            value={!isNaN(weight) && `${weight}`}
            onChangeText={(value) => {

              setWeight(value);
              parseFloat(value) !== currentLog?.weight ? setSaved(false) : setSaved(true)
            }}
            units={userData.weightUnits}
          />
          <LabeledInput
            placeholder="Enter calories"
            keyboardType="numeric"
            value={!isNaN(calories) && `${calories}`}
            onChangeText={(value) => {
              setCalories(value);
              parseFloat(value) !== currentLog?.calories ? setSaved(false) : setSaved(true);
            }}
            units={"kCal"}
          />
        </Segment>
        {!saved ? (
          <TouchableOpacity
            onPress={weight || calories ? handleSave : () => { showMessage({
              message: 'Both fields cannot be blank',
              type:'warning',
              titleStyle:{textAlign: 'center', fontSize: 18},
              duration: 2000
            }) }}
            style={styles.button}
          >
            <Text style={styles.unsavedButtonText}>Save</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.button}>
            <Text style={styles.savedButtonText}>Saved</Text>
          </View>
        )}

        <NavigationBar />
      </View>
    </DismissKeyboard>
  );
};



export default UserLog;
