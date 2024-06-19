import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import BubbleButton from "../../components/BubbleButton"; // Assuming you have a custom Button component
import { UserDataContext } from "../../components/UserDataProvider";
import DismissKeyboard from "../../components/DismissKeyboard";
import RegistrationFooter from "../../components/RegistrationFooter";
import Bold from "../../components/Bold";
import Segment from "../../components/Segment";

const ActivityLevelSelector = ({ navigation }) => {
  const { updateUserData, userData } = useContext(UserDataContext);
  const [activityLevel, setActivityLevel] = useState(
    userData.activityLevel ? userData.activityLevel : 1.2
  );

  const handleNext = () => {
    updateUserData({
      ...userData,
      activityLevel: parseFloat(activityLevel),
    });
    navigation.navigate("Initial Goals");
  };

  const handleBack = () => {
    updateUserData({
      ...userData,
      activityLevel: parseFloat(activityLevel),
    });
    navigation.goBack();
  };

  return (
    <DismissKeyboard>
      <View style={styles.container}>
        <Segment label={"Activity Level:"}>
          <Picker
            selectedValue={activityLevel ? activityLevel.toString() : "1.2"}
            style={{ width: "100%" }}
            onValueChange={(value) => setActivityLevel(value)}
          >
            <Picker.Item label="Sedentary" value="1.2" />
            <Picker.Item label="Lightly active" value="1.375" />
            <Picker.Item label="Moderately active" value="1.55" />
            <Picker.Item label="Active" value="1.725" />
            <Picker.Item label="Extra active" value="1.9" />
          </Picker>
        </Segment>
        <Segment>
          <Text style={styles.descriptions}>
            <Bold>Sedentary:</Bold> little to no exercise
          </Text>
          <Text style={styles.descriptions}>
            <Bold>Lightly active:</Bold> exercise 2 to 3 times per week
          </Text>
          <Text style={styles.descriptions}>
            <Bold>Moderately active:</Bold> exercise 5 to 6 times per week
          </Text>
          <Text style={styles.descriptions}>
            <Bold>Active:</Bold> exercise 8 to 9 times a week{" "}
          </Text>
          <Text style={styles.descriptions}>
            <Bold>Extra active:</Bold> daily exercise and physical job
          </Text>
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
  segment: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
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
  descriptions: {
    fontSize: 20,
    margin: 4,
    textAlign: "center",
  },
});

export default ActivityLevelSelector;
