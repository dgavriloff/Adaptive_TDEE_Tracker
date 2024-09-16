import { View, StyleSheet, Text } from "react-native";
import { Divider } from "@rneui/base";
import { useContext } from "react";
import { ThemeContext } from "./ThemeProvider";

export default ({ children, label, style }) => {
  const { currentTheme } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    segment: {
      justifyContent: "center",
      width: "85%",
      backgroundColor: currentTheme.foregroundColor,
      padding: 20,
      borderRadius: 10,
      marginTop: '5%',
      ...style,
    },
    label: {
      fontSize: currentTheme.segmentLabelFontSize,
      fontWeight: "bold",
      textAlign: "center",
      color: currentTheme.fontColor
    },
    divider: {
      margin: 7,
    },
  });

  return (
    <View style={styles.segment}>
      {label && <Text style={styles.label}>{label}</Text>}
      {label && <Divider style={styles.divider} color={currentTheme.backgroundColor} width={2} />}
      {children}
    </View>
  );
};
