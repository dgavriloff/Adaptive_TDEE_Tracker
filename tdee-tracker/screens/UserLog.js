import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Keyboard, TouchableOpacity } from 'react-native';
import { UserLogContext } from '../components/UserLogProvider';
import { UserDataContext } from '../components/UserDataProvider';
import NavigationBar from '../components/NavigationBar';
import DismissKeyboard from '../components/DismissKeyboard';

const UserLog = () => {
  const { addUserLog, userLogs, updateUserLog, getWeekIdFromDateId, getDateIdFormat, isLoading } = useContext(UserLogContext);
  const { userData } = useContext(UserDataContext);

  const [date, setDate] = useState(new Date());
  const [today] = useState(getDateIdFormat(date));
  const [currentLog, setCurrentLog] = useState(userLogs.find(log => log.dateId == today));
  const [weight, setWeight] = useState(currentLog ? currentLog.weight : '');
  const [calories, setCalories] = useState(currentLog ? currentLog.calories : '');

  const dateId = getDateIdFormat(date);

  useEffect(() => {
    setCurrentLog(userLogs.find(log => log.dateId == getDateIdFormat(date)));
  }, [date, userLogs]);

  useEffect(() => {

    setWeight(currentLog ? currentLog.weight : '');
    setCalories(currentLog ? currentLog.calories : '');
  }, [currentLog]);

  const gotoPreviousLog = () => {
    const prevDay = new Date(date.getTime() - 86400000);
    setDate(prevDay);
  };

  const gotoNextLog = () => {
    const nextDay = new Date(date.getTime() + 86400000);
    setDate(nextDay);
  };

  const handleSave = () => {
    const weekId = getWeekIdFromDateId(dateId);
    if (!currentLog) {
      addUserLog({
        weight: parseFloat(weight), 
        calories: parseFloat(calories),
        dateId: dateId,
        weekId: weekId,
      })
    } else {
        updateUserLog({
          weight: parseFloat(weight), 
          calories: parseFloat(calories),
        }, dateId)
    }

  };

  return (
    <DismissKeyboard>
      <View style={styles.container}>
        <View style={styles.header}>
          <Button title="< Prev" onPress={gotoPreviousLog} />
          <Text style={styles.date}>{date.toDateString()}</Text>
          {today !== dateId ? <Button title="Next >" onPress={gotoNextLog} /> : <View style={{ width: 75 }} />}
        </View>

        <View style={styles.body}>
          <View style={styles.inputContainer}>
            <Text style={{ position: 'absolute', left: '85%' }}>{userData.weightUnits}</Text>
            <TextInput
              style={styles.input}
              placeholder={`Enter weight`}
              keyboardType="numeric"
              value={weight ? weight.toString() : ''}
              onChangeText={setWeight}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={{ position: 'absolute', left: '85%' }}>kCal</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter calories"
              keyboardType="numeric"
              value={calories ? calories.toString() : ''}
              onChangeText={setCalories}
            />
          </View>
        </View>
        {((currentLog ? currentLog.weight != weight  : true) || (currentLog ? currentLog.calories != calories  : true))  ?         
        (<TouchableOpacity
          onPress={handleSave}
          style={styles.button}
        >
          <Text style={styles.unsavedButtonText}>Save</Text>
        </TouchableOpacity> ): (
        <View
          style={styles.button}
        >
          <Text style={styles.savedButtonText}>Saved</Text>
        </View>
        ) }

        <NavigationBar />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  body: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    fontSize: 20,
    borderRadius: 5,
  },
  button: {
    position: 'absolute',
    bottom: '15%', // Adjust this value to be above the NavigationBar
    width: '85%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  unsavedButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  savedButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default UserLog;
