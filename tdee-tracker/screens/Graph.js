import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import NavigationBar from "../components/NavigationBar";
import {
  Chart,
  Line,
  Area,
  HorizontalAxis,
  VerticalAxis,
} from "react-native-responsive-linechart";

import { UserDataContext } from "../components/UserDataProvider";
import { UserLogContext } from "../components/UserLogProvider";
import Segment from "../components/Segment";
import BubbleButton from "../components/BubbleButton";

const screenWidth = Dimensions.get("window").width;

const Graph = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState("all");
  const { userData } = useContext(UserDataContext);
  const {
    userLogs,
    getRangedData,
    graphData: rawGraphData,
  } = useContext(UserLogContext);

  const ranges = {
    week: { name: "Week", value: 7, ticks: 7 },
    oneMonth: { name: "One Month", value: 28, ticks: 4 },
    twoMonths: { name: "Two Months", value: 56, ticks: 8 },
    all: {
      name: "All Time",
      value: rawGraphData.length,
      ticks: Math.min(rawGraphData.length, 6),
    },
  };

  const [graphData, setGraphData] = useState(
    getRangedData(ranges[selectedRange])
  );
  const minValue =
    Math.floor(Math.min(...graphData.map((log) => log.y)) / 10) * 10;
  const maxValue =
    Math.ceil(Math.max(...graphData.map((log) => log.y)) / 10) * 10;

  const range = (size, start, interval) => {
    return [...Array(size).keys()].map((i) => i * interval + start);
  };

  const weightChange = graphData[graphData.length - 1].y - graphData[0].y;
  if (userLogs[0])
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Segment label={"Graph Range"} style={{ justifyContent: "center" }}>
            <View style={{ alignItems: "center" }}>
              <BubbleButton
                style={styles.pickerButton}
                onPress={() => setModalVisible(true)}
                text={ranges[selectedRange].name}
              />
            </View>
          </Segment>
          <Segment>
            {graphData && (
              <Chart
                style={{ height: 200, width: screenWidth - 100 }}
                data={graphData}
                padding={{ left: 45, bottom: 30, top: 20, right: 20 }}
                xDomain={{
                  min: 0,
                  max:
                    ranges[selectedRange].value > 1
                      ? ranges[selectedRange].value - 1
                      : 1,
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
                      label: {
                        dx: -5,
                      },
                    },
                  }}
                  tickValues={range(
                    maxValue - minValue > 0 ? (maxValue - minValue) / 5 + 1 : 1,
                    minValue,
                    5
                  )}
                  includeOriginTick={true} //
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
                          `${dateId.slice(4, 6)}/${dateId.slice(6, 8)}` //
                        );
                      },
                    },
                  }}
                  tickCount={
                    ranges[selectedRange].ticks < graphData.length
                      ? ranges[selectedRange].ticks
                      : graphData.length
                  }
                  includeOriginTick={true}
                />
                {graphData.length === 1 ? (
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
          <Modal
            transparent={true}
            visible={isModalVisible}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                  }}
                ></View>
              </TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Picker
                  selectedValue={selectedRange}
                  style={styles.picker}
                  onValueChange={(itemValue) => {
                    if (ranges[itemValue].value > ranges["all"].value) {
                      setGraphData(getRangedData(ranges["all"].value));
                      setSelectedRange("all");
                    } else {
                      setGraphData(getRangedData(ranges[itemValue].value));
                      setSelectedRange(itemValue);
                    }

                    console.log();
                  }}
                >
                  <Picker.Item label="Week" value={"week"} />
                  <Picker.Item label="One Month" value={"oneMonth"} />
                  <Picker.Item label="Two Months" value={"twoMonths"} />
                  <Picker.Item label="All" value={"all"} />
                </Picker>
              </View>
            </View>
          </Modal>
        </ScrollView>
        <NavigationBar />
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollContainer: {
    paddingBottom: 125,
    alignItems: "center",
  },
  pickerButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    width: "75%",
    marginTop: 5,
  },
  pickerText: {
    fontSize: 18,
    textAlign: "center",
  },
  text: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  picker: {
    width: "100%",
  },
  chart: {},
});

export default Graph;
