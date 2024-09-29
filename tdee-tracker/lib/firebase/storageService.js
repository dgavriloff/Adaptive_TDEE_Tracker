import storage from "@react-native-firebase/storage";
import * as FileSystem from "expo-file-system";

export const uploadPhoto = (photoRef, photoURI, user) => {
  return photoRef
    .putFile(photoURI)
    .then(() => {
      console.log("photo successfully uploaded by", user.uid);
    })
    .catch((err) => {
      console.log("error uploading photo", err);
    });
};

export const setProfileImage = (photoURI, user) => {
  return uploadPhoto(
    storage().ref(`images/profile-pictures/${user.uid}`),
    photoURI,
    user
  )
    .then(() => {
      downloadAndCacheProfilePicture(user).then(() => {});
      console.log("profile picture set");
    })
    .catch((err) => {
      console.log("err setting profile picture", err);
    });
};

export const downloadAndCacheProfilePicture = (user) => {
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

export const deleteProfilePicture = (uid) => {
  return storage()
    .ref(`images/profile-pictures/${uid}`)
    .delete()
    .then(() => {
      console.log("profile picture deleted");
    })
    .catch((err) => {
      console.log("error deleting profile picture", err);
    });
};
