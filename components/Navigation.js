import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import HomeScreen from "../screens/HomeScreen";
import BusesScreen from "../screens/BusesScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { StatusBar, StyleSheet, View } from "react-native";

const adUnitId = "ca-app-pub-7938825868377602/5673964391";
const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerAdContainer: {
    position: "absolute",
    bottom: 48,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    padding: 20,
    zIndex: 1,
  },
});

export default function Navigation() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <StatusBar backgroundColor="#2196f3" barStyle="light-content" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === "Home")
                iconName = focused ? "home" : "home-outline";
              else if (route.name === "Buses")
                iconName = focused ? "bus" : "bus-outline";
              else if (route.name === "Settings")
                iconName = focused ? "settings" : "settings-outline";
              return (
                <Icon
                  name={iconName}
                  size={size}
                  color={color}
                  type="ionicon"
                />
              );
            },
            tabBarActiveTintColor: "tomato", // Updated
            tabBarInactiveTintColor: "gray", // Updated
            tabBarStyle: {
              display: "flex", // Updated
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Buses" component={BusesScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <View style={styles.bannerAdContainer}>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>
    </View>
  );
}
