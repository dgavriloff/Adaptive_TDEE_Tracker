import React, { createContext, useContext, useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const navigation = useNavigation();
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      setActiveTab(navigation.getCurrentRoute().name);
    });
    return unsubscribe;
  }, [navigation]);
  
  
  const value = {
    activeTab,
    setActiveTab,
  };

  return (
    <NavigationContext.Provider value={value} >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationContext = () => useContext(NavigationContext);