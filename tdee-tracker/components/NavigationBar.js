import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation} from '@react-navigation/native';
import { useNavigationContext } from './NavigationContext';

const NavigationBar = () => {
  const navigation = useNavigation();
  const { activeTab, setActiveTab } = useNavigationContext();

  const tabs = [
    { name: 'Dashboard', label: 'Home' },
    { name: 'UserLog', label: 'Log' },
    { name: 'Graph', label: 'Graph' },
    { name: 'Account', label: 'Account' },
  ];

  const handlePress = (name) => {
    setActiveTab(name);
    navigation.navigate(name);
  }

  return (
    <View style={styles.navbar}>
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.name;
        return (
          <TouchableOpacity
            key={index}
            style={[styles.button, isActive && styles.activeButton]}
            onPress={() => handlePress(tab.name)}
          >
            <Text style={[styles.buttonText, isActive && styles.activeButtonText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    padding: 0,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '12%'
  },
  button: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderWidth: 2,
    borderColor: '',
    marginLeft: -2,
    height: '100%'
  },
  activeButton: {
    backgroundColor: '#d3d3d3', // Lighter color for active button
  },
  buttonText: {
    fontSize: 16,
  },
  activeButtonText: {
    fontWeight: 'bold',
  },
});

export default NavigationBar;
