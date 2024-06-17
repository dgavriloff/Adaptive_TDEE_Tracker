import React, { useContext, useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { UserDataContext } from "../../components/UserDataProvider";
import { UserLogContext } from "../../components/UserLogProvider";
import Bold from "../../components/Bold";
import BubbleButton from "../../components/BubbleButton";
import RegistrationFooter from "../../components/RegistrationFooter";

const BaselineResults = ({ navigation }) => {
  const { userData, updateUserData } = useContext(UserDataContext);
  const { getWeekIdFromDateId, getDateIdFormat, addUserLog } =
    useContext(UserLogContext);

  const [bmr, setBmr] = useState(null);
  const [tdee, setTdee] = useState(null);
  const [goalDate, setGoalDate] = useState(null);

  useEffect(() => {
    const calculatedBmr =
      userData.gender === "female"
        ? (userData.weightUnits === "kgs"
            ? userData.startWeight
            : userData.startWeight * 0.453592) *
            10 +
          (userData.heightUnits === "cm"
            ? userData.height
            : userData.height * 2.54) *
            6.25 -
          5 * userData.age -
          161
        : (userData.weightUnits === "kgs"
            ? userData.startWeight
            : userData.startWeight * 0.453592) *
            10 +
          (userData.heightUnits === "cm"
            ? userData.height
            : userData.height * 2.54) *
            6.25 -
          5 * userData.age +
          5;
    const calculatedTdee = Math.floor(calculatedBmr * userData.activityLevel);

    const weightDelta = Math.abs(userData.startWeight - userData.goalWeight);
    const daysUntilGoal =
      userData.weightUnits === "lbs"
        ? (weightDelta * 3500) / userData.dailyCalorieDelta
        : (weightDelta * 2.20462 * 3500) / userData.dailyCalorieDelta;
    const goalDate = new Date(new Date().getTime() + 86400000 * daysUntilGoal);

    setGoalDate(goalDate.toDateString().slice(3));
    setBmr(calculatedBmr);
    setTdee(Math.round(calculatedTdee / 50) * 50);
  }, [userData]);

  const handleNext = () => {
    const date = new Date();
    const dateId = getDateIdFormat(date);

    updateUserData({ registrationComplete: true, calculatedTDEE: tdee });
    addUserLog({
      weight: userData.startWeight,
      calories: "",
      weekId: getWeekIdFromDateId(dateId),
      dateId: dateId,
    });
  };
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.segment}>
        <Text style={styles.result}>
          Calculated Total Daily Energy Expenditure (TDEE) :{" "}
        </Text>
        <Text style={styles.result}>
          <Bold>{tdee} kCal</Bold>
        </Text>
      </View>
      <View style={styles.segment}>
        <Text style={styles.result}>
          Daily Calorie Target to {userData.loseOrGain ? "Gain" : "Lose"}{" "}
          {userData.weeklyWeightDelta} {userData.weightUnits} per week:{" "}
        </Text>
        <Text style={styles.result}>
          <Bold>
            {" "}
            {userData.loseOrGain
              ? tdee + userData.dailyCalorieDelta
              : tdee - userData.dailyCalorieDelta}{" "}
            kCal
          </Bold>
        </Text>
      </View>
      <View style={styles.segment}>
        <Text style={styles.result}>Goal weight will be reached by:</Text>
        <Text style={styles.result}>
          <Bold>{goalDate}</Bold>
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <BubbleButton
          text={"Back"}
          onPress={handleBack}
          style={{ width: "45%" }}
        />
        <BubbleButton
          text={"Next"}
          onPress={handleNext}
          style={{ width: "45%" }}
        />
      </View>
      <RegistrationFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  result: {
    fontSize: 24,
    textAlign: "center",
  },
  segment: {
    justifyContent: "center",
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    marginTop: 20,
    marginBottom: 120,
    bottom: 0,
  },
});

export default BaselineResults;
