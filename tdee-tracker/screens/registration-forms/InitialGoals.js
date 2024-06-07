import React, { useState, useContext } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button } from 'react-native-paper';
import { Picker } from'@react-native-picker/picker';
import { UserDataContext } from '../../components/UserDataProvider';
import DismissKeyboard from '../../components/DismissKeyboard';

const InitialGoals = ({ navigation }) => {
  const { updateUserData, userData } = useContext(UserDataContext);
  const [goalWeight, setGoalWeight] = useState(userData.goalWeight);
  const [weeklyWeightDelta, setWeeklyWeightDelta] = useState(!userData.weeklyWeightDelta ? '0.5' : userData.weeklyWeightDelta);


  const handleNext = () => {

    if(goalWeight){
      console.log(typeof(goalWeight), 5);
      updateUserData({ 
        goalWeight: parseFloat(goalWeight),
        weeklyWeightDelta: parseFloat(weeklyWeightDelta),
        dailyCalorieDelta: Math.floor(userData.weightUnits === 'lbs' ? weeklyWeightDelta * 500 : weeklyWeightDelta * 2.20462 * 500),
        loseOrGain: goalWeight > userData.startWeight ? true : false
       });
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          value={goalWeight ? goalWeight.toString() : ''}
          onChangeText={setGoalWeight}
          keyboardType="numeric"
          style={{ borderWidth: 1, borderColor: 'black', padding: 5 }}
        />
        <Text>{userData.weightUnits}</Text>
        </View>



        <Text>Desired Weekly Weight {goalWeight > userData.startWeight ? 'Gain' : 'Loss'} in {userData.weightUnits}:</Text>
        <Picker
          selectedValue={weeklyWeightDelta ? weeklyWeightDelta.toString() : ''}
          onValueChange={(value) => setWeeklyWeightDelta(value)}
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