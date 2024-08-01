import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import { AuthContext } from "../components/AuthProvider";
import { UserDataContext } from "../components/UserDataProvider";

import BubbleButton from "../components/BubbleButton";
import NavigationBar from "../components/NavigationBar";
import Segment from "../components/Segment";

const Account = () => {
  const { userData } = useContext(UserDataContext);
  const { logout, user } = useContext(AuthContext);

  const navigation = useNavigation();

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Segment style={styles.profileSection}>
          <Image
            source={require("../assets/blank-profile.jpg")}
            style={styles.profileImage}
          />
          <Text style={styles.email}>{user ? userData.email : ""}</Text>
        </Segment>
        <BubbleButton
          onPress={() => navigation.navigate("Change Personal Details")}
          text={"Change Personal Details"}
        />
        <BubbleButton
          onPress={() => navigation.navigate("Change Goals")}
          text={"Change Goals"}
        />
        <BubbleButton
          onPress={() => navigation.navigate("Upload Data")}
          text={"Upload MyFitnessPal Data"}
        />
        <BubbleButton onPress={() => logout()} text={"Logout"} style={{}} />
      </ScrollView>
      <NavigationBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0", // Light gray background
  },
  scrollContainer: {
    alignItems: "center",
    paddingBottom: 125,
    width: "100%",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileImage: {
    width: 125,
    height: 125,
    borderRadius: 90,
  },
  email: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
});

export default Account;
