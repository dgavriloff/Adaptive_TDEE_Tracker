

export default () => {
  return (
    <>
    </>
  )
}

/* UploadData.js
import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { documen }
import Papa from 'papaparse';

const UploadData = () => {
  const [csvData, setCsvData] = useState(null);

  const handleFilePicker = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.csv],
      });

      if (res && res[0]) {
        const file = res[0];
        readCsvFile(file);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        // Unknown error
        Alert.alert('Error', 'An error occurred while picking the file');
      }
    }
  };

  const readCsvFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const csv = reader.result;
      Papa.parse(csv, {
        header: true,
        complete: (results) => {
          setCsvData(results.data);
          console.log('Parsed CSV data:', results.data);
        },
        error: (error) => {
          Alert.alert('Error', 'An error occurred while parsing the file');
        },
      });
    };
    reader.onerror = () => {
      Alert.alert('Error', 'An error occurred while reading the file');
    };

    reader.readAsText(file.uri);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload CSV Data</Text>
      <Button title="Choose File" onPress={handleFilePicker} />
      {csvData && <Text style={styles.result}>File Parsed Successfully</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    color: 'green',
  },
});

export default UploadData;*/
