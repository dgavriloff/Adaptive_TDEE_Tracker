import { useEffect, useState } from "react";
import React from "react";
import { Text, TextInput, View, } from "react-native";

export default ({ units, placeholder, value, onChangeText, borderColor, keyboardType, style, secureTextEntry }) => {

  
  return (
    <View>
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
          ...style
        }}
        placeholder={placeholder}
        keyboardType= {keyboardType ? keyboardType : 'numeric'}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};