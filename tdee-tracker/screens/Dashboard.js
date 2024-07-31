import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LineChart } from "react-native-chart-kit";

import { UserDataContext } from "../components/UserDataProvider";
import { UserLogContext } from "../components/UserLogProvider";

import NavigationBar from "../components/NavigationBar"; // Make sure the path is correct
import Segment from "../components/Segment";
import BubbleButton from "../components/BubbleButton";
import Bold from "../components/Bold";

const Dashboard = () => {
  const navigation = useNavigation();
  const { userData } = useContext(UserDataContext);
  const { userLogs } = useContext(UserLogContext);

  const shownTdee = !userData.currentTDEE
    ? userData.calculatedTDEE
    : userData.currentTDEE;

  const calculateGoalDate = (userData) => {
    const weightDelta =
      userData.startWeight + userData.weightDelta - userData.goalWeight;
    const daysUntilGoal =
      userData.weightUnits === "lbs"
        ? (weightDelta * 3500) / userData.dailyCalorieDelta
        : (weightDelta * 2.20462 * 3500) / userData.dailyCalorieDelta;
    return new Date(new Date().getTime() + 86400000 * daysUntilGoal)
      .toDateString()
      .slice(3);
  };

  // Get dimensions of the screen
  const screenWidth = Dimensions.get("window").width * 0.75; // Considering the width of the segment
  const chartHeight = 200;
  const today = new Date();
  const graphData = !userLogs[0]
    ? {
        labels: [0],
        weight: [0],
      }
    : {
        labels: userLogs
          .slice(0, 7)
          .toReversed()
          .map((log) => {
            return `${log.dateId.slice(4, 6)}/${log.dateId.slice(6, 8)}`;
          }),
        weight: userLogs
          .slice(0, 7)
          .toReversed()
          .map((log) => {
            return !isNaN(log.weight) ? log.weight : 1;
          }),
      };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Segment label={"Summary"}>
        <Text style={styles.text}>Your TDEE is currently:</Text>
        <Text style={styles.text}>
          <Bold>~{shownTdee} calories</Bold>
        </Text>
        <Text></Text>
        <Text style={styles.text}>
          Daily calorie goal to {userData.loseOrGain ? "gain" : "lose"}{" "}
          {userData.weeklyWeightDelta} {userData.weightUnits} per week is:
        </Text>
        <Text style={styles.text}>
          <Bold>~{shownTdee - userData.dailyCalorieDelta} calories</Bold>
        </Text>
        <Text></Text>
        <Text style={styles.text}>
          You will reach your goal weight of {userData.goalWeight}{" "}
          {userData.weightUnits} on:
        </Text>
        <Text style={styles.text}>
          <Bold>{calculateGoalDate(userData)}</Bold>
        </Text>
      </Segment>

      <BubbleButton
        onPress={() => navigation.navigate("User Log")}
        text={"Log Todays Data"}
      />

      <BubbleButton
        onPress={() => navigation.navigate("Weekly Progress")}
        text={"Weekly Progress"}
      />

      <Segment label={"Last Seven Days"}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Graph")}
        >
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
              withVerticalLines= {false}
              chartConfig={{
                withInnerLines: false,
                backgroundColor: "#000000",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "0",
                },
                propsForBackgroundLines: {
                  stroke: "#000000",
                  opacity: "0.2",
                  strokeDasharray: "",
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 5,
              }}
            />
          </View>
        </TouchableOpacity>
      </Segment>
      </ScrollView>
      <NavigationBar />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: "#f0f0f0", // Light gray background
  },
  scrollContainer: {
    width: '100%',
    alignItems: "center",
    padding: 0,
    paddingBottom: 125
  },
  text: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  graphPlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#ffffff",
    marginTop: 10,
    borderRadius: 10,
  },
});

export default Dashboard;
