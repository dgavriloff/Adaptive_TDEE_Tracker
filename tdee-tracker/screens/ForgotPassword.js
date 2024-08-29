import { useContext, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import DismissKeyboard from "../components/DismissKeyboard";
import BubbleButton from "../components/BubbleButton";
import LabeledInput from "../components/LabeledInput";
import Segment from "../components/Segment";

import { UserDataContext } from "../components/UserDataProvider";
import { AuthContext } from "../components/AuthProvider";

import { showMessage } from "react-native-flash-message";

export default RegisterWithEmail = () => {
  const { forgotPassword } = useContext(AuthContext);

  const [email, setEmail] = useState("");

  const handlePress = () => {
    forgotPassword(email).catch((err) => {
      if (err.code == "auth/invalid-email")
        showMessage({
          message: "Email needs to be in the format of example@example.com",
          type: "warning",
          duration: 2500,
          titleStyle: {
            fontSize: 16,
            textAlign: "center",
          },
        });
    });
  };

  return (
    <View style={styles.container}>
      <DismissKeyboard style={styles.parent}>
        <Segment label={"Forgot Password"}>
          <Text style={styles.text}>
            1. Enter the email associated with your account. {'\n'}
          </Text>
          <Text style={styles.text}>2. Press submit.{'\n'}</Text>
          <Text style={styles.text}>
            3. Check your inbox for a link to reset your password.
          </Text>
          <LabeledInput
            placeholder={"Enter your email"}
            onChangeText={setEmail}
            value={email}
            style={{ borderColor: "black" }}
            keyboardType={"text"}
          />
          <BubbleButton
            style={styles.button}
            text={"Submit"}
            onPress={handlePress}
            fontColor={"#000"}
          />
        </Segment>
      </DismissKeyboard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  parent: {
    flexDirection: "column",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    width: "100%",
    marginTop: 10,
  },
  text: {
    fontSize: 18,
  },
});
