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
import { ThemeContext } from "../components/ThemeProvider";

const Dashboard = () => {
  const navigation = useNavigation();
  const { userData, calculateGoalDate } = useContext(UserDataContext);
  const {
    userLogs,
    getRangedData,
    graphData: rawGraphData,
    createRange,
    getInterval,
  } = useContext(UserLogContext);
  const { currentTheme, hexToRgb } = useContext(ThemeContext);

  const [graphData, setGraphData] = useState(
    getRangedData(rawGraphData.length)
  );

  useEffect(() => {
    setGraphData(getRangedData(rawGraphData.length));
  }, [rawGraphData]);

  const shownTdee = !userData.currentTDEE
    ? userData.calculatedTDEE
    : userData.currentTDEE;

  const screenWidth = Dimensions.get("window").width;

  const goalDate = calculateGoalDate(userData);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 0,
      backgroundColor: currentTheme.backgroundColor,
    },
    scrollContainer: {
      width: "100%",
      alignItems: "center",
      padding: 0,
      paddingBottom: 125,
    },
    text: {
      fontSize: 16,
      color: currentTheme.fontColor,
      textAlign: "center",
    },
    graphPlaceholder: {
      width: "100%",
      height: 200,
      backgroundColor: currentTheme.foregroundColor,
      marginTop: 10,
      borderRadius: 10,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Segment label={"Summary"}>
          <Text style={styles.text}>
            Your TDEE is currently:
            {"\n"}
            <Bold>~{shownTdee} calories</Bold>
            {"\n"}
          </Text>
          <Text style={styles.text}>
            Daily calorie goal to {userData.loseOrGain ? "gain" : "lose"}{" "}
            {userData.weeklyWeightDelta} {userData.weightUnits} per week is:
            {"\n"}
            <Bold>
              ~
              {userData.loseOrGain
                ? shownTdee + userData.dailyCalorieDelta
                : shownTdee - userData.dailyCalorieDelta}{" "}
              calories
            </Bold>
            {"\n"}
          </Text>
          {goalDate ? (
            <Text style={styles.text}>
              You will reach your goal weight of {userData.goalWeight}{" "}
              {userData.weightUnits} on: {"\n"} <Bold>{goalDate}</Bold>
            </Text>
          ) : (
            <Text style={styles.text}>You are maintaining your weight</Text>
          )}
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
              {graphData && rawGraphData && (
                <Chart
                  style={{ height: 200, width: screenWidth * 0.75 }}
                  data={graphData.data}
                  padding={{ left: 45, bottom: 30, top: 20, right: 20 }}
                  xDomain={{
                    min: 0,
                    max: rawGraphData.length > 1 ? rawGraphData.length - 1 : 1,
                  }}
                  yDomain={{
                    min: graphData.min,
                    max: Math.max(graphData.max, graphData.yTicks.slice(-1)[0]),
                  }}
                  disableGestures={true}
                >
                  <VerticalAxis
                    theme={{
                      grid: {
                        stroke: {
                          color: hexToRgb(currentTheme.fontColor, 0.45),
                        },
                      },
                      labels: {
                        visible: true,
                        label: {
                          dx: -5,
                          color: currentTheme.fontColor,
                        },

                        axis: {
                          stroke: {
                            width: 2,
                          },
                        },
                      },
                      ticks: {
                        stroke: {
                          color: currentTheme.fontColor,
                        },
                      },
                    }}
                    tickValues={graphData.yTicks}
                    includeOriginTick={true}
                  />

                  <HorizontalAxis
                    theme={{
                      grid: { visible: false },
                      ticks: {
                        stroke: {
                          color: currentTheme.fontColor,
                        },
                      },
                      axis: {
                        stroke: {
                          width: 2,
                        },
                      },
                      labels: {
                        visible: true,
                        label: {
                          dy: -16,
                          color: currentTheme.fontColor,
                        },

                        formatter: (v) => {
                          const dateId =
                            graphData.data.length === 1
                              ? graphData.data[0].meta
                              : graphData.data.filter((log) => {
                                  return log.x === Math.floor(v);
                                })[0]?.meta;
                          return (
                            dateId &&
                            `${dateId.slice(4, 6)}/${dateId.slice(6, 8)}`
                          );
                        },
                      },
                    }}
                    tickCount={graphData.defaultXTicks}
                    includeOriginTick={true}
                  />

                  {graphData && graphData.data.length === 1 ? (
                    <Line
                      theme={{
                        scatter: {
                          default: {
                            width: 5,
                            height: 5,
                            color: currentTheme.fontColor,
                          },
                          stroke: {
                            color: currentTheme.fontColor,
                          },
                        },
                      }}
                    />
                  ) : (
                    <Line
                      theme={{
                        stroke: {
                          color: currentTheme.fontColor,
                        },
                      }}
                    />
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

export default Dashboard;

/*                  */
