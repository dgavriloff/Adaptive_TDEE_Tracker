import React, { useState, useContext } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import BubbleButton from "../components/BubbleButton";
import { Picker } from "@react-native-picker/picker";
import { UserDataContext } from "../components/UserDataProvider";
import DismissKeyboard from "../components/DismissKeyboard";
import LabeledInput from "../components/LabeledInput";
import RegistrationFooter from "../components/RegistrationFooter";
import Segment from "../components/Segment";

const BasicInformation = ({ navigation }) => {
  const { updateUserData, userData } = useContext(UserDataContext);
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

  const handleSaveAndBack = () => {
    if (age && startWeight && height) {
      updateUserData({
        age: parseFloat(age),
        startWeight: parseFloat(startWeight),
        gender: gender,
        height: parseFloat(height),
      });
      setMissingFields(false);
      navigation.goBack();
    } else {
      setMissingFields(true);
    }
  };

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
              units={userData.heightUnits}
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
        <Segment label={"Gender"}>
          <Picker
            style={{
              width: "100%",
            }}
            selectedValue={gender ? gender : "male"}
            onValueChange={(value) => setGender(value)}
          >
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
          </Picker>
        </Segment>

        <BubbleButton
          text={"Save and Go Back"}
          onPress={handleSaveAndBack}
          style={{}}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollContainer: {
    alignItems: "center",
    paddingBottom: 25,
  },
});

export default BasicInformation;
