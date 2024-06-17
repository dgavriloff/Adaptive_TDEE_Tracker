import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import BubbleButton from '../../components/BubbleButton';
import { Picker } from '@react-native-picker/picker';
import { UserDataContext } from '../../components/UserDataProvider';
import DismissKeyboard from '../../components/DismissKeyboard';
import LabeledInput from '../../components/LabeledInput';
import RegistrationFooter from '../../components/RegistrationFooter';

const BasicInformation = ({ navigation }) => {
  const { updateUserData, userData } = useContext(UserDataContext);
  const [age, setAge] = useState(userData.age ? userData.age.toString() : '');
  const [startWeight, setStartWeight] = useState(userData.startWeight ? userData.startWeight.toString() : '');
  const [height, setHeight] = useState(userData.height ? userData.height.toString() : '');
  const [gender, setGender] = useState(userData.gender ? userData.gender : 'male');
  const [missingFields, setMissingFields] = useState(false);
  const [activityLevel, setActivityLevel] = useState(userData.activityLevel ? userData.activityLevel : 1.2);

  const handleNext = () => {
    if (age && startWeight && height) {
      updateUserData({
        age: parseFloat(age),
        startWeight: parseFloat(startWeight),
        gender: gender,
        height: parseFloat(height)
      });
      setMissingFields(false);
      navigation.navigate('Activity Level');
    } else {
      setMissingFields(true);
    }
  };

  const handleBack = () => {
    updateUserData({
      age: parseFloat(age),
      startWeight: parseFloat(startWeight),
      gender: gender,
      height: parseFloat(height)
    });
    setMissingFields(false);
    navigation.goBack();
  };

  return (
    <DismissKeyboard>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
                  <Text style={styles.label}>Age, Height and Start Weight:</Text>
        <LabeledInput 
          units={'years'} 
          placeholder={'Enter age'}
          value={age}
          onChangeText={setAge}
          borderColor={missingFields && !age ? 'red' : 'black'}
          />

        <LabeledInput 
          units={userData.heightUnits} 
          placeholder={'Enter height'}
          value={height}
          onChangeText={setHeight}
          borderColor={missingFields && !height ? 'red' : 'black'}
          />

        <LabeledInput 
          units={userData.weightUnits} 
          placeholder={'Enter starting weight'}
          value={startWeight}
          onChangeText={setStartWeight}
          borderColor={missingFields && !startWeight ? 'red' : 'black'}
          />
        </View>
        <View style={styles.picker}>
        <Text style={styles.label}>Gender:</Text>
        <Picker
        style={{
          width:'100%'
        }}

        selectedValue={gender ? gender : 'male'}
        onValueChange={(value) => setGender(value)}>
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
      </View>
      
      <View style={styles.buttonContainer}>
        <BubbleButton text={'Back'} onPress={handleBack} style={{width:'45%'}}/>
        <BubbleButton text={'Next'} onPress={handleNext} style={{width:'45%'}}/>

      </View>
      <RegistrationFooter />
      </View>
    </DismissKeyboard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  inputContainer: {
    justifyContent:'center',
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  picker: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    alignItems:'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign:'center',
    marginBottom: 5
  },
  buttonContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    marginTop: 20,
    marginBottom: 120,
    bottom: 0,
  },
});

export default BasicInformation;
