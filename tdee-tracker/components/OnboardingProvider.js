import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
  const [onboardingComplete, setOnboardingComplete] = useState(null);

  // Load onboarding status from AsyncStorage
  const loadOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem("onboardingComplete");
      setOnboardingComplete(value === "true");
    } catch (error) {
      console.error("Error loading onboarding status", error);
    }
  };

  const resetOnboardingStatus = async () => {
    try {
      await AsyncStorage.setItem("onboardingComplete", 'false');
      setOnboardingComplete(false);
    } catch (error) {
      console.error("Error resetting onboarding status", error);
    }
  };

  // Mark onboarding as complete and store it in AsyncStorage
  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem("onboardingComplete", "true");
      setOnboardingComplete(true);
    } catch (error) {
      console.error("Error setting onboarding status", error);
    }
  };

  useEffect(() => {
    loadOnboardingStatus();
  }, []);

  return (
    <OnboardingContext.Provider
      value={{
        onboardingComplete,
        completeOnboarding,
        loadOnboardingStatus,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
