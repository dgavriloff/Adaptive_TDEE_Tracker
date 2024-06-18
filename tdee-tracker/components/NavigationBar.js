import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation, useNavigationState } from "@react-navigation/native";

const NavigationBar = () => {
  const navigation = useNavigation();
  const routeIndex = useNavigationState((state) => state.index);
  const routes = useNavigationState((state) => state.routes);

  return (
    <View style={styles.navBar}>
      <TouchableOpacity
        style={[
          styles.navButton,
          routeIndex === routes.findIndex((r) => r.name === "Dashboard") &&
            styles.activeButton,
        ]}
        onPress={() => navigation.navigate("Dashboard")}
      >
        <Image
          source={require("../public/home-icon.png")}
          style={styles.icons}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.navButton,
          routeIndex === routes.findIndex((r) => r.name === "User Log") &&
            styles.activeButton,
        ]}
        onPress={() => navigation.navigate("User Log")}
      >
        <Image
          source={require("../public/list-icon.png")}
          style={styles.icons}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.navButton,
          routeIndex === routes.findIndex((r) => r.name === "Graph") &&
            styles.activeButton,
        ]}
        onPress={() => navigation.navigate("Graph")}
      >
        <Image
          source={require("../public/graph-icon.png")}
          style={styles.icons}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.navButton,
          routeIndex === routes.findIndex((r) => r.name === "Account") &&
            styles.activeButton,
        ]}
        onPress={() => navigation.navigate("Account")}
      >
        <Image
          source={require("../public/account-icon.png")}
          style={styles.icons}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff", // Light gray background
    height: 100,
    width: "100%",
    position: "absolute",
    bottom: 0,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 15,
  },
  navButton: {
    padding: 15,
  },
  activeButton: {
    backgroundColor: "#f0f0f0", // Slightly lighter gray
    borderRadius: 5,
  },
  navText: {
    fontSize: 16,
    color: "#007bff", // Blue color for the text
  },
  icons: {
    height: 40,
    width: 40,
  },
});

export default NavigationBar;
