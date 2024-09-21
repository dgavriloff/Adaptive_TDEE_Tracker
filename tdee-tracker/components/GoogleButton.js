import { useContext } from "react";
import { TouchableOpacity, StyleSheet, Image, Text } from "react-native";
import { ThemeContext } from "./ThemeProvider";

export default ({ onPress, buttonStyle, textStyle }) => {
  const {  currentTheme } = useContext(ThemeContext);
  const styles = StyleSheet.create({
    buttonStyle: {
      flexDirection: "row",
      justifyContent: "center",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: currentTheme.googleStroke,
      width: "100%",
      alignItems: "center",
      borderRadius: 25,
      backgroundColor: currentTheme.googleFill,
      height: 44,
    },
    logoStyle: {
      position: "absolute",
      left: 12,
      width: 20,
      height: 20,
      borderRadius: 100,
    },
    textStyle: {
      fontSize: 16,
      fontFamily: "Roboto",
      color: currentTheme.googleText
    },
  });
  return (
    <TouchableOpacity
      style={{ ...styles.buttonStyle, ...buttonStyle }}
      onPress={onPress}
    >
      <Image
        source={require("../assets/g-logo.png")}
        style={styles.logoStyle}
      />
      <Text style={{ ...styles.textStyle, ...textStyle }}>
        Sign in with Google
      </Text>
    </TouchableOpacity>
  );
};
