import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';

const NavigationBar = () => {
  const navigation = useNavigation();
  const routeIndex = useNavigationState(state => state.index);
  const routes = useNavigationState(state => state.routes);

  return (
    <View style={styles.navBar}>
      <TouchableOpacity
        style={[styles.navButton, routeIndex === routes.findIndex(r => r.name === 'Dashboard') && styles.activeButton]}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navButton, routeIndex === routes.findIndex(r => r.name === 'User Log') && styles.activeButton]}
        onPress={() => navigation.navigate('User Log')}
      >
        <Text style={styles.navText}>User Log</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navButton, routeIndex === routes.findIndex(r => r.name === 'Graph') && styles.activeButton]}
        onPress={() => navigation.navigate('Graph')}
      >
        <Text style={styles.navText}>Graph</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navButton, routeIndex === routes.findIndex(r => r.name === 'Account') && styles.activeButton]}
        onPress={() => navigation.navigate('Account')}
      >
        <Text style={styles.navText}>Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#d3d3d3', // Light gray background
    height: 100,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  navButton: {
    padding: 25,
  },
  activeButton: {
    backgroundColor: '#e0e0e0', // Slightly lighter gray
    borderRadius: 5,
  },
  navText: {
    fontSize: 16,
    color: '#007bff', // Blue color for the text
  },
});

export default NavigationBar;