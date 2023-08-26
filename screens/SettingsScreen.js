import React from "react";
import {
  View,
  Button,
  Alert,
  BackHandler,
  Text,
  StyleSheet,
} from "react-native";
import Constants from "expo-constants";

function SettingsScreen() {
  // Extract version from the app manifest
  const appVersion = Constants.manifest.version;

  const handleAbout = () => {
    Alert.alert(
      "About",
      `This app is designed to help users find bus services easily in Dhaka city. It allows users to view bus route details. The app is developed by ncosync and is currently at version ${appVersion}.`
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      "Privacy Policy",
      "Our app respects your privacy and does not collect any personal data such as names, addresses, phone numbers, or email addresses. However, we may use third-party services, including Google AdMob, to display ads within the app. These services may collect non-personal information such as device information and app usage data to provide relevant ads. We do not have access to this information and do not share any personal information with third parties. In addition, we use other third-party services, such as AsyncStorage and Expo Constants, to provide certain functionality within the app. These services may collect non-personal data to improve the performance and functionality of the app. However, we take reasonable measures to ensure the security of the app and the data it contains. Please note that while we strive to keep your information secure, no method of transmission over the internet or electronic storage is 100% secure.\n\nLearn More: https://ncosync.netlify.app/dhaka-city-bus-routes/privacy-policy.html",
      [
        {
          text: "Close",
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  const handleExit = () => {
    Alert.alert(
      "Exit",
      "Are you sure you want to exit?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Exit",
          onPress: () => {
            BackHandler.exitApp();
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <Button title="About" onPress={handleAbout} />
        <View style={styles.buttonMargin} />
        <Button title="Privacy Policy" onPress={handlePrivacyPolicy} />
        <View style={styles.buttonMargin} />
        <Button title="Exit" onPress={handleExit} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.versionText}>App Version: {appVersion}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: "center",
  },
  buttonMargin: {
    height: 10,
  },
  versionText: {
    marginBottom: 60,
    fontStyle: "italic",
  },
  footer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default SettingsScreen;
