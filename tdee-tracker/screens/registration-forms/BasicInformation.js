import React, { useState, useContext } from "react";
import { View, StyleSheet, ScrollView, Text, Linking } from "react-native";
import BubbleButton from "../../components/BubbleButton";
import { UserDataContext } from "../../components/UserDataProvider";
import DismissKeyboard from "../../components/DismissKeyboard";
import LabeledInput from "../../components/LabeledInput";
import Segment from "../../components/Segment";
import { ThemeContext } from "../../components/ThemeProvider";

const BasicInformation = ({ navigation }) => {
  const { updateUserData, userData, isInputValid } =
    useContext(UserDataContext);
  const { currentTheme } = useContext(ThemeContext);
  const [age, setAge] = useState(userData.age ? userData.age.toString() : "");
  const [startWeight, setStartWeight] = useState(
    userData.startWeight ? userData.startWeight.toString() : ""
  );
  const [height, setHeight] = useState(
    userData.height ? userData.height.toString() : ""
  );
  const [gender, setGender] = useState(
    userData.gender ? userData.gender : "male"
  );
  const [missingFields, setMissingFields] = useState(false);

  const handleNext = () => {
    if (
      isInputValid(age, 10, 150, "Age") &&
      isInputValid(height, 20, 250, "Height") &&
      isInputValid(startWeight, 20, 1000, "Start weight")
    ) {
      updateUserData({
        age: parseFloat(age),
        startWeight: parseFloat(startWeight),
        gender: gender,
        height: parseFloat(height),
        currentWeight: parseFloat(startWeight),
      });
      setMissingFields(false);
      navigation.navigate("Activity Level");
    } else {
      setMissingFields(true);
    }
  };

  const handleBack = () => {
    updateUserData({
      age: parseFloat(age),
      startWeight: parseFloat(startWeight),
      gender: gender,
      height: parseFloat(height),
    });
    setMissingFields(false);
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f0f0f0",
    },
    scrollContainer: {
      width: "100%",
      paddingBottom: 25,
      alignItems: "center",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "85%",
      bottom: 0,
    },
    weightContainer: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      justifyContent: "space-between",
      marginTop: 10,
      marginBottom: 10,
    },
    weightButtons: {
      flexDirection: "row",
    },
    labelText: {
      fontSize: 16,
      textAlign: "center",
    },
    context: {
      color: currentTheme.buttonTextColor,
      fontWeight: "800",
      marginTop: 10,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <DismissKeyboard style={{ width: "100%", alignItems: "center" }}>
          <Segment label={"Age, Height and Start Weight"}>
            <LabeledInput
              units={"years"}
              placeholder={"Enter age"}
              value={age}
              onChangeText={setAge}
              borderColor={missingFields && !age ? "red" : "black"}
            />

            <LabeledInput
              units={
                userData.heightUnits === "in" ? "inches" : userData.heightUnits
              }
              placeholder={"Enter height"}
              value={height}
              onChangeText={setHeight}
              borderColor={missingFields && !height ? "red" : "black"}
            />

            <LabeledInput
              units={userData.weightUnits}
              placeholder={"Enter starting weight"}
              value={startWeight}
              onChangeText={setStartWeight}
              borderColor={missingFields && !startWeight ? "red" : "black"}
            />
          </Segment>
        </DismissKeyboard>
        <Segment label={"Select Gender"}>
          <View style={styles.weightContainer}>
            <Text style={styles.labelText}>Select your gender: </Text>
            <MultipleToggleButtons
              values={[
                { value: { short: "Male" }, key: "male", pressable: true },
                { value: { short: "Female" }, key: "female", pressable: true },
              ]}
              defaultValue={{ short: gender }}
              action={setGender}
              containerStyle={styles.weightButtons}
              buttonStyle={{ marginLeft: 10 }}
            />
          </View>
        </Segment>
        <Text
          style={styles.context}
          onPress={() =>
            Linking.openURL(
              "https://read.qxmd.com/read/2305711/a-new-predictive-equation-for-resting-energy-expenditure-in-healthy-individuals?redirected=slug"
            )
          }
        >
          Why do we need this information?
        </Text>

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

export default BasicInformation;
