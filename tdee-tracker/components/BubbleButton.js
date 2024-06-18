import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

const BubbleButton = ({ onPress, text, style }) => {
  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        style={{
          padding: 20,
          backgroundColor: "#fff",
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
          width: "85%",
          ...style,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#007bff", // Blue color for buttons
          }}
        >
          {text}
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default BubbleButton;
