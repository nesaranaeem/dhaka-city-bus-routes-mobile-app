import React, { useState, useEffect } from "react";
import { View, Alert, ActivityIndicator } from "react-native";
import { Button } from "react-native-elements";
import SearchableDropdown from "../components/SearchableDropdown";
import { InterstitialAd, AdEventType } from "react-native-google-mobile-ads";
import { fetchRoutes } from "../api/transportApi";

const API_KEY = "nesar4623";
const adUnitId = "ca-app-pub-7938825868377602/1252337808";

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ["vehicle", "transport", "car"],
});

function HomeScreen({ navigation }) {
  const [routes, setRoutes] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Handling different Ad events
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
      }
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        navigation.navigate("Buses", { from: from, to: to });
      }
    );

    const unsubscribeError = interstitial.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.error("Interstitial ad error:", error.message);
        navigation.navigate("Buses", { from: from, to: to });
      }
    );

    // Start loading the interstitial straight away
    interstitial.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, [from, to]);

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const response = await fetchRoutes(API_KEY);
        const data = response.data;
        setRoutes(data.routeList);
        setLoading(false);
      } catch (error) {
        console.error("Error loading routes:", error);
        setLoading(false);
      }
    };

    loadRoutes();
  }, []);

  const handleSearch = async () => {
    if (!from || !to) {
      Alert.alert("Error", "Both 'From' and 'To' fields must be filled.");
      return;
    }

    if (from === to) {
      Alert.alert("Error", "'From' and 'To' cannot be the same.");
      return;
    }

    if (loaded) {
      interstitial.show();
    } else {
      navigation.navigate("Buses", { from: from, to: to });
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{ padding: 10 }}>
      <SearchableDropdown
        data={routes}
        labelExtractor={(item) => item.routeName}
        onItemPress={(item) => setFrom(item.routeName)}
        placeholder="From"
        selectedValue={from}
      />
      <SearchableDropdown
        data={routes}
        labelExtractor={(item) => item.routeName}
        onItemPress={(item) => setTo(item.routeName)}
        placeholder="To"
        selectedValue={to}
      />
      <Button
        title="Search"
        containerStyle={{ marginTop: 20 }}
        onPress={handleSearch}
      />
    </View>
  );
}

export default HomeScreen;
