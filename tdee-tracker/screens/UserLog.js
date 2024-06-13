import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Keyboard } from 'react-native';
import { UserLogContext } from '../components/UserLogProvider';
import { UserDataContext } from '../components/UserDataProvider';

import NavigationBar from '../components/NavigationBar';

const UserLog = () => {
  const { addUserLog, userLogs, updateUserLog } = useContext(UserLogContext);
  const { userData, updateUserData } = useContext(UserDataContext);

  const [date, setDate] = useState(new Date());
  const getDateIdFormat = (date) => {
    return `${date.getFullYear()}${String(date.getMonth()+1).padStart(2, 0)}${String(date.getDate()).padStart(2, 0)}`;
  }


  const [today] = useState(getDateIdFormat(date));
  const [currentLog, setCurrentLog] = useState(userLogs.find(log => log.dateId == today));
  const [weight, setWeight] = useState(currentLog ? currentLog.weight : '');
  const [calories, setCalories] = useState(currentLog ? currentLog.calories : '');

  const dateId = getDateIdFormat(date);



  useEffect(() => {
    setWeight(currentLog ? currentLog.weight : '');
    setCalories(currentLog ? currentLog.calories : '');

  },[date, currentLog]);




  const gotoPreviousLog = () => {
    const prevDay = new Date(date.getTime() - 86400000);
    setDate(prevDay);
    setCurrentLog(userLogs.find(log => log.dateId === getDateIdFormat(prevDay)));
  };

  const gotoNextLog = () => {
    const nextDay = new Date(date.getTime() + 86400000);
    setDate(nextDay);
    setCurrentLog(userLogs.find(log => log.dateId === getDateIdFormat(nextDay)));
  };

  const handleSave = () => {
    const weekId = getWeekIdFromDateId(dateId);
    if(!currentLog){
      addUserLog({
        weight: parseFloat(weight), 
        calories: parseFloat(calories),
        dateId: dateId,
        weekId: weekId,
      })
    }else{
      currentLog.weight === weight && currentLog.calories === calories ? ( 
        console.log('saved with no changes')
      ) : (
        updateUserLog({
          weight: parseFloat(weight), 
          calories: parseFloat(calories),
        }, dateId)
        .then(() => {
          setCurrentLog(userLogs.find(log => log.dateId === getDateIdFormat(date)));
        })
    );

    }
    Keyboard.dismiss();
  }

  const getWeekIdFromDateId = (dateId) => {
    return Math.floor(
      (getDateFromDateId(dateId)
      .getTime() + 259200000) / 604800000);
  };

  const getDateFromDateId = (dateId) => {
    return new Date(dateId.slice(0,4), parseInt(dateId.slice(4,6))-1, parseInt(dateId.slice(6,8)), 0, 0, 0, 0);
  }


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button title="< Prev" onPress={gotoPreviousLog} />

        <Text style={styles.date}>{date.toDateString()}</Text>

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


/*preload data button
<Button title="preload" onPress={() => {preData.map(log => {
  addUserLog({
    weight: parseFloat(log.weight), 
    calories: Math.floor((log.cal)),
    dateId: log.date,
    weekId: getWeekIdFromDateId(log.date),
  });
})}} /> 


       const preData = [  { cal: 2060, date: '20240421', weight: '174.6' },
  { cal: 1817, date: '20240422', weight: '174.0' },
  { cal: 1701, date: '20240423', weight: '172.5' },
  { cal: 1752, date: '20240424', weight: '174.0' },
  { cal: 1791, date: '20240425', weight: '172.6' },
  { cal: 1811, date: '20240426', weight: '172.2' },
  { cal: 1921, date: '20240427', weight: '172.0' },
  { cal: 2061, date: '20240428', weight: '172.8' },
  { cal: 1863, date: '20240429', weight: '172.2' },
  { cal: 1812, date: '20240430', weight: '171.0' },
  { cal: 1422, date: '20240501', weight: '171.3' },
  { cal: 1766, date: '20240502', weight: '170.1' },
  { cal: 1968, date: '20240503', weight: '170.9' },
  { cal: 1749, date: '20240504', weight: '171.7' },
  { cal: 1975, date: '20240505', weight: '170.5' },
  { cal: 1940, date: '20240506', weight: '170.1' },
  { cal: 1816, date: '20240507', weight: '168.7' },
  { cal: 1996, date: '20240508', weight: '167.8' },
  { cal: 1902, date: '20240509', weight: '169.2' },
  { cal: 1925, date: '20240510', weight: '169.5' },
  { cal: 1928, date: '20240511', weight: '' },
  { cal: 2159, date: '20240512', weight: '169.0' },
  { cal: 2402, date: '20240513', weight: '' },
  { cal: 1918, date: '20240514', weight: '168.7' },
  { cal: 1928, date: '20240515', weight: '166.7' },
  { cal: 1893, date: '20240516', weight: '166.0' },
  { cal: 1866, date: '20240517', weight: '166.1' },
  { cal: 1938, date: '20240518', weight: '165.3' },
  { cal: 1838, date: '20240519', weight: '167.1' },
  { cal: 1867, date: '20240520', weight: '167.3' },
  { cal: 1927, date: '20240521', weight: '165.7' },
  { cal: 1987, date: '20240522', weight: '165.3' },
  { cal: 2155, date: '20240523', weight: '165.2' },
  { cal: 2010, date: '20240524', weight: '165.6' },
  { cal: 1936, date: '20240525', weight: '165.8' },
  { cal: 1836, date: '20240526', weight: '164.4' },
  { cal: 1611, date: '20240527', weight: '164.5' },
  { cal: 1956, date: '20240528', weight: '164.1' },
  { cal: 1731, date: '20240529', weight: '164.3' },
  { cal: 1757, date: '20240530', weight: '162.9' },
  { cal: 1761, date: '20240531', weight: '164.6' },
  { cal: 1961, date: '20240601', weight: '164.4' },
  { cal: 1657, date: '20240602', weight: '164.7' },
  { cal: 1893, date: '20240603', weight: '162.3' },
  { cal: 1927, date: '20240604', weight: '162.7' },
  { cal: 1718, date: '20240605', weight: '162.2' },
  { cal: 1817, date: '20240606', weight: '161.9' },
]
*/