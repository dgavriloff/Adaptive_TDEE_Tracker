import React, { useState, useContext } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Divider } from "react-native-paper";
import { UserDataContext } from "../../components/UserDataProvider";
import DismissKeyboard from "../../components/DismissKeyboard";
import LabeledInput from "../../components/LabeledInput";
import BubbleButton from "../../components/BubbleButton";
import RegistrationFooter from "../../components/RegistrationFooter";
import Segment from "../../components/Segment";

const InitialGoals = ({ navigation }) => {
  const { updateUserData, userData } = useContext(UserDataContext);
  const [goalWeight, setGoalWeight] = useState(userData.goalWeight);
  const [weeklyWeightDelta, setWeeklyWeightDelta] = useState(
    !userData.weeklyWeightDelta ? "0.5" : userData.weeklyWeightDelta
  );
  const [missingFields, setMissingFields] = useState(false);

  const handleNext = () => {
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
      navigation.navigate("Baseline Results");
    } else {
      setMissingFields(true);
    }
  };

  const handleBack = () => {
    setMissingFields(false);
    navigation.goBack();
  };

  return (
    <DismissKeyboard>
      <View style={styles.container}>
        <Segment label={"Goal Weight"}>
          <LabeledInput
            value={goalWeight ? goalWeight.toString() : ""}
            onChangeText={setGoalWeight}
            placeholder={"Enter goal weight"}
            units={userData.weightUnits}
            borderColor={missingFields && !goalWeight ? "red" : "black"}
          />
        </Segment>
        <Segment
          label={`Desired Weekly Weight ${
            goalWeight > userData.startWeight ? "Gain" : "Loss"
          } in ${userData.weightUnits}`}
        >
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
      </View>
    </DismissKeyboard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
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

export default InitialGoals;
