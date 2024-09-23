import { View, Text, StyleSheet, Alert } from "react-native";
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../components/ThemeProvider";
import { AuthContext } from "../components/AuthProvider";
import LabeledInput from "../components/LabeledInput";
import BubbleButton from "../components/BubbleButton";
import Segment from "../components/Segment";
import { UserDataContext } from "../components/UserDataProvider";
import { UserLogContext } from "../components/UserLogProvider";
import { StorageContext } from "../components/StorageProvider";
import { showMessage } from "react-native-flash-message";

export default DeleteAccount = () => {
  const { currentTheme } = useContext(ThemeContext);
  const { logout, deleteCurrentAuthRecord, user, setUser } = useContext(AuthContext);
  const { deleteUserDoc } = useContext(UserDataContext);
  const { deleteUserLogs } = useContext(UserLogContext);
  const { deleteProfilePicture } = useContext(StorageContext);
  const [confirm, setConfirm] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    setConfirmed(
      confirm.toLowerCase() === "confirm" ||
        confirm.toLowerCase() === "'confirm'"
    );
  }, [confirm]);

  const askAgain = () => {
    Alert.alert("Are you sure?", "This action is irreversible.", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => setConfirm(""),
      },
      {
        text: "Delete Account",
        style: "destructive",
        onPress: deleteAndLogout,
      },
    ]);
  };

  const deleteAndLogout = () => {
    const uid = user.uid;
    setUser(null);
    deleteProfilePicture(uid);
    deleteUserLogs(uid);
    deleteUserDoc(uid);
    deleteCurrentAuthRecord(uid);
    showMessage({
        type:'success',
        message: "Account deleted successfully",
        textStyle: { fontSize: 22 }
    })
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      backgroundColor: currentTheme.backgroundColor,
    },
    buttonStyle: {
      backgroundColor: confirmed
        ? currentTheme.foregroundColor
        : currentTheme.backgroundColor,
    },
  });

  return (
    <View style={styles.container}>
      <Segment label={"Please confirm your account deletion"}>
        <LabeledInput
          placeholder={"Enter 'confirm'"}
          onChangeText={setConfirm}
          value={confirm}
        />
      </Segment>
      {confirmed && (
        <BubbleButton
          text={"Delete Account"}
          fontColor={"red"}
          onPress={askAgain}
        />
      )}
    </View>
  );
};
