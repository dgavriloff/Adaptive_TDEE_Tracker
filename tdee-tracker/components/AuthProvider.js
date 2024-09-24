import React, { createContext, useState, useEffect } from "react";

import auth from "@react-native-firebase/auth";

import { appleAuth } from "@invertase/react-native-apple-authentication";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";

import { showMessage } from "react-native-flash-message";

GoogleSignin.configure({
  webClientId:
    "1004983932814-f501dmnb0ji68i16fre1qmvckjav9n1c.apps.googleusercontent.com",
});

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          await currentUser.reload(); // Refresh user data
          if (!auth().currentUser) {
            // User was deleted, handle logout
            setUser(null);
            // Optionally sign out
            await auth().signOut();
          } else {
            setUser(currentUser);
          }
        } catch (error) {
          console.log("Error reloading user", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });
    return subscriber; // Clean up subscription on unmount
  }, []);

  const login = (email, password) => {
    return auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log(`${email} has signed in`);
      })
      .catch((err) => {
        if (err.code === "auth/network-request-failed") {
          showMessage({
            type: "danger",
            message: "Network Error",
            description: "Please check your internet connection and try again.",
            titleStyle: { textAlign: "center", fontSize: 18 },
            duration: 2000,
          });
        } else {
          console.error("Login error:", err.code);
        }
        throw err;
      });
  };

  const logout = () => {
    return auth()
      .signOut()
      .then(() => console.log(`${user.email} has signed out`))
      .catch((err) => {
        console.log("logout error", err);
        throw err;
      });
  };

  const register = (email, password) => {
    return auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log(
          `account created and signed in as ${userCredential.user.email}`
        );
      })
      .catch((err) => {
        if (err.code === "auth/network-request-failed") {
          showMessage({
            type: "danger",
            message: "Network Error",
            description: "Please check your internet connection and try again.",
            titleStyle: { textAlign: "center", fontSize: 18 },
            duration: 2000,
          });
        } else {
          console.error("Register error:", err.code);
        }
        throw err;
      });
  };

  const onAppleButtonPress = () => {
    appleAuth
      .performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      })
      .then((response) => {
        if (!response.identityToken)
          throw new Error("Apple Sign-In failed - no identify token returned");
        const { identityToken, nonce } = response;
        const appleCredential = auth.AppleAuthProvider.credential(
          identityToken,
          nonce
        );

        auth().signInWithCredential(appleCredential);
      })
      .catch((err) => {
        console.log("error signing in with apple", err);
      });
  };

  const onGoogleButtonPress = () => {
    GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true }).then(
      () => {
        GoogleSignin.signIn().then(({ idToken }) => {
          const googleCredential = auth.GoogleAuthProvider.credential(idToken);

          auth().signInWithCredential(googleCredential);
        });
      }
    );
  };

  const onFacebookButtonPress = () => {
    LoginManager.logInWithPermissions(["public_profile", "email"]).then(
      (res) => {
        if (res.isCancelled) throw new Error("user cancelled facebook login");
        AccessToken.getCurrentAccessToken().then((data) => {
          if (!data) throw new Error("error obtaining access token");
          const facebookCred = auth.FacebookAuthProvider.credential(
            data.accessToken
          );
          auth().signInWithCredential(facebookCred);
        });
      }
    );
  };

  const forgotPassword = (email) => {
    return auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        showMessage({
          message: `A link has been sent to ${email}!`,
          type: "success",
          duration: 2500,
          titleStyle: {
            fontSize: 16,
            textAlign: "center",
          },
        });
      })
      .catch((err) => {
        console.log("error sending password reset email to ", email, err);
        throw err;
      });
  };

  const deleteCurrentAuthRecord = () => {
    setUser(null);
    return auth()
      .currentUser.delete()
      .then(() => console.log("deleted successfully"))
      .catch((err) => console.log("error deleting auth record", err));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        onAppleButtonPress,
        onGoogleButtonPress,
        onFacebookButtonPress,
        forgotPassword,
        deleteCurrentAuthRecord,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
