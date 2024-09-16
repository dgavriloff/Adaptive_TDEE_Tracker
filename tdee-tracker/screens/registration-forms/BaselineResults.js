import React, { useContext, useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import { UserDataContext } from "../../components/UserDataProvider";
import { UserLogContext } from "../../components/UserLogProvider";
import Bold from "../../components/Bold";
import BubbleButton from "../../components/BubbleButton";
import Segment from "../../components/Segment";

const BaselineResults = ({ navigation }) => {
  const { userData, updateUserData, calculateGoalDate } = useContext(UserDataContext);
  const { getWeekIdFromDateId, getDateIdFormat, addUserLog } =
    useContext(UserLogContext);

  const [bmr, setBmr] = useState(null);
  const [tdee, setTdee] = useState(null);

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

    setBmr(calculatedBmr);
    setTdee(Math.round(calculatedTdee / 50) * 50);
  }, [userData]);

  const goalDate = calculateGoalDate();

  const handleNext = () => {
    const date = new Date();
    const dateId = getDateIdFormat(date);
    addUserLog({
      weight: userData.startWeight,
      calories: "",
      weekId: getWeekIdFromDateId(dateId),
      dateId: dateId,
    }).then(() => {
      updateUserData({
        calculatedTDEE: tdee,
        registrationComplete: true,
      });
    });
  };
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Segment>
          <Text style={styles.result}>
            Calculated Total Daily Energy Expenditure (TDEE) :{" "}
          </Text>
          <Text style={styles.result}>
            <Bold>{tdee} kCal</Bold>
          </Text>
        </Segment>
        <Segment>
          <Text style={styles.result}>
            Daily Calorie Target to {userData.loseOrGain ? "Gain" : "Lose"}{" "}
            {userData.weeklyWeightDelta} {userData.weightUnits} Per Week:{" "}
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
        </Segment>
        <Segment>
        {goalDate ? (
            <Text style={styles.result}>
              You will reach your goal weight of {userData.goalWeight}{" "}
              {userData.weightUnits} on: {"\n"} <Bold>{goalDate}</Bold>
            </Text>
          ) : (
            <Text style={styles.result}>You are maintaining your weight</Text>
          )}
        </Segment>

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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    alignItems: "center",
    width: "100%",
    paddingBottom: 25,
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
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
  },
});

export default BaselineResults;
