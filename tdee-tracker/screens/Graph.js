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
import { LineChart } from "react-native-chart-kit";
import NavigationBar from "../components/NavigationBar";
import DismissKeyboard from "../components/DismissKeyboard";

import { UserDataContext } from "../components/UserDataProvider";
import { UserLogContext } from "../components/UserLogProvider";
import Segment from "../components/Segment";
import BubbleButton from "../components/BubbleButton";
import Bold from "../components/Bold";

const screenWidth = Dimensions.get("window").width;

const Graph = () => {
  const [selectedRange, setSelectedRange] = useState("week");
  const [isModalVisible, setModalVisible] = useState(false);

  const { userData } = useContext(UserDataContext);
  const { userLogs } = useContext(UserLogContext);

  const graphData = !userLogs[0]
    ? {
        week: {
          labels: [0],
          weight: [0],
        },
        oneMonth: {
          labels: [0],
          weight: [0],
        },
        twoMonths: {
          labels: [0],
          weight: [0],
        },
        all: {
          labels: [0],
          weight: [0],
        },
      }
    : {
        week: {
          name: "Week",
          labels: userLogs
            .slice(0, 7)
            .toReversed()
            .map(
              (log) => `${log.dateId.slice(4, 6)}/${log.dateId.slice(6, 8)}`
            ),
          weight: userLogs
            .slice(0, 7)
            .toReversed()
            .map((log) => (!isNaN(log.weight) ? log.weight : 0)),
        },
        oneMonth: {
          name: "One Month",
          labels: userLogs
            .slice(0, 28)
            .filter((_, index) => index % 5 === 0)
            .toReversed()
            .map(
              (log) => `${log.dateId.slice(4, 6)}/${log.dateId.slice(6, 8)}`
            ),
          weight: userLogs
            .slice(0, 28)
            .filter((_, index) => index % 1 === 0)
            .toReversed()
            .map((log) => (!isNaN(log.weight) ? log.weight : null)),
        },
        twoMonths: {
          name: "Two Months",
          labels: userLogs
            .slice(0, 56)
            .filter((_, index) => index % 14 === 0)
            .toReversed()
            .map(
              (log) => `${log.dateId.slice(4, 6)}/${log.dateId.slice(6, 8)}`
            ),
          weight: userLogs
            .slice(0, 56)
            .filter((_, index) => index % 1 === 0 || index === 59)
            .toReversed()
            .map((log) => (!isNaN(log.weight) ? log.weight : null)),
        },
        all: {
          name: "All Time",
          labels: userLogs
            .toReversed()
            .map((log, index) =>
              index % 28 === 0 || index === userLogs.length - 2
                ? `${log.dateId.slice(4, 6)}/${log.dateId.slice(6, 8)}`
                : ""
            ),
          weight: userLogs
            .filter((log) => !isNaN(log.weight) && log.weight)
            .toReversed()
            .map((log) => (!isNaN(log.weight) ? log.weight : null)),
        },
      };

  const data = graphData[selectedRange];

  const weightChange = data.weight[data.weight.length - 1] - data.weight[0];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Segment label={"Graph Range"} style={{ justifyContent: "center" }}>
          <View style={{ alignItems: "center" }}>
            <BubbleButton
              style={styles.pickerButton}
              onPress={() => setModalVisible(true)}
              text={graphData[selectedRange].name}
            />
          </View>
        </Segment>

        <Segment style={{}}>
          <LineChart
            data={{
              labels: data.labels,
              datasets: [
                {
                  data: data.weight,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
            }}
            width={screenWidth - 125}
            height={350}
            yAxisSuffix={userData.weightUnits}
            yAxisInterval={1}
            withVerticalLines={false}
            withHorizontalLines={true}
            chartConfig={{
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
            style={styles.chart}
          />
        </Segment>

        <Segment label={"Weight changed"}>
          <Text style={styles.text}>
            {" "}
            {weightChange.toFixed(2)} {userData.weightUnits}
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
                style={{ width: "100%", height: "100%", position: "absolute" }}
              ></View>
            </TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Picker
                selectedValue={selectedRange}
                style={styles.picker}
                onValueChange={(itemValue) => {
                  setSelectedRange(itemValue);
                }}
              >
                <Picker.Item label="Week" value="week" />
                <Picker.Item label="One Month" value="oneMonth" />
                <Picker.Item label="Two Months" value="twoMonths" />
                <Picker.Item label="All" value="all" />
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
