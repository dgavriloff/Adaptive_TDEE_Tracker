import React, { useContext, useState } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { AuthContext } from "../components/AuthProvider";
import DismissKeyboard from "../components/DismissKeyboard";

import LabeledInput from "../components/LabeledInput";
import Segment from "../components/Segment";
import BubbleButton from "../components/BubbleButton";
import { Divider } from "@rneui/base";


const Login = () => {
  const { login, register, isLoading} =
    useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = () => {
    setError(null);
    login(email, password).catch((err) => {
      if (err.code == "auth/invalid-email")
        setError("Incorrect email or password");

      console.log("handle login error", err.code);
    });
  };

  const handleRegister = () => {
    setError(null);
    register(email, password).catch((err) => {
      if (err.code == "auth/invalid-email") setError("Invalid Email");
      else if (err.code == "auth/weak-password")
        setError("Password has to be atleast 6 characters");

      console.log("handle register error", err.code);
    });
  };

  const handleForgot = () => {};

  return (
    <View style={styles.container}>
      <DismissKeyboard style={{ width: "100%", alignItems: "center" }}>
        <Segment label={"Login or Register"}>
          {error ? (
            <Text
              style={{ color: "red", fontSize: 16, justifyContent: "center" }}
            >
              {error}
            </Text>
          ) : (
            <Text></Text>
          )}
          <LabeledInput
            placeholder={"Email"}
            value={email}
            onChangeText={setEmail}
            keyboardType={"text"}
          />
          <LabeledInput
            placeholder={"Password"}
            value={password}
            onChangeText={setPassword}
            keyboardType={"text"}
          />
          <BubbleButton
            style={styles.button}
            text={"Login"}
            onPress={handleLogin}
            fontColor={"#000"}
          />
          <BubbleButton
            style={styles.button}
            text={"Register"}
            onPress={handleRegister}
            fontColor={"#000"}
          />
          <BubbleButton
            style={{ width: "50%", marginTop: 5, padding: 0 }}
            fontSize={15}
            text={"Forgot password?"}
            onPress={handleForgot}
          />

          <Divider style={styles.divider}></Divider>
          <BubbleButton
            style={styles.authButton}
            text={"Sign in with Google"}
            //onPress={}
          />
          <BubbleButton style={styles.authButton} text={"Sign in with Apple"} />
          <BubbleButton
            style={styles.authButton}
            text={"Sign in with Facebook"}
          />
        </Segment>
      </DismissKeyboard>
      {isLoading && <ActivityIndicator style={{ marginTop: 20 }} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    alignItems: "center",
    flexDirection: "column",
  },
  button: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    width: "100%",
    marginTop: 10,
  },
  divider: {
    marginTop: 20,
    marginBottom: 5,
  },
  authButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    width: "100%",
    marginTop: 18,
  },
});

export default Login;
