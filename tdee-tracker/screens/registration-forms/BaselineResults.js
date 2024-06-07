import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { UserDataContext } from '../../components/UserDataProvider';

const BaselineResults = ({ navigation }) => {
  const { userData, updateUserData } = useContext(UserDataContext);
  const [bmr, setBmr] = useState(null);
  const [tdee, setTdee] = useState(null);
  const [goalDate, setGoalDate] = useState(null);

  useEffect(() => {
    const calculatedBmr = userData.gender === "female" ? (
      ((userData.weightUnits === "kgs" ? userData.startWeight : (userData.startWeight * 0.453592)) * 10) +
      ((userData.heightUnits === "cm" ? userData.height : (userData.height * 2.54)) * 6.25) - (5 * userData.age) - 161
    ) : (
      ((userData.weightUnits === "kgs" ? userData.startWeight : (userData.startWeight * 0.453592)) * 10) +
      ((userData.heightUnits === "cm" ? userData.height : (userData.height * 2.54)) * 6.25) - (5 * userData.age) + 5
    );
    const calculatedTdee = Math.floor(calculatedBmr * userData.activityLevel);

    const weightDelta = Math.abs(userData.startWeight - userData.goalWeight);
    const daysUntilGoal = userData.weightUnits === 'lbs' ? weightDelta * 3500 / userData.dailyCalorieDelta : weightDelta * 2.20
    462 * 3500 / userData.dailyCalorieDelta;
    const goalDate = new Date(new Date().getTime() + (86400000 * daysUntilGoal))

    setGoalDate(goalDate.toDateString().slice(3));
    setBmr(calculatedBmr);
    setTdee(calculatedTdee);
  }, [userData]);

  const handleNext = () => {
    updateUserData({ registrationComplete: true });
  };

  return (
      <View style={styles.container}>
        <Text style={styles.result}>Initial TDEE: {tdee}</Text>
        <Text style={styles.result}>
          Daily Calorie Target to {userData.loseOrGain ? 'Gain' : 'Lose'} {userData.weeklyWeightDelta} {userData.weightUnits} per week: { userData.loseOrGain ? tdee + userData.dailyCalorieDelta : tdee - userData.dailyCalorieDelta} {userData.energyUnits}
        </Text>
        <Text style={styles.result}>Goal weight will be reached by{goalDate}</Text>
        <Button title="Next" onPress={handleNext} />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  result: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 50,
    textAlign: 'center',
  },
});

export default BaselineResults;
