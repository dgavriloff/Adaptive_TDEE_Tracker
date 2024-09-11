import { useState, useContext, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";

import { UserDataContext } from "../components/UserDataProvider";
import { NotificationContext } from "../components/NotificationProvider";

import Segment from "../components/Segment";
import BubbleButton from "../components/BubbleButton";
import MultipleToggleButtons from "../components/MultipleToggleButtons";
import { AuthContext } from "../components/AuthProvider";
import { useNavigation } from "@react-navigation/native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    width: "45%",
  },
});

export default NotificationSettings = () => {
  const { userData } = useContext(UserDataContext);
  const { user } = useContext(AuthContext);
  const {
    requestPermission,
    setReminder,
    permissionStatus,
    notification,
    createDateFromNotification,
    setRefresh,
    cancelNotificationByUid,
  } = useContext(NotificationContext);

  const [reminderDate, setReminderDate] = useState(
    createDateFromNotification(notification)
  );

  const [notifOn, setNotifOn] = useState(!!notification);

  const navigation = useNavigation();

  useEffect(() => {
    if (permissionStatus != "granted" && notifOn === "yes") {
      requestPermission().then((res) => {
        if (res != "granted") setNotifOn(false);
        console.log(`notif permission status for :${userData.uid}`, res);
      });
    }
  }, [notifOn]);

  const handleSave = () => {
    setReminder(reminderDate, user.uid)
      .then(() => {
        console.log(`reminder set for ${user.uid} at ${reminderDate}`);
        setRefresh(true);
        navigation.goBack();
      })
      .catch((err) => console.log("error setting reminder", err));
  };

  return (
    <View style={styles.container}>
      <Segment label={"Would you like to set up reminders?"}>
        <MultipleToggleButtons
          values={[
            { value: { short: "Yes" }, key: true, pressable: true },
            {
              value: { short: "No" },
              key: false,
              pressable: true,
              custom: () => cancelNotificationByUid(user.uid),
            },
          ]}
          action={setNotifOn}
          defaultValue={{ short: notifOn }}
          containerStyle={styles.buttons}
          buttonStyle={styles.button}
        />
      </Segment>
      {notifOn && (
        <View style={{ width: "100%", alignItems: "center" }}>
          <Segment label={"Set a time for the reminder"}>
            <View style={{ alignItems: "center" }}>
              <RNDateTimePicker
                value={reminderDate}
                mode="time"
                format="HH:mm"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onChange={(event, date) => setReminderDate(date)}
              />
            </View>
          </Segment>
          <BubbleButton
            text={"Save and Go Back"}
            style={{}}
            onPress={handleSave}
          />
        </View>
      )}
    </View>
  );
};
