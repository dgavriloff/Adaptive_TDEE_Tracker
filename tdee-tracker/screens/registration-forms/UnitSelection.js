import React, { useState, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Divider } from "react-native-paper";
import BubbleButton from "../../components/BubbleButton";
import { UserDataContext } from "../../components/UserDataProvider";
import { AuthContext } from "../../components/AuthProvider";
import RegistrationFooter from "../../components/RegistrationFooter";
import Segment from "../../components/Segment";

const UnitSelection = ({ navigation }) => {
  const { updateUserData, userData } = useContext(UserDataContext);
  const [weightUnit, setWeightUnit] = useState(
    !userData.weightUnits ? "lbs" : userData.weightUnits
  );
  const [energyUnit, setEnergyUnit] = useState(
    !userData.energyUnits ? "kCal" : userData.energyUnits
  );
  const [heightUnit, setHeightUnit] = useState(
    !userData.heightUnits ? "in" : userData.heightUnits
  );

  const handleNext = () => {
    updateUserData({
      weightUnits: weightUnit,
      energyUnits: energyUnit,
      heightUnits: heightUnit,
    });
    navigation.navigate("Basic Information");
  };

  return (
    <View style={styles.container}>
      <Segment label={"Weight in:"}>
        <Picker
          style={{
            width: "100%",
          }}
          selectedValue={weightUnit}
          onValueChange={(itemValue) => setWeightUnit(itemValue)}
        >
          <Picker.Item label="Pounds" value="lbs" />
          <Picker.Item label="Kilograms" value="kgs" />
        </Picker>
      </Segment>

      <Segment label={"Height in:"}>
        <Picker
          style={{
            width: "100%",
          }}
          selectedValue={heightUnit}
          onValueChange={(itemValue) => setHeightUnit(itemValue)}
        >
          <Picker.Item label="Inches" value="in" />
          <Picker.Item label="Centimeters" value="cm" />
        </Picker>
      </Segment>
      <View
        style={{
          width: "85%",
          marginBottom: 120,
          position: "absolute",
          bottom: 0,
        }}
      >
        <BubbleButton text={"Next"} onPress={handleNext} />
      </View>
      <RegistrationFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
});

export default UnitSelection;
