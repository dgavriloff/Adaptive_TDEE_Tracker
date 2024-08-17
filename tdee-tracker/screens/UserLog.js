import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { UserLogContext } from "../components/UserLogProvider";
import { UserDataContext } from "../components/UserDataProvider";

import NavigationBar from "../components/NavigationBar";
import DismissKeyboard from "../components/DismissKeyboard";
import LabeledInput from "../components/LabeledInput";
import Segment from "../components/Segment";

const UserLog = () => {
  const {
    addUserLog,
    userLogs,
    updateUserLog,
    getWeekIdFromDateId,
    getDateIdFormat,
    getDateFromDateId,
  } = useContext(UserLogContext);
  const { userData } = useContext(UserDataContext);

  const [date, setDate] = useState(new Date());
  const [today] = useState(getDateIdFormat(date));
  const [currentLog, setCurrentLog] = useState(
    userLogs.find((log) => log.dateId == today)
  );
  const [weight, setWeight] = useState(currentLog ? currentLog.weight : "");
  const [calories, setCalories] = useState(
    currentLog ? currentLog.calories : ""
  );

  const dateId = getDateIdFormat(date);

  useEffect(() => {
    setCurrentLog(userLogs.find((log) => log.dateId == getDateIdFormat(date)));
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
    const weekId = getWeekIdFromDateId(dateId);
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
  };

  return (
    <DismissKeyboard>
      <View style={styles.container}>
        <View style={styles.header}>
          <Button title="< Prev" onPress={gotoPreviousLog} />
          <DateTimePicker
            mode="date"
            value={date}
            onChange={(res) => setDate(new Date(res.nativeEvent.timestamp))}
            maximumDate={getDateFromDateId(today)}
            dateFormat="dayofweek day month"
          />
          {today !== dateId ? (
            <Button title="Next >" onPress={gotoNextLog} />
          ) : (
            <View style={{ width: 75 }} />
          )}
        </View>

        <Segment>
          <LabeledInput
            placeholder={`Enter weight`}
            keyboardType="numeric"
            value={weight ? weight.toString() : ""}
            onChangeText={setWeight}
            units={userData.weightUnits}
          />

          <LabeledInput
            placeholder="Enter calories"
            keyboardType="numeric"
            value={calories ? calories.toString() : ""}
            onChangeText={setCalories}
            units={"kCal"}
          />
        </Segment>
        {(currentLog ? currentLog.weight != weight : true) ||
        (currentLog ? currentLog.calories != calories : true) ? (
          <TouchableOpacity
            onPress={weight || calories ? handleSave : () => {}}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  date: {
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    position: "absolute",
    bottom: 125,
    width: "85%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  unsavedButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
  },
  savedButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});

export default UserLog;
