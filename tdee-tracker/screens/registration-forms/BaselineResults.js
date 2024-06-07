import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { UserDataContext } from '../../components/UserDataProvider';

const BaselineResults = () => {
  const { userData, updateUserData } = useContext(UserDataContext);

  const handleNext = () => {
    
    updateUserData({ registrationComplete: true })

  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Baseline Results</Text>
      <Text style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 20 }}>Result 1</Text>
      <Text style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 20 }}>Result 2</Text>
      <Text style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 20 }}>Result 3</Text>
      <Button title="Next" onPress={handleNext} />
    </View>
  );
};

export default BaselineResults;