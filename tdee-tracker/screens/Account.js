import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { UserDataContext } from "../components/UserDataProvider";
import { AuthContext } from "../components/AuthProvider";

import NavigationBar from "../components/NavigationBar";
import BubbleButton from "../components/BubbleButton";
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
        //onPress={() => navigation.navigate("Upload Data")}
        text={"Upload Data"}
      />
      <BubbleButton
        onPress={() => logout()}
        text={"Logout"}
        style={{ position: "absolute", bottom: 0, marginBottom: 120 }}
      />
      <NavigationBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0", // Light gray background
    alignItems: "center",
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
