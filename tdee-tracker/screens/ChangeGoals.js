import React, { useState, useContext } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { UserDataContext } from "../components/UserDataProvider";
import DismissKeyboard from "../components/DismissKeyboard";
import LabeledInput from "../components/LabeledInput";
import BubbleButton from "../components/BubbleButton";
import RegistrationFooter from "../components/RegistrationFooter";

const InitialGoals = ({ navigation }) => {
  const { updateUserData, userData } = useContext(UserDataContext);
  const [goalWeight, setGoalWeight] = useState(userData.goalWeight);
  const [weeklyWeightDelta, setWeeklyWeightDelta] = useState(
    !userData.weeklyWeightDelta ? "0.5" : userData.weeklyWeightDelta
  );
  const [missingFields, setMissingFields] = useState(false);

  const handleSave = () => {
    if (goalWeight) {
      updateUserData({
        goalWeight: parseFloat(goalWeight),
        weeklyWeightDelta: parseFloat(weeklyWeightDelta),
        dailyCalorieDelta: Math.floor(
          userData.weightUnits === "lbs"
            ? weeklyWeightDelta * 500
            : weeklyWeightDelta * 2.20462 * 500
        ),
        loseOrGain: goalWeight > userData.startWeight ? true : false,
      });
      setMissingFields(false);
      navigation.goBack();
    } else {
      setMissingFields(true);
    }
  };

  return (
    <DismissKeyboard>
      <View style={styles.container}>
        <View style={styles.segment}>
          <Text style={styles.label}>Goal weight:</Text>
          <LabeledInput
            value={goalWeight ? goalWeight.toString() : ""}
            onChangeText={setGoalWeight}
            placeholder={"Enter goal weight"}
            units={userData.weightUnits}
            borderColor={missingFields && !goalWeight ? "red" : "black"}
          />
        </View>
        <View style={styles.picker}>
          <Text style={styles.label}>
            Desired Weekly Weight{" "}
            {goalWeight > userData.startWeight ? "Gain" : "Loss"} in{" "}
            {userData.weightUnits}:
          </Text>
          <Picker
            selectedValue={
              weeklyWeightDelta ? weeklyWeightDelta.toString() : ""
            }
            onValueChange={(value) => setWeeklyWeightDelta(value)}
          >
            {[...Array(10).keys()].map((num) => (
              <Picker.Item
                key={num}
                label={(num * 0.5).toString()}
                value={(num * 0.5).toString()}
              />
            ))}
          </Picker>
        </View>
        <View style={styles.buttonContainer}>
          <BubbleButton
            text={"Save and Go Back"}
            onPress={handleSave}
            style={{ width: "100%" }}
          />
        </View>
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
  segment: {
    justifyContent: "center",
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
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
  picker: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    padding: 20,
  },
});

export default InitialGoals;
