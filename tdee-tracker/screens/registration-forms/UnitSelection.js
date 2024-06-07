import React, { useState, useContext } from 'react';
import { View, Text} from 'react-native';
import { Picker } from'@react-native-picker/picker';
import { Button } from 'react-native-paper';
import { UserDataContext } from '../../components/UserDataProvider.js'
import { AuthContext } from '../../components/AuthProvider.js';

const UnitSelection = ({ navigation }) => {
  const { updateUserData, userData } = useContext(UserDataContext);
  const [weightUnit, setWeightUnit] = useState(!userData.weightUnits ? 'lbs' : userData.weightUnits);
  const [energyUnit, setEnergyUnit] = useState(!userData.energyUnits ? 'kCal' : userData.energyUnits);
  const [heightUnit, setHeightUnit] = useState(!userData.heightUnits ? 'in' : userData.heightUnits);

  const { logout } = useContext(AuthContext)

  const handleNext = () => {
    updateUserData({ weightUnits: weightUnit, energyUnits: energyUnit, heightUnits: heightUnit });

    navigation.navigate('Basic Information');
  };

  return (
    <View>
      <Text>Weight in:</Text>
      <Picker
        selectedValue={weightUnit}
        onValueChange={(itemValue) => setWeightUnit(itemValue)}>
        <Picker.Item label="Pounds" value="lbs" />
        <Picker.Item label="Kilograms" value="kgs" />
      </Picker>

      <Text>Height unit:</Text>
      <View>
      <Picker
        selectedValue={heightUnit}
        onValueChange={(itemValue) => setHeightUnit(itemValue)}>
        <Picker.Item label="Inches" value="in" />
        <Picker.Item label="Centimeters" value="cm" />
      </Picker>
      </View>

      <Button mode="contained" onPress={handleNext}>
        Next
      </Button>
    </View>
  );
};


export default UnitSelection;