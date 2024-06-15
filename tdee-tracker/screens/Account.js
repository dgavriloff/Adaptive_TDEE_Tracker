import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { UserDataContext } from '../components/UserDataProvider';
import { AuthContext } from '../components/AuthProvider';

import NavigationBar from '../components/NavigationBar';

const Account = () => {
  const { userData } = useContext(UserDataContext);
  const { logout, user } = useContext(AuthContext);

  const navigation = useNavigation();

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image source={require('../assets/blank-profile.jpg')} style={styles.profileImage} />
        <Text style={styles.email}>{user ? userData.email : ''}</Text>
      </View>

      <View style={styles.buttonsSection}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Change Personal Details')}
        >
          <Text style={styles.buttonText}>Change Personal Details</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Change Goals')}
        >
          <Text style={styles.buttonText}>Change Goals</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          //onPress={() => navigation.navigate('UploadData')}
        >
          <Text style={styles.buttonText}>Upload Data</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.logoutButton}>
      <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    <NavigationBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f0f0f0', // Light gray background
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  profileImage: {
    width: 125,
    height: 125,
    borderRadius: 90,
  },
  email: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  buttonsSection: {
    width: '85%',
  },
  button: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff', // Blue color for buttons
  },
  logoutButton: {
    justifyContent: 'center',
    flex: 1,
    width: '85%',
    marginTop: 75,
  }
});

export default Account;
