import React from "react";
import { AuthProvider } from "./AuthProvider";
import { UserDataProvider } from "./UserDataProvider";
import { UserLogProvider } from "./UserLogProvider";
import { StorageProvider } from "./StorageProvider";
import { NotificationProvider } from "./NotificationProvider";
import { ThemeProvider } from "./ThemeProvider";
import { OnboardingProvider } from "./OnboardingProvider";

const Providers = ({ children }) => {
  return (
    <AuthProvider>
      <UserDataProvider>
        <UserLogProvider>
          <StorageProvider>
            <NotificationProvider>
              <ThemeProvider>
                <OnboardingProvider>{children}</OnboardingProvider>
              </ThemeProvider>
            </NotificationProvider>
          </StorageProvider>
        </UserLogProvider>
      </UserDataProvider>
    </AuthProvider>
  );
};

export default Providers;
