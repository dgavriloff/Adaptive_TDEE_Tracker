import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { uploadPhoto, setProfileImage, downloadAndCacheProfilePicture, deleteProfilePicture } from "../lib/firebase/storageService";

const StorageContext = createContext();

const StorageProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      downloadAndCacheProfilePicture(user);
    }
    setLoading(false);
  }, [user]);

  return (
    <StorageContext.Provider value={{ setProfileImage: (photoURI) => setProfileImage(photoURI, user), loading, deleteProfilePicture }}>
      {children}
    </StorageContext.Provider>
  );
};

export { StorageContext, StorageProvider };
