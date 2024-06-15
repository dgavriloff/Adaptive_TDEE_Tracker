import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';

import { UserDataContext } from '../components/UserDataProvider';
import { UserLogContext } from '../components/UserLogProvider';

import NavigationBar from '../components/NavigationBar'; // Make sure the path is correct

const Dashboard = () => {
  const navigation = useNavigation();
  const { userData } = useContext(UserDataContext);
  const { weeklyLogs, userLogs } = useContext(UserLogContext);

  const shownTdee = userData.currentTDEE === 0 ? userData.calculatedTDEE : userData.currentTDEE;

  const calculateGoalDate = (userData) => {
    const weightDelta = (userData.startWeight + userData.weightDelta) - userData.goalWeight;
    const daysUntilGoal = userData.weightUnits === 'lbs'
      ? weightDelta * 3500 / userData.dailyCalorieDelta
      : weightDelta * 2.20462 * 3500 / userData.dailyCalorieDelta;
    return new Date(new Date().getTime() + (86400000 * daysUntilGoal)).toDateString().slice(3);
  };

  // Get dimensions of the screen
  const screenWidth = Dimensions.get('window').width * 0.75; // Considering the width of the segment
  const chartHeight = 200;

  const graphData = !userLogs[0] ? {
    labels: [0],
    weight: [0]
  } : {
    labels: userLogs.slice(0,7).toReversed().map(log => {return `${log.dateId.slice(4,6)}/${log.dateId.slice(6,8)}`}),
    weight: userLogs.slice(0,7).toReversed().map(log => { return !isNaN(log.weight) ? log.weight : 1})
  }

  return (
    <View style={styles.container}>
      <View style={styles.segment}>
        <Text style={styles.text}>Your TDEE is currently:</Text>
        <Text style={styles.text}>~{shownTdee} calories</Text>
        <Text></Text>
        <Text style={styles.text}>Daily calorie goal to {userData.loseOrGain ? 'gain' : 'lose'} {userData.weeklyWeightDelta} {userData.weightUnits} per week is:</Text>
        <Text style={styles.text}>~{shownTdee - userData.dailyCalorieDelta} calories</Text>
        <Text></Text>
        <Text style={styles.text}>You will reach your goal weight of {userData.goalWeight} {userData.weightUnits} on:</Text>
        <Text style={styles.text}>{calculateGoalDate(userData)}</Text>
      </View>


      <TouchableOpacity 
        style={styles.segment} 
        onPress={() => navigation.navigate('User Log')}
      >
          <Text style={styles.buttonText}>Log Todays Data</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.segment} 
        onPress={() => navigation.navigate('Weekly Progress')}
      >
          <Text style={styles.buttonText}>Weekly Progress</Text>
      </TouchableOpacity>

      <View style={styles.segment}>
      <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Graph')}
        >
        <Text style={styles.buttonText}>Last Seven Days</Text>
        <View style={styles.graphPlaceholder}>
          
          
          <LineChart
            data={{
              labels: graphData.labels,
              datasets: [
                {
                  data: graphData.weight,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
            }}
            width={screenWidth} // from react-native
            height={chartHeight}
            yAxisSuffix={userData.weightUnits}
            yAxisInterval={1}
            chartConfig={{
              withVerticalLines: false,
              withHorizontalLines: false,
              withInnerLines: false,
              backgroundColor: '#000000',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '2',
              },
              propsForBackgroundLines: {
                stroke: '#000000',
                opacity: '0.2',
                strokeDasharray: ""
              },
            }}
            
            style={{
              marginVertical: 8,
              borderRadius: 5,
            }}
          />

        </View>
        </TouchableOpacity>
      </View>

      <NavigationBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 0,
    backgroundColor: '#f0f0f0', // Light gray background
  },
  segment: {
    width: '85%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    marginBottom: 17,
  },
  button: {
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff', // Blue color for buttons
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  graphPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#ffffff',
    marginTop: 10,
    borderRadius: 10,
  },
});

export default Dashboard;
