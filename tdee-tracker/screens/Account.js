import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import * as FileSystem from "expo-file-system";

import { AuthContext } from "../components/AuthProvider";
import { UserDataContext } from "../components/UserDataProvider";
import { StorageContext } from "../components/StorageProvider";

import BubbleButton from "../components/BubbleButton";
import NavigationBar from "../components/NavigationBar";
import Segment from "../components/Segment";
import { NotificationContext } from "../components/NotificationProvider";
import { ThemeContext } from "../components/ThemeProvider";

const Account = () => {
  const { userData } = useContext(UserDataContext);
  const { logout, user } = useContext(AuthContext);
  const { setProfileImage } = useContext(StorageContext);
  const { cancelNotificationByUid } = useContext(NotificationContext);

  const { currentTheme, setDarkMode } = useContext(ThemeContext);

  const [tempPicUri, setTempPicUri] = useState(null);
  const [picExists, setPicExists] = useState(false);

  const localProfilePictureURI = user
    ? `${FileSystem.cacheDirectory}profile-picture-${user.uid}.jpg`
    : null;

  const navigation = useNavigation();

  useEffect(() => {
    checkForLocalFile(localProfilePictureURI);
  }, []);

  const checkForLocalFile = (uri) => {
    FileSystem.getInfoAsync(uri)
      .then((res) => {
        setPicExists(res.exists);
      })
      .catch((err) => {
        console.log("error checking if local file exists", err);
      });
  };

  const handlePicturePress = async () => {
    return launchImageLibrary({
      mediaType: "photo",
      maxWidth: 500,
      maxHeight: 500,
      selectionLimit: 1,
    }).then((result) => {
      setProfileImage(result.assets[0].uri);
      setTempPicUri(result.assets[0].uri);
      setPicExists(true);
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.backgroundColor, // Light gray background
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
      fontSize: 18,
      fontWeight: "bold",
      marginLeft: 10,
      color: currentTheme.fontColor,
    },
  });

  if (user && userData)
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Segment style={styles.profileSection}>
            <TouchableOpacity onPress={() => handlePicturePress()}>
              {picExists ? (
                <Image
                  source={{
                    uri: tempPicUri ? tempPicUri : localProfilePictureURI,
                  }}
                  style={styles.profileImage}
                />
              ) : (
                <Image
                  source={require("../assets/blank-profile.jpg")}
                  style={styles.profileImage}
                />
              )}
            </TouchableOpacity>
            <Text style={styles.email}>
              {userData.email?.substring(0, userData.email.indexOf("@"))}
            </Text>
          </Segment>
          <BubbleButton
            onPress={() => navigation.navigate("SourcesFAQ")}
            text={"Frequently Asked Questions"}
          />
          <BubbleButton
            onPress={() => navigation.navigate("Change Personal Details")}
            text={"Change Personal Details"}
          />
          <BubbleButton
            onPress={() => navigation.navigate("Change Goals")}
            text={"Change Goals"}
          />
          <BubbleButton
            onPress={() => navigation.navigate("Notification Settings")}
            text={"Notification Settings"}
          />
          <BubbleButton
            onPress={() => navigation.navigate("Change Theme")}
            text={"Change Theme"}
          />
          {false && (
            <BubbleButton
              onPress={() => navigation.navigate("Upload Data")}
              text={"Upload MyFitnessPal Data"}
            />
          )}
          <BubbleButton
            onPress={() => {
              cancelNotificationByUid(user.uid).then(() => {
                setDarkMode(false);
                logout();
              });
            }}
            text={"Logout"}
          />
        </ScrollView>
        <NavigationBar />
      </View>
    );
};

export default Account;
