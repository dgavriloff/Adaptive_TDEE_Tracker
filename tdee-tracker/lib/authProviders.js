import auth from "@react-native-firebase/auth";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";

GoogleSignin.configure({
  webClientId:
    "1004983932814-f501dmnb0ji68i16fre1qmvckjav9n1c.apps.googleusercontent.com",
});

export { auth, appleAuth, GoogleSignin, LoginManager, AccessToken };
