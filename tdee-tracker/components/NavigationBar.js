import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { ThemeContext } from "./ThemeProvider";

const NavigationBar = () => {
  const navigation = useNavigation();
  const routeIndex = useNavigationState((state) => state.index);
  const routes = useNavigationState((state) => state.routes);

  const { currentTheme, darkMode } = useContext(ThemeContext)

  const styles = StyleSheet.create({
    navBar: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: currentTheme.foregroundColor, // Light gray background
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
      backgroundColor: currentTheme.backgroundColor, // Slightly lighter gray
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
          source={darkMode ? require("../public/inverted-home-icon.png") : require("../public/home-icon.png")}
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
          source={darkMode ? require("../public/inverted-list-icon.png") : require("../public/list-icon.png")}
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
          source={darkMode ? require("../public/inverted-graph-icon.png") : require("../public/graph-icon.png")}
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
          source={darkMode ? require("../public/inverted-account-icon.png") : require("../public/account-icon.png")}
          style={styles.icons}
        />
      </TouchableOpacity>
    </View>
  );
};


export default NavigationBar;
