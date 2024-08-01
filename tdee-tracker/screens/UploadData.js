import React, { useContext, useState } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import Papa from "papaparse";

import Segment from "../components/Segment";
import BubbleButton from "../components/BubbleButton";

import { UserLogContext } from "../components/UserLogProvider";

const UploadData = () => {
  const { userLogs, addUserLog, updateUserLog, getWeekIdFromDateId, setMultipleUserLogs } =
    useContext(UserLogContext);

  const [csvData, setCsvData] = useState(null);

  const [wgtData, setWgtData] = useState({});
  const [wgtRes, setWgtRes] = useState(null);
  const [calData, setCalData] = useState({});
  const [calRes, setCalRes] = useState(null);
  const [resultCache, setResultCache] = useState([]);

  const handleCalFilePicker = () => {
    DocumentPicker.getDocumentAsync({
      type: ["text/csv"],
    })
      .then((res) => {
        if (res.assets) {
          setCalRes(res.assets[0]);
          readCsvFile(res.assets[0].uri, setCalData);
        } else if (res.canceled) throw new Error("picker cancelled");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleWgtFilePicker = () => {
    DocumentPicker.getDocumentAsync({
      type: ["text/csv"],
    })
      .then((res) => {
        if (res.assets) {
          setWgtRes(res.assets[0]);
          readCsvFile(res.assets[0].uri, setWgtData);
        } else if (res.canceled) throw new Error("picker cancelled");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const readCsvFile = (uri, setterFunction) => {
    FileSystem.readAsStringAsync(uri)
      .then((fileContents) => {
        Papa.parse(fileContents, {
          header: true,
          complete: (results) => {
            setterFunction(results.data);
          },
          error: (error) => {
            console.error("Error parsing CSV:", error);
            Alert.alert("Error", "An error occurred while parsing the file");
          },
        });
      })
      .catch((error) => {
        console.error("Error reading file:", error);
        Alert.alert("Error", "An error occurred while reading the file");
      });
  };

  const submitData = () => {
    if (!calData || !wgtData) {
      Alert.alert("Please upload both files before submitting.");
      return;
    }
    const parsedData = wgtData.slice(0, wgtData.length-1).map((wLog) => ({
      dateId: wLog.Date.replace(/-/g, ""),
      weight: parseFloat(wLog.Weight),
      calories: calData
        .filter((cLog) => cLog.Date == wLog.Date)
        .reduce((sum, cLog) => sum + parseInt(cLog.Calories), 0),
      weekId: getWeekIdFromDateId(wLog.Date.replace(/-/g, ""))
    })).filter(log => !userLogs.find(uLog => uLog.dateId === log.dateId));

    setMultipleUserLogs(parsedData).then(() => {
      Alert.alert('Data successfully uploaded');
      setCalData(null);
      setCalRes(null);
      setWgtData(null);
      setWgtData(null);
    }
    )
    
  };

  return (
    <View style={styles.container}>
      <Segment label={'Upload MyFitnessPal Data'}>
        <Text style={styles.text}>1. Download your data from MyFitnessPal</Text>
        <Text></Text>
        <Text style={styles.text}>2. Upload your Nutrition and Measurement file with their respective buttons</Text>
        <Text></Text>
        <Text style={styles.text}>3. Press submit</Text>
      </Segment>

      <BubbleButton
        text={calRes ? calRes.name : "Upload MFP Nutrition Summary"}
        onPress={() => handleCalFilePicker(false)}
        unTouchable={calRes}
        xOnPress={() => {
          setCalRes(null), setCalData(null);
        }}
      />
      <BubbleButton
        text={wgtRes ? wgtRes.name : "Upload MFP Measurement Summary"}
        onPress={() => handleWgtFilePicker(true)}
        unTouchable={wgtRes}
        xOnPress={() => {
          setWgtRes(null), setWgtData(null);
        }}
      />
      <BubbleButton text="Submit" onPress={() => submitData()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    color: "green",
  },
});

export default UploadData;
