import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import NavigationBar from '../components/NavigationBar';
import DismissKeyboard from '../components/DismissKeyboard';

import { UserDataContext } from '../components/UserDataProvider';
import { UserLogContext } from '../components/UserLogProvider';

const screenWidth = Dimensions.get('window').width;

const Graph = () => {
  const [selectedRange, setSelectedRange] = useState('week');
  const [isModalVisible, setModalVisible] = useState(false);

  const { userData } = useContext(UserDataContext);
  const { userLogs } = useContext(UserLogContext);

  const graphData = !userLogs[0] ? {
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
  } : {
    week: {
      labels: userLogs.slice(0, 7).toReversed().map(log => `${log.dateId.slice(4, 6)}/${log.dateId.slice(6, 8)}`),
      weight: userLogs.slice(0, 7).toReversed().map(log => !isNaN(log.weight) ? log.weight : 0),
    },
    oneMonth: {
      labels: userLogs.slice(0, 28)
        .filter((_, index) => index % 7 === 0)
        .toReversed()
        .map(log => `${log.dateId.slice(4, 6)}/${log.dateId.slice(6, 8)}`),
      weight: userLogs.slice(0, 28)
        .filter((_, index) => index % 7 === 0)
        .toReversed()
        .map(log => !isNaN(log.weight) || null ? log.weight : 0),
    },
    twoMonths: {
      labels: userLogs.slice(0, 56)
        .filter((_, index) => index % 14 === 0)
        .toReversed()
        .map(log => `${log.dateId.slice(4, 6)}/${log.dateId.slice(6, 8)}`),
      weight: userLogs.slice(0, 56)
        .filter((_, index) => index % 14 === 0 || index === 59)
        .toReversed()
        .map(log => !isNaN(log.weight) || null ? log.weight : 0),
    },
    all: {
      labels: userLogs
        .filter((_, index) => index % 14 === 0 || index === userLogs.length - 1)
        .toReversed()
        .map(log => `${log.dateId.slice(4, 6)}/${log.dateId.slice(6, 8)}`),
      weight: userLogs
        .filter((_, index) => index % 14 === 0 || index === userLogs.length - 1)
        .toReversed()
        .map(log => !isNaN(log.weight) || null ? log.weight : 167),
    },
  };

  const data = graphData[selectedRange];

  const weightChange = data.weight[data.weight.length - 1] - data.weight[0];

  return (
    <DismissKeyboard>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.pickerButton}>
            <Text style={styles.pickerText}>{selectedRange.replace(/([A-Z])/g, ' $1')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <View>
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
            width={screenWidth - 100}
            height={350}
            yAxisSuffix={userData.weightUnits}
            yAxisInterval={1}
            chartConfig={{
              withVerticalLines: false,
              withHorizontalLines: false,
              withInnerLines: false,
              backgroundColor: '#000000',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '2',
              },
              propsForBackgroundLines: {
                stroke: '#000000',
                opacity: '0.2',
                strokeDasharray: ""
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 5,
            }}
          />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.text}>Weight changed: {weightChange.toFixed(2)} {userData.weightUnits}</Text>
        </View>

        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Picker
                selectedValue={selectedRange}
                style={styles.picker}
                onValueChange={(itemValue) => {
                  setSelectedRange(itemValue);
                  setModalVisible(false);
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
        <NavigationBar />
      </View>
    </DismissKeyboard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  header: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  body: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 0,
    paddingTop: 25,
    paddingBottom: 0,
    borderRadius: 10,
    marginBottom: 20,
  },
  footer: {
    justifyContent: 'center',
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  pickerButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  pickerText: {
    fontSize: 18,
  },
  text: {
    fontSize: 18,
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  picker: {
    width: '100%',
  },
});

export default Graph;
