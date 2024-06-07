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
  const [gender, setGender] = useState(userData.gender ? 'male' : userData.gender);
  const [activityLevel, setActivityLevel] = useState(userData.weightUnits ? 1.2 : userData.activityLevel);


  const handleNext = () => {
    // Call updateUserData function with entered information


    // Navigate to the next screen
    if(age && startWeight && height )
    {
        updateUserData({ 
          age: parseFloat(age), 
          startWeight: parseFloat(startWeight), 
          gender: gender, 
          activityLevel: parseFloat(activityLevel), 
          height: parseFloat(height)
        });
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
          value={age ? age.toString() : ''}
          onChangeText={setAge}
          keyboardType="numeric"
          style={{ borderWidth: 1, borderColor: 'black', padding: 5, flex: 1 }}
        />
        <Text>years</Text>
      </View>


      <Text>Starting weight:</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          value={startWeight ? startWeight.toString() : ''}
          onChangeText={setStartWeight}
          keyboardType="numeric"
          style={{ borderWidth: 1, borderColor: 'black', padding: 5, flex: 1 }}
        />
        <Text>{userData.weightUnits}</Text>
      </View>

      <Text>Height:</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          value={height ? height.toString() : ''}
          onChangeText={setHeight}
          keyboardType="numeric"
          style={{ borderWidth: 1, borderColor: 'black', padding: 5, flex: 1 }}
        />
        <Text>{userData.heightUnits}</Text>
      </View>

      <Text>Gender:</Text>
      <Picker
        selectedValue={gender ? gender : 'male'}
        
        onValueChange={(value) => setGender(value)}>
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
      </Picker>

      <Text>Activity level:</Text>
      <Picker
        selectedValue={activityLevel ? activityLevel.toString() : 1.2}
        onValueChange={(value) => setActivityLevel(value)}>
        <Picker.Item label="Sedentary" value={1.2} />
        <Picker.Item label="Lightly active" value={1.375} />
        <Picker.Item label="Moderately active" value={1.55} />
        <Picker.Item label="Active" value={1.725} />
        <Picker.Item label="Extra active" value={1.9} />
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