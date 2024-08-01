import React, { useContext, useEffect } from 'react';
import { View, Text, SectionList, StyleSheet } from 'react-native';
import { UserDataContext } from '../components/UserDataProvider';
import { UserLogContext } from '../components/UserLogProvider';

const WeeklyProgress = () => {
  const { userData } = useContext(UserDataContext);
  const { weeklyLogs} = useContext(UserLogContext);


  const renderSectionHeader = ({ section }) => (
    <View style={styles.header}>
      <Text style={styles.headerText}>{section.title}</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.section}>
      <View style={styles.inlineContainer}>
        <Text style={styles.inlineText}>Avg Weight:</Text>
        <Text style={styles.inlineText}>Weight &#916;:</Text>
        <Text style={styles.inlineText}>Avg Calories:</Text>
        <Text style={styles.inlineText}>TDEE:</Text>
      </View>
      <View style={styles.inlineContainer}>
        <Text style={styles.inlineText}>{item.avgWeight} {userData.weightUnits}</Text>
        <Text style={styles.inlineText}>{item.weightDelta < 0 ? item.weightDelta : "+" + item.weightDelta} {userData.weightUnits}</Text>
        <Text style={styles.inlineText}>{item.avgCalories}</Text>
        <Text style={styles.inlineText}>{item.tdee}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
          <View style={styles.section}>
      <View style={styles.inlineContainer}>
        <Text style={styles.inlineText}>Weight &#916;:</Text>
        <Text style={styles.inlineText}>Avg Calories:</Text>
        <Text style={styles.inlineText}>Avg TDEE:</Text>
      </View>
      <View style={styles.inlineContainer}>
        <Text style={styles.inlineText}>{userData.weightDelta < 0 ? userData.weightDelta : '+' + userData.weightDelta} {userData.weightUnits}</Text>
        <Text style={styles.inlineText}>{Math.floor(weeklyLogs.reduce((sum, log) => { return (sum + log.data[0].avgCalories) }, 0) / weeklyLogs.length)}</Text>
        <Text style={styles.inlineText}>~{userData.currentTDEE}</Text>
      </View>

    </View>
      <SectionList
        sections={weeklyLogs.toReversed()}
        keyExtractor={(item) => item.weekId}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#e8e8e8',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  inlineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inlineText: {
    fontSize: 15,
    marginHorizontal: 10,
  },
});

export default WeeklyProgress;