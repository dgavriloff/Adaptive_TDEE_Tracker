import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Keyboard } from 'react-native';
import { UserLogContext } from '../components/UserLogProvider';
import { UserDataContext } from '../components/UserDataProvider';
import NavigationBar from '../components/NavigationBar';

const UserLog = () => {
  const { addUserLog, userLogs, updateUserLog } = useContext(UserLogContext);
  const { userData } = useContext(UserDataContext);

  const [date, setDate] = useState(new Date());


  const [today] = useState(`${date.getDate()} ${date.getMonth()} ${date.getFullYear()}`);
  const [currentLog, setCurrentLog] = useState(userLogs.find(log => log.dateId == today));
  const [weight, setWeight] = useState(currentLog ? currentLog.weight : '');
  const [calories, setCalories] = useState(currentLog ? currentLog.calories : '');

  const dateId = `${date.getDate()} ${date.getMonth()} ${date.getFullYear()}`;

  useEffect(() => {
    setWeight(currentLog ? currentLog.weight : '');
    setCalories(currentLog ? currentLog.calories : '');
  },[date, currentLog]);


  const gotoPreviousLog = () => {
    const prevDay = new Date(date.getTime() - 86400000);
    setDate(prevDay);
    setCurrentLog(userLogs.find(log => log.dateId === `${prevDay.getDate()} ${prevDay.getMonth()} ${prevDay.getFullYear()}`));
  };

  const gotoNextLog = () => {
    const nextDay = new Date(date.getTime() + 86400000);
    setDate(nextDay);
    setCurrentLog(userLogs.find(log => log.dateId === `${nextDay.getDate()} ${nextDay.getMonth()} ${nextDay.getFullYear()}`));
  };

  const handleSave = () => {
    if(!currentLog){
      addUserLog({
        weight: parseFloat(weight), 
        calories: parseFloat(calories),
        dateId: dateId
      });
    }else{
      currentLog.weight === weight && currentLog.calories === calories ? ( 
        console.log('saved with no changes')
      ) : (
        //user can log same entry twice. future fix in order
        updateUserLog({
          weight: parseFloat(weight), 
          calories: parseFloat(calories),
        }, dateId)
        .then(() => {
          setCurrentLog(userLogs.find(log => log.dateId === `${date.getDate()} ${date.getMonth()} ${date.getFullYear()}`));
        })
        
      );

    }
    Keyboard.dismiss();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button title="< Prev" onPress={gotoPreviousLog} />

        <Text style={styles.date}>{date.toLocaleDateString()}</Text>

        {today != dateId ? <Button title="Next >" onPress={gotoNextLog} /> : <Button title='            '/>}
      </View>

      <View style={styles.body}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Log weight:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter weight"
            keyboardType="numeric"
            value={weight ? weight.toString() : ''}
            onChangeText={setWeight}
          />
          <Text style={styles.label}> {userData.weightUnits}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Log calories:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter calories"
            keyboardType="numeric"
            value={calories ? calories.toString() : ''}
            onChangeText={setCalories}
          />
        </View>
        <Button title="Save" onPress={handleSave} />
      </View>
      <NavigationBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginBottom: 20,
  },
  date: {
    fontSize: 18,
  },
  body: {
    width: '80%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    fontSize: 20,
  },
});

export default UserLog;