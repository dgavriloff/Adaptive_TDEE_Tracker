import React, { useContext } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { OnboardingContext } from "../components/OnboardingProvider"; // adjust path as needed
import BubbleButton from "../components/BubbleButton";

const Dots = ({ selected }) => {
  let backgroundColor;

  backgroundColor = selected ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.3)";

  return (
    <View
      style={{
        width: 6,
        height: 6,
        marginHorizontal: 3,
        backgroundColor,
      }}
    />
  );
};

const Done = ({ ...props }) => (
  <TouchableOpacity style={{ marginHorizontal: 10 }} {...props}>
    <Text style={{ fontSize: 16 }}>Done</Text>
  </TouchableOpacity>
);

const InitialOnboarding = () => {
  const { completeOnboarding } = useContext(OnboardingContext);

  const handleOnDone = () => {
    completeOnboarding();
  };

const styles = StyleSheet.create({
    imageStyle: {
        height: 200,
        width: 200,
    },
    lastPage: {
        flexDirection: 'column-reverse',
        alignItems: 'center',
        width: '100%',
    },
    buttonStyle: {
        width: '85%'
    }
});

  return (
    <Onboarding
      onSkip={handleOnDone}
      onDone={handleOnDone}
      DotComponent={Dots}
      DoneButtonComponent={Done}
      pages={[
        {
          backgroundColor: "#f0f0f0",
          image: <Image source={require('../assets/clear-logo.png')}  style={styles.imageStyle} />,  // Example image, adjust path
          title: "Welcome to Calorie Coach",
          subtitle: "Where you get tailored information about your total daily energy expenditure (TDEE)",
        },
        {
          backgroundColor: "#f0f0f0",
          image: <Image source={require('../assets/goal-man.png')} style={styles.imageStyle}/>,  // Example image, adjust path
          title: "Set Your Goals",
          subtitle: "To let us customize your caloric plan for your body and routine",
        },
        {
            backgroundColor: "#f0f0f0",
            image: <Image source={require('../assets/log-people.png') }style={styles.imageStyle} />,  // Example image, adjust path
            title: "Log Your Data",
            subtitle: "As you gain or lose weight, your TDEE will be updated based on your weight change "
          },
          {
            backgroundColor: "#f0f0f0",
            image: <Image source={require('../assets/two-men.png') }style={styles.imageStyle}/>,  // Example image, adjust path
            title: "Adjust Your Calories",
            subtitle: "Once you're ready to switch gears and either cut or bulk, you will have an accurate TDEE to start with"
          },
        {
          backgroundColor: "#f0f0f0",
          image: <Image source={require('../assets/clear-logo.png') }style={styles.imageStyle}/>,  // Example image, adjust path
          title: 'Create an Account to get Started!',
          subtitle: <View style={styles.lastPage}>
          <BubbleButton text={'Sign up'} onPress={handleOnDone}/>
        </View>
          
        },
      ]}
    />
  );
};

export default InitialOnboarding;
