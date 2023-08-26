import React, { useEffect, useState } from "react";
import {
  View,
  Modal,
  Text,
  Button,
  Linking,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import Constants from "expo-constants";
import Navigation from "./components/Navigation";
import { BackHandler } from "react-native";

export default function App() {
  const [internetConnected, setInternetConnected] = useState(true);
  const [loading, setLoading] = useState(true);
  const [updateRequired, setUpdateRequired] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [updateURL, setUpdateURL] = useState("");

  const API_KEY = "nesar4623";

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setInternetConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (internetConnected) {
      checkForUpdate();
    } else {
      setLoading(false);
    }
  }, [internetConnected]);

  const checkForUpdate = async () => {
    try {
      const appVersion = Constants.manifest.version;
      const response = await fetch(
        `https://transport-route-bd-server.vercel.app/api/v1/version?apikey=${API_KEY}&version=${appVersion}`
      );
      const data = await response.json();
      if (data && data.versionDetails) {
        const { updateRequired, message, updateURL } = data.versionDetails;
        setUpdateRequired(updateRequired);
        setUpdateMessage(message);
        setUpdateURL(updateURL);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error checking for updates:", error);
      setLoading(false);
    }
  };

  const exitApp = () => {
    BackHandler.exitApp();
  };

  const renderContent = () => {
    if (loading) return <ActivityIndicator size="large" color="#2196f3" />;
    if (!internetConnected)
      return (
        <Modal visible={true} animationType="fade" transparent={true}>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View style={{ width: "80%" }}>
              <Text>No Internet Connection</Text>
              <Text>
                Please check your internet connection and try again later.
              </Text>
              <Button title="Exit" onPress={exitApp} />
            </View>
          </View>
        </Modal>
      );
    if (updateRequired)
      return (
        <Modal visible={true} animationType="fade" transparent={true}>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View style={{ width: "80%" }}>
              <Text style={styles.modalTitle}>Update Required!</Text>
              <Text style={styles.modalContent}>{updateMessage}</Text>
              <Button title="Exit" onPress={exitApp} />
              <View style={styles.button} />
              <Button
                title="Update Now"
                onPress={() => Linking.openURL(updateURL)}
              />
            </View>
          </View>
        </Modal>
      );
    return (
      <View style={{ flex: 1 }}>
        <Navigation />
      </View>
    );
  };

  return <>{renderContent()}</>;
}

const styles = StyleSheet.create({
  modalTitle: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalContent: {
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    marginBottom: 5,
  },
});
