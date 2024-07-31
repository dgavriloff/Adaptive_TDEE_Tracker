import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import BubbleButton from "../../components/BubbleButton";
import { UserDataContext } from "../../components/UserDataProvider";
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Segment label={"Weight in"}>
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

        <Segment label={"Height in"}>
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
        <BubbleButton text={"Next"} onPress={handleNext} />
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
    width: "100%",
    alignItems: "center",
    paddingBottom: 25,
  },
});

export default UnitSelection;
