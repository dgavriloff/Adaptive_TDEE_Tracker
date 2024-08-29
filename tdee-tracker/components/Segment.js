import { View, StyleSheet, Text } from "react-native";
import { Divider } from "@rneui/base";

export default ({ children, label, style }) => {
  const styles = StyleSheet.create({
    segment: {
      justifyContent: "center",
      width: "85%",
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 10,
      marginTop: '7.5%',
      ...style,
    },
    label: {
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
    },
    divider: {
      margin: 7,
    },
  });

  return (
    <View style={styles.segment}>
      {label && <Text style={styles.label}>{label}</Text>}
      {label && <Divider style={styles.divider} color="#f0f0f0" width={2} />}
      {children}
    </View>
  );
};
