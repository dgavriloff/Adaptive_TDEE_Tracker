import React, { createContext, useState, useEffect, useContext } from "react";
import storage from "@react-native-firebase/storage";
import * as FileSystem from "expo-file-system";

import { AuthContext } from "./AuthProvider";

const StorageContext = createContext();

const StorageProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      downloadAndCacheProfilePicture();
    }
    setLoading(false);
  }, [user]);

  const uploadPhoto = (photoRef, photoURI) => {
    setLoading(true);
    return photoRef
      .putFile(photoURI)
      .then(() => {
        console.log("photo successfully uploaded by", user.uid);
        setLoading(false);
      })
      .catch((err) => {
        console.log("error uploading photo", err);
        setLoading(false);
      });
  };

  const setProfileImage = (photoURI) => {
    setLoading(true);
    return uploadPhoto(
      storage().ref(`images/profile-pictures/${user.uid}`),
      photoURI
    )
      .then(() => {
        downloadAndCacheProfilePicture().then(() => {
          setLoading(false);
        });
        console.log("profile picture set");
      })
      .catch((err) => {
        console.log("err setting profile picture", err);
        setLoading(false);
      });
  };

  const downloadAndCacheProfilePicture = () => {
    const localURI =
      FileSystem.cacheDirectory + "profile-picture-" + user.uid + ".jpg";
    const picRef = storage().ref(`images/profile-pictures/${user.uid}`);
    if (picRef)
      return picRef
        .getDownloadURL()
        .then((res) => {
          FileSystem.downloadAsync(res, localURI)
            .then(() => {
              console.log("propic downloaded and cached");
            })
            .catch((err) => {
              console.log("error downloading and caching propic", err);
            });
        })
        .catch((err) => {
          console.log("error generating url for propic", err);
        });
  };

  return (
    <StorageContext.Provider value={{ setProfileImage, loading }}>
      {children}
    </StorageContext.Provider>
  );
};

export { StorageContext, StorageProvider };
