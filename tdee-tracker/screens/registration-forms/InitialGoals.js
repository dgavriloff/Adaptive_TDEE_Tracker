import React, { useState, useContext } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button } from 'react-native-paper';
import { Picker } from'@react-native-picker/picker';
import { UserDataContext } from '../../components/UserDataProvider';
import DismissKeyboard from '../../components/DismissKeyboard';

const InitialGoals = ({ navigation }) => {
  const { updateUserData, userData } = useContext(UserDataContext);
  const [goalWeight, setGoalWeight] = useState(userData.goalWeight);
  const [weeklyLoss, setWeeklyLoss] = useState(!userData.weeklyLoss ? '0.5' : userData.weeklyLoss);


  const handleNext = () => {

    if(goalWeight){
      updateUserData({ goalWeight, weeklyLoss });
      navigation.navigate('Baseline Results');
    } else
      console.log('missing fields')

  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <DismissKeyboard>
      <View style={{ padding: 20 }}>
        <Text>Goal Weight:</Text>
        <TextInput
          value={goalWeight}
          onChangeText={setGoalWeight}
          keyboardType="numeric"
          style={{ borderWidth: 1, borderColor: 'black', padding: 5 }}
        />

        <Text>Weekly Weight Loss:</Text>
        <Picker
          selectedValue={weeklyLoss}
          onValueChange={(value) => setWeeklyLoss(value)}
          style={{ borderWidth: 1, borderColor: 'black' }}>
          {[...Array(10).keys()].map((num) => (
            <Picker.Item key={num} label={(num * 0.5).toString()} value={(num * 0.5).toString()} />
          ))}
        </Picker>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button mode="contained" onPress={handleBack}>
          Back
        </Button>
        <Button mode="contained" onPress={handleNext}>
          Next
        </Button>
      </View>
      </View>
    </DismissKeyboard>
  );
};

export default InitialGoals;