import React, { useContext, useEffect } from "react";
import { View, Text, SectionList, StyleSheet } from "react-native";
import { UserDataContext } from "../components/UserDataProvider";
import { UserLogContext } from "../components/UserLogProvider";

import Segment from "../components/Segment";
import { ThemeContext } from "../components/ThemeProvider";

const WeeklyProgress = () => {
  const { userData } = useContext(UserDataContext);
  const { weeklyLogs, getAverageCalories, posOrNeg } =
    useContext(UserLogContext);

    const {currentTheme} = useContext(ThemeContext)

  const renderSectionHeader = ({ section }) => (
    <View style={styles.header}>
      <Text style={styles.headerText}>{section.title}</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.section}>
      <View style={styles.inlineContainer}>
        <Text style={styles.inlineText}>
          {item.avgWeight} {userData.weightUnits}
        </Text>
        <Text style={styles.inlineText}>
          {posOrNeg(item.weightDelta)} {userData.weightUnits}
        </Text>
        <Text style={styles.inlineText}>{item.avgCalories}</Text>
        <Text style={styles.inlineText}>{item.tdee}</Text>
      </View>
    </View>
  );

  const EmptyListNotice = () => {
    return (
      <Segment label={"Not Enough Data"} style={{ ...styles.segmentStyle }}>
        <Text style={{ marginTop: 10, textAlign: "center" }}>
          {" "}
          Add at least one week of data to see weekly progress
        </Text>
      </Segment>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.backgroundColor,
    },
    header: {
      backgroundColor: currentTheme.sectionHeaderColor,
      padding: 10,
      borderRadius: 8,
      marginTop: 10,
    },
    headerText: {
      fontSize: 18,
      fontWeight: "bold",
      color: currentTheme.fontColor
    },
    section: {
      backgroundColor: currentTheme.foregroundColor,
      padding: 15,
      marginBottom: 10,
      borderRadius: 8,
      shadowColor: currentTheme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 2,
      paddingLeft: 5,
      paddingRight: 5,
    },
    inlineContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      
    },
    inlineText: {
      fontSize: 15,
      marginHorizontal: 10,
      color: currentTheme.fontColor
    },
    textColumn: {
      flexDirection: "column",
      alignItems: "center",
    },
    screenHeaderText: {
      fontSize: 15,
      textAlign: "center",
      fontWeight: "bold",
      color: currentTheme.fontColor
    },
    screenHeaderSubText: {
      fontSize: 15,
      textAlign: "center",
      color: currentTheme.fontColor
    },
    segmentStyle: {
      width: "100%",
    },
  });

  return (
    <View style={styles.container}>
      {weeklyLogs.length > 0 && (
        <Segment
          style={{
            ...styles.segmentStyle,
            marginTop: -10,
            paddingLeft: 5,
            paddingRight: 5,
          }}
        >
          <View style={{ ...styles.inlineContainer, marginTop: 10 }}>
            <Text style={{ ...styles.inlineText, fontWeight: "bold" }}>
              Avg Weight
            </Text>
            <Text style={{ ...styles.inlineText, fontWeight: "bold" }}>
              Weight &#916;
            </Text>
            <Text style={{ ...styles.inlineText, fontWeight: "bold" }}>
              Avg Calories
            </Text>
            <Text style={{ ...styles.inlineText, fontWeight: "bold" }}>
              TDEE
            </Text>
          </View>
        </Segment>
      )}

      <SectionList
        sections={weeklyLogs.toReversed()}
        keyExtractor={(item) => item.weekId}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={EmptyListNotice}
      />
      <Segment
        style={{ ...styles.segmentStyle, marginTop: 0, shadowOpacity: 0.1 }}
      >
        <View style={{ ...styles.inlineContainer, marginBottom: 10 }}>
          <View style={styles.textColumn}>
            <Text style={styles.screenHeaderText}>Weight &#916;:</Text>
            <Text style={styles.screenHeaderSubText}>
              {userData.weightDelta < 1
                ? userData.weightDelta
                : "+" + userData.weightDelta}{" "}
              {userData.weightUnits}
            </Text>
          </View>
          <View style={styles.textColumn}>
            <Text style={styles.screenHeaderText}>Avg Calories:</Text>
            <Text style={styles.screenHeaderSubText}>
              {getAverageCalories()}
            </Text>
          </View>
          <View style={styles.textColumn}>
            <Text style={styles.screenHeaderText}>Avg TDEE:</Text>

            <Text style={styles.screenHeaderSubText}>
              ~{userData.currentTDEE}
            </Text>
          </View>
        </View>
        <View style={styles.inlineContainer}></View>
      </Segment>
    </View>
  );
};



export default WeeklyProgress;
