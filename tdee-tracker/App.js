import React, { useEffect } from "react";
import Providers from "./components/Providers";
import FlashMessage from "react-native-flash-message";
import Navigation from "./components/Navigation";
import { FLASH_MESSAGE_POSITION } from "./lib/constants";
import setupNotificationHandler from "./lib/utils/notificationHandler";

export default function App() {
  useEffect(() => {
    setupNotificationHandler();
  }, []);

  return (
    <Providers>
      <Navigation />
      <FlashMessage position={FLASH_MESSAGE_POSITION} />
    </Providers>
  );
}
