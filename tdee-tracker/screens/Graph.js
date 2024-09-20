import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import NavigationBar from "../components/NavigationBar";
import {
  Chart,
  Line,
  HorizontalAxis,
  VerticalAxis,
} from "react-native-responsive-linechart";

import { UserDataContext } from "../components/UserDataProvider";
import { UserLogContext } from "../components/UserLogProvider";
import Segment from "../components/Segment";
import MultipleToggleButtons from "../components/MultipleToggleButtons";
import { ThemeContext } from "../components/ThemeProvider";

const screenWidth = Dimensions.get("window").width;

const Graph = () => {
  const [selectedRange, setSelectedRange] = useState("all");

  const { currentTheme, hexToRgb } = useContext(ThemeContext);

  const { userData } = useContext(UserDataContext);
  const {
    userLogs,
    getRangedData,
    graphData: rawGraphData,
  } = useContext(UserLogContext);

  const ranges = {
    week: { name: "Week", value: 7, ticks: 7, short: "Wk" },
    oneMonth: { name: "One Month", value: 30, ticks: 4, short: "1m" },
    twoMonths: { name: "Two Months", value: 60, ticks: 8, short: "2m" },
    sixMonths: { name: "Six Months", value: 180, ticks: 8, short: "6m" },
    all: {
      name: "All Time",
      value: rawGraphData.length,
      ticks: Math.min(rawGraphData.length, 6),
      short: "All",
    },
  };

  const [graphData, setGraphData] = useState(
    getRangedData(ranges[selectedRange])
  );

  useEffect(() => {
    setGraphData(getRangedData(ranges[selectedRange].value));
  },[selectedRange])

  const handleRangeChange = (range) => {
    setGraphData(getRangedData(ranges[range].value));
    setSelectedRange(range);
  }


  const getRangeNameArray = () => {
    let arr = [];
    for (const [key, value] of Object.entries(ranges)) {
      if(value.value > rawGraphData.length)
        arr.push({ value: value, key: key, pressable: false });
      else
        arr.push({ value: value, key: key, pressable: true });
    }
    return arr;
  };

  const weightChange = graphData.data.slice(-1)[0].y - graphData.data[0].y;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.backgroundColor,
    },
    scrollContainer: {
      paddingBottom: 125,
      alignItems: "center",
    },
    text: {
      fontSize: currentTheme.fontSize,
      marginVertical: 10,
      textAlign: "center",
      color: currentTheme.fontColor
    },
    buttonContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      padding: 0,
      marginTop: 10
    },
  });
  

  if (userLogs[0])
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Segment
            label={"Graph Range"}
            style={{
              justifyContent: "center",
              flexDirection: "column",

            }}
          >
            <MultipleToggleButtons
              containerStyle={styles.buttonContainer}
              values={getRangeNameArray()}
              action={handleRangeChange}
              defaultValue={{short: 'all'}}
            />
          </Segment>
          <Segment label={ranges[selectedRange].name}>
            {graphData && (
              <Chart
                style={{ height: 200, width: screenWidth * 0.75 }}
                data={graphData.data}
                padding={{ left: 45, bottom: 30, top: 20, right: 20 }}
                xDomain={{
                  min: 0,
                  max:
                    ranges[selectedRange].value > 1
                      ? ranges[selectedRange].value - 1
                      : 1,
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
                  includeOriginTick={true} //
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
                            ? graphData[0].meta
                            : graphData.data.filter((log) => {
                                return log.x === Math.floor(v);
                              })[0]?.meta;
                        return (
                          dateId &&
                          `${dateId.slice(4, 6)}/${dateId.slice(6, 8)}` //
                        );
                      },
                    },
                  }}
                  tickCount={
                    ranges[selectedRange].ticks < graphData.data.length
                      ? ranges[selectedRange].ticks
                      : graphData.data.length
                  }
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
          </Segment>

          <Segment label={"Weight changed"}>
            <Text style={styles.text}>
              {" "}
              {weightChange > 0
                ? "+" + weightChange.toFixed(2)
                : weightChange.toFixed(2)}{" "}
              {userData.weightUnits}
            </Text>
          </Segment>
        </ScrollView>
        <NavigationBar />
      </View>
    );
};


export default Graph;
