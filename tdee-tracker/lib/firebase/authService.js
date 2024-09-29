import { auth, appleAuth, GoogleSignin, LoginManager, AccessToken } from "../authProviders";
import { showMessage } from "react-native-flash-message";
import { NETWORK_ERROR_MESSAGE, PASSWORD_RESET_SUCCESS } from "../constants";

export const login = (email, password) => {
  return auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => console.log(`${email} has signed in`))
    .catch((err) => {
      if (err.code === "auth/network-request-failed") {
        showMessage(NETWORK_ERROR_MESSAGE);
      }
      throw err;
    });
};

export const logout = (user) => {
  return auth()
    .signOut()
    .then(() => console.log(`${user.email} has signed out`))
    .catch((err) => console.log("logout error", err));
};

export const register = (email, password) => {
  return auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => console.log(`Account created: ${userCredential.user.email}`))
    .catch((err) => {
      if (err.code === "auth/network-request-failed") {
        showMessage(NETWORK_ERROR_MESSAGE);
      }
      throw err;
    });
};

export const onAppleButtonPress = () => {
  return appleAuth
    .performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    })
    .then((response) => {
      if (!response.identityToken) throw new Error("Apple Sign-In failed - no identity token returned");
      const { identityToken, nonce } = response;
      const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
      return auth().signInWithCredential(appleCredential);
    })
    .catch((err) => console.log("error signing in with apple", err));
};

export const onGoogleButtonPress = () => {
  return GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
    .then(() => GoogleSignin.signIn().then(({ idToken }) => {
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      return auth().signInWithCredential(googleCredential);
    }))
    .catch((err) => console.log("error signing in with google", err));
};

export const onFacebookButtonPress = () => {
  return LoginManager.logInWithPermissions(["public_profile", "email"])
    .then((res) => {
      if (res.isCancelled) throw new Error("user cancelled facebook login");
      return AccessToken.getCurrentAccessToken().then((data) => {
        if (!data) throw new Error("error obtaining access token");
        const facebookCred = auth.FacebookAuthProvider.credential(data.accessToken);
        return auth().signInWithCredential(facebookCred);
      });
    })
    .catch((err) => console.log("error signing in with facebook", err));
};

export const forgotPassword = (email) => {
  return auth()
    .sendPasswordResetEmail(email)
    .then(() => showMessage(PASSWORD_RESET_SUCCESS(email)))
    .catch((err) => console.log("error sending password reset email to ", email, err));
};

export const deleteCurrentAuthRecord = (setUser) => {
  setUser(null);
  return auth()
    .currentUser.delete()
    .then(() => console.log("deleted successfully"))
    .catch((err) => console.log("error deleting auth record", err));
};
