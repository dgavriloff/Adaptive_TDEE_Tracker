import { useEffect, useState } from "react";
import React from "react";
import { Text, TextInput, View, Button } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default ({
  units,
  placeholder,
  value,
  onChangeText,
  borderColor,
  keyboardType,
  style,
  secureTextEntry,
}) => {
  const [shown, setShown] = useState(false); //shown password is true, hidden is false

  return (
    <View
      style={{
        //flexDirection: "row",
      }}
    >
      <Text
        style={{
          position: "absolute",
          left: "80%",
          fontSize: 18,
          paddingTop: 20,
        }}
      >
        {units}
      </Text>

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: borderColor,
          padding: 10,
          fontSize: 20,
          borderRadius: 5,
          marginTop: 10,
          marginBottom: 10,
          width: "100%",
          ...style,
          zIndex: -1,
        }}
        placeholder={placeholder}
        keyboardType={keyboardType ? keyboardType : "numeric"}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry ? !shown : false}
      />
      {secureTextEntry && (
        <View
        style={{
          position: 'absolute',
          right: 0,
          paddingTop: 15,
          zIndex: 1,
          height: '20'
        }}
        >
        <Button

          onPress={() => {
            setShown(!shown);
          }}
          title={shown ? "hide" : "show"}
        >
          <Text
            style={{
              textAlign: "center",
            }}
          >
            {shown ? "hide" : "show"}
          </Text>
        </Button>
        </View>
      )}
    </View>
  );
};
