import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import BubbleButton from "../../components/BubbleButton";
import { UserDataContext } from "../../components/UserDataProvider";
import Segment from "../../components/Segment";

import MultipleToggleButtons from "../../components/MultipleToggleButtons";

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
        <Segment label={"Select Weight Units"}>
          <View style={styles.weightContainer}>
            <MultipleToggleButtons
              values={[
                { value: { short: "Pounds" }, key: "lbs", pressable: true },
                { value: { short: "Kilograms" }, key: "kgs", pressable: true },
              ]}
              defaultValue={{ short: weightUnit }}
              action={setWeightUnit}
              containerStyle={styles.weightButtons}
              buttonStyle={{ marginLeft: 10, width: '45%' }}
            />
          </View>
        </Segment>
        <Segment label={"Select Height Units"}>
        <View style={styles.weightContainer}>
            <MultipleToggleButtons
              values={[
                { value: { short: "Inches" }, key: "in", pressable: true },
                { value: { short: "Centimeters" }, key: "cm", pressable: true },
              ]}
              defaultValue={{ short: heightUnit }}
              action={setHeightUnit}
              containerStyle={styles.weightButtons}
              buttonStyle={{ marginLeft: 10, width: '45%'  }}
            />
          </View>
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
});

export default UnitSelection;
