import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { UserDataContext } from '../components/UserDataProvider';
import { UserLogContext } from '../components/UserLogProvider';

import NavigationBar from '../components/NavigationBar'; // Make sure the path is correct

const Dashboard = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.segment}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('User Log')}
        >
          <Text style={styles.buttonText}>Log Today's Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.segment}>
        <Text style={styles.text}>Welcome to the Dashboard</Text>
        <Text style={styles.text}>Here is your summary</Text>
        <Text style={styles.text}>Keep track of your progress!</Text>
      </View>

      <View style={styles.segment}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Weekly Progress')}
        >
          <Text style={styles.buttonText}>Weekly Progress</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.segment}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Graph')}
        >
          <Text style={styles.buttonText}>Weekly Progress Graph</Text>
          {/* Placeholder for the graph */}
          <View style={styles.graphPlaceholder}></View>
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
    marginBottom: 50
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
    backgroundColor: '#e0e0e0',
    marginTop: 10,
  },
});

export default Dashboard;