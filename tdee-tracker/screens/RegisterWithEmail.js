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
  const {} = useContext(UserDataContext);
  const { register } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (email !== confirmEmail) {
      showMessage({
        message: "Emails do not match",
        type: "warning",
        duration: 2500,
        titleStyle: {
          fontSize: 16,
          textAlign: "center",
        },
      });
      return;
    }
    register(email, password).catch((err) => {
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
      else if (err.code == "auth/weak-password")
        showMessage({
          message: err.message.slice(err.message.search("]") + 2),
          type: "warning",
          duration: 2500,
          titleStyle: {
            fontSize: 16,
            textAlign: "center",
          },
        });

      console.log("handle register error", err.code);
    });
  };

  return (
    <View style={styles.container}>
      <DismissKeyboard style={styles.parent}>
        <Segment label={"Register with Email and Password"}>
          <LabeledInput
            placeholder={"Enter your email"}
            onChangeText={setEmail}
            value={email}
            style={{ borderColor: "black" }}
            keyboardType={"text"}
          />
          <LabeledInput
            placeholder={"Confirm your email"}
            onChangeText={setConfirmEmail}
            keyboardType={"text"}
            value={confirmEmail}
          />
          <LabeledInput
            placeholder={"Enter a password"}
            onChangeText={setPassword}
            value={password}
            keyboardType={"text"}
            secureTextEntry={true}
          />
          <BubbleButton
            style={styles.button}
            text={"Register"}
            onPress={handleRegister}
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
});
