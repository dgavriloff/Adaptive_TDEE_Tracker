import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Chart,
  VerticalAxis,
  HorizontalAxis,
  Line,
  Tooltip,
} from "react-native-responsive-linechart"; //

import { UserDataContext } from "../components/UserDataProvider";
import { UserLogContext } from "../components/UserLogProvider";

import NavigationBar from "../components/NavigationBar"; // Make sure the path is correct
import Segment from "../components/Segment";
import BubbleButton from "../components/BubbleButton";
import Bold from "../components/Bold";

const Dashboard = () => {
  const navigation = useNavigation();
  const { userData } = useContext(UserDataContext);
  const {
    userLogs,
    getRangedData,
    graphData: rawGraphData,
  } = useContext(UserLogContext);
  const [graphData, setGraphData] = useState(
    getRangedData(rawGraphData.length)
  );

  useEffect(() => {
    setGraphData(getRangedData(rawGraphData.length));
  }, [rawGraphData]);

  const shownTdee = !userData.currentTDEE
    ? userData.calculatedTDEE
    : userData.currentTDEE;

  const calculateGoalDate = (userData) => {
    const weightDelta = Math.abs(userData.currentWeight - userData.goalWeight);
    const daysUntilGoal =
      userData.weightUnits === "lbs"
        ? (weightDelta * 3500) / userData.dailyCalorieDelta
        : (weightDelta * 2.20462 * 3500) / userData.dailyCalorieDelta;
    return new Date(new Date().getTime() + 86400000 * daysUntilGoal)
      .toDateString()
      .slice(3);
  };
  const minValue =
    Math.floor(Math.min(...graphData.map((log) => log.y)) / 10) * 10 - 5;
  const maxValue =
    Math.ceil(Math.max(...graphData.map((log) => log.y)) / 10) * 10 + 5;
  const range = (size, start, interval) => {
    return [...Array(size).keys()].map((i) => i * interval + start);
  };

  // Get dimensions of the screen
  const screenWidth = Dimensions.get("window").width; // Considering the width of the segment

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
            <Bold>
              ~
              {userData.loseOrGain
                ? shownTdee + userData.dailyCalorieDelta
                : shownTdee - userData.dailyCalorieDelta}{" "}
              calories
            </Bold>
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

        <Segment label={"Weight Graph"}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Graph")}
          >
            <View style={styles.graphPlaceholder}>
              {graphData && (
                <Chart
                  style={{ height: 200, width: screenWidth - 100 }}
                  data={graphData}
                  padding={{ left: 45, bottom: 30, top: 20, right: 20 }}
                  xDomain={{
                    min: 0,
                    max: rawGraphData.length > 1 ? rawGraphData.length - 1 : 1,
                  }}
                  yDomain={{
                    min: minValue,
                    max: maxValue,
                  }}
                  disableGestures={true}
                >
                  <VerticalAxis
                    theme={{
                      labels: {
                        visible: true,
                        label: {
                          dx: -5,
                        },
                      },
                    }}
                    tickValues={range(
                      maxValue - minValue > 0
                        ? (maxValue - minValue) / 5 + 1
                        : 1,
                      minValue,
                      5
                    )}
                    includeOriginTick={true}
                  />

                  <HorizontalAxis
                    theme={{
                      grid: { visible: false },
                      labels: {
                        visible: true,
                        label: {
                          dy: -16,
                        },
                        formatter: (v) => {
                          const dateId =
                            graphData.length === 1
                              ? graphData[0].meta
                              : graphData.filter((log) => {
                                  return log.x === Math.floor(v);
                                })[0]?.meta;
                          return (
                            dateId &&
                            `${dateId.slice(4, 6)}/${dateId.slice(6, 8)}`
                          );
                        },
                      },
                    }}
                    tickCount={7 > graphData.length ? graphData.length : 7}
                    includeOriginTick={true}
                  />

                  {graphData && graphData.length === 1 ? (
                    <Line
                      theme={{
                        scatter: {
                          default: {
                            width: 5,
                            height: 5,
                          },
                        },
                      }}
                    />
                  ) : (
                    <Line />
                  )}
                </Chart>
              )}

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
    width: "100%",
    alignItems: "center",
    padding: 0,
    paddingBottom: 125,
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
