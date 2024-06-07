import React, { useState, useContext } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button } from 'react-native-paper';
import { Picker } from'@react-native-picker/picker';
import { UserDataContext } from '../../components/UserDataProvider.js'
import DismissKeyboard from '../../components/DismissKeyboard.js';
import {TouchableWithoutFeedback, Keyboard } from 'react-native';

const BasicInformation = ({ navigation }) => {
  const { updateUserData, userData } = useContext(UserDataContext);
  const [age, setAge] = useState(userData.age);
  const [startWeight, setStartWeight] = useState(userData.startWeight);
  const [height, setHeight] = useState(userData.height);
  const [gender, setGender] = useState(userData.gender === "" ? 'male' : userData.gender);
  const [activityLevel, setActivityLevel] = useState(userData.weightUnits === "" ? 'sedentary' : userData.activityLevel);


  const handleNext = () => {
    // Call updateUserData function with entered information


    // Navigate to the next screen
    if(age && startWeight && height )
    {
        updateUserData({ age, startWeight, gender, activityLevel });
        navigation.navigate('Initial Goals');
    }
    else
      console.log('missing fields')
  };

  const handleBack = () => {
    // Navigate to the previous screen
    navigation.goBack();
  };

  return (
    <DismissKeyboard>
    <View>
      <Text>Age:</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          style={{ borderWidth: 1, borderColor: 'black', padding: 5, flex: 1 }}
        />
        <Text>years</Text>
      </View>


      <Text>Starting weight:</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          value={startWeight}
          onChangeText={setStartWeight}
          keyboardType="numeric"
          style={{ borderWidth: 1, borderColor: 'black', padding: 5, flex: 1 }}
        />
        <Text>{userData.weightUnits}</Text>
      </View>

      <Text>Height:</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
          style={{ borderWidth: 1, borderColor: 'black', padding: 5, flex: 1 }}
        />
        <Text>{userData.heightUnits}</Text>
      </View>

      <Text>Gender:</Text>
      <Picker
        selectedValue={gender}
        onValueChange={(value) => setGender(value)}>
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
      </Picker>

      <Text>Activity level:</Text>
      <Picker
        selectedValue={activityLevel}
        onValueChange={(value) => setActivityLevel(value)}>
        <Picker.Item label="Sedentary" value="sedentary" />
        <Picker.Item label="Lightly active" value="lightly_active" />
        <Picker.Item label="Moderately active" value="moderately_active" />
        <Picker.Item label="Very active" value="very_active" />
        <Picker.Item label="Extra active" value="extra_active" />
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

export default BasicInformation;