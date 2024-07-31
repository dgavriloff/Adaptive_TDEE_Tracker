import React, { useContext, useState } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import Papa from "papaparse";

import Segment from "../components/Segment";
import BubbleButton from "../components/BubbleButton";

import { UserLogContext } from "../components/UserLogProvider";

const UploadData = () => {
  const { userLogs } = useContext(UserLogContext);

  const [csvData, setCsvData] = useState(null);

  const [weightData, setWeightData] = useState({});
  const [weightRes, setWeightRes] = useState(null);
  const [calData, setCalData] = useState({});
  const [calRes, setCalRes] = useState(null);

  const handleFilePicker = (weightOrCal) => {

    DocumentPicker.getDocumentAsync({
      type: ["text/csv"],
    })
      .then((res) => {
        if (res.assets) {
          // weight = true / cal = false
          weightOrCal ? setWeightRes(res.assets[0]) : setCalRes(res.assets[0]);
        } else if (res.canceled) throw new Error("picker cancelled");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const readCsvFile = (uri, setterFunction) => {
    FileSystem.readAsStringAsync(uri)
      .then((fileContents) => {
        console.log("File contents:", fileContents);
        Papa.parse(fileContents, {
          header: true,
          complete: (results) => {
            setterFunction(results.data);
            //console.log("Parsed CSV data:", results.data);
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
    if(!calRes || !weightRes)
      Alert.alert('Please upload both files before submitting.');
    readCsvFile(calRes.uri, setCalData)
    readCsvFile(weightRes.uri, setWeightData)
    parseData(calData, weightData)
  };

  const parseData = (cal, wgt) => {
    setCalData(calData.map((log) => ({
      ...log,
      dateId: log.date.replace(/-/g, '')
    })))
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload CSV Data</Text>
      <BubbleButton
        text={calRes ? calRes.name : "Upload MFP Nutrition Summary"}
        onPress={() => handleFilePicker(false)}
        unTouchable={calRes}
        xOnPress={() => setCalRes(null)}
      />
      <BubbleButton
        text={weightRes ? weightRes.name : "Upload MFP Measurement Summary"}
        onPress={() => handleFilePicker(true)}
        unTouchable={weightRes}
        xOnPress={() => {setWeightRes(null)}}
      />
      <BubbleButton
        text="Submit"
        onPress={() => submitData()}
      />
      {console.log(weightData)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    color: "green",
  },
});

export default UploadData;
