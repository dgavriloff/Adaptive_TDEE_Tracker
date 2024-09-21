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

import { AppleButton } from "@invertase/react-native-apple-authentication";
import GoogleButton from "../components/GoogleButton";
import { ThemeContext } from "../components/ThemeProvider";

const Login = ({ navigation }) => {
  const {
    login,
    isLoading,
    onAppleButtonPress,
    onGoogleButtonPress,
    forgotPassword,
  } = useContext(AuthContext);
  const {currentTheme, darkMode} = useContext(ThemeContext)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = () => {
    setError(null);
    login(email, password).catch((err) => {
      if (
        err.code == "auth/invalid-email" ||
        err.code == "auth/invalid-credential"
      )
        setError("Incorrect email or password");

      console.log("handle login error", err.code);
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.backgroundColor
    },
    inputContainer: {
      alignItems: "center",
      flexDirection: "column",
    },
    button: {
      backgroundColor: currentTheme.backgroundColor,
      padding: 10,
      width: "100%",
      marginTop: 10,
    },
    divider: {
      marginTop: 20,
      marginBottom: 5,
      width: "45%",
    },
    authButton: {
      backgroundColor: "#f0f0f0",
      padding: 10,
      width: "100%",
      marginTop: 18,
    },
    dividerParent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
      marginTop: 10,
    },
    dividerText: {
      top: 5,
    },
  });
  

  return (
    <View style={styles.container}>
      <DismissKeyboard
        style={{
          width: "100%",
          alignItems: "center",
        }}
      >
        <Segment label={"Login to Calorie Coach"}>
          <AppleButton
            buttonStyle={darkMode ? AppleButton.Style.BLACK : AppleButton.Style.BLACK }
            buttonType={AppleButton.Type.SIGN_IN}
            style={{
              padding: 10,
              width: "100%",
              height: 45,
              marginTop: 10
            }}
            onPress={() => onAppleButtonPress()}
          />
          <GoogleButton
            buttonStyle={{ marginTop: 18 }}
            onPress={() => onGoogleButtonPress()}
          />

          <BubbleButton
            style={{ ...styles.button, marginTop: 18 }}
            text={"Register with Email"}
            onPress={() => navigation.navigate("RegisterWithEmail")}
            fontColor={currentTheme.fontColor}
          />

          <View style={styles.dividerParent}>
            <Divider style={styles.divider}></Divider>
            <Text style={styles.dividerText}>or</Text>
            <Divider style={styles.divider}></Divider>
          </View>
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
            secureTextEntry={true}
            keyboardType={"text"}
          />
          <BubbleButton
            style={styles.button}
            text={"Login"}
            onPress={handleLogin}
            fontColor={currentTheme.fontColor}
          />

          <BubbleButton
            style={{ width: "50%", marginTop: 5, padding: 0 }}
            fontSize={15}
            text={"Forgot password?"}
            onPress={() => navigation.navigate("ForgotPassword")}
          />
        </Segment>
      </DismissKeyboard>
      {isLoading && <ActivityIndicator style={{ marginTop: 20 }} />}
    </View>
  );
};


export default Login;
