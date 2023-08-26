import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
import { Card, Image } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { searchBuses, allBuses } from "../api/transportApi";

const API_KEY = "nesar4623";

function BusesScreen({ route }) {
  const { from, to } = route?.params || {};
  const shouldShowLoadMoreButton = !from || !to;
  const [buses, setBuses] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isLoadingFirstPage, setIsLoadingFirstPage] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setBuses([]); // Clear the buses array to remove previous data from the screen
        setIsLoadingFirstPage(true);
        setIsSearching(true);

        let response;

        if (!from || !to) {
          const { data } = await allBuses(API_KEY, currentPage, 10);
          response = data;
        } else {
          const { data } = await searchBuses(API_KEY, from, to);
          response = data;
        }

        if (currentPage === 1) {
          setBuses(response.data);
        } else {
          setBuses((prevBuses) => [...prevBuses, ...response.data]);
        }

        setTotalCount(response.total_count);

        setIsLoadingFirstPage(false);
        setLoadingMore(false);
        setIsSearching(false);
      } catch (error) {
        console.error("Error fetching buses:", error);
        setIsLoadingFirstPage(false);
        setLoadingMore(false);
        setIsSearching(false);
      }
    };

    fetchBuses();
  }, [currentPage, from, to]);

  const loadMore = () => {
    if (buses.length < totalCount) {
      setLoadingMore(true);
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isLoadingFirstPage ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loading}
        />
      ) : buses.length === 0 ? (
        <Text>No routes found.</Text>
      ) : (
        buses.map((bus, index) => (
          <Card key={index} containerStyle={styles.card}>
            <Card.Title>
              {bus.englishName} ({bus.banglaName})
            </Card.Title>
            <View style={styles.totalCountContainer}>
              {totalCount >= 1 ? (
                <MaterialCommunityIcons
                  name="sticker-check"
                  size={24}
                  color="green"
                />
              ) : (
                <MaterialCommunityIcons
                  name="sticker-remove"
                  size={24}
                  color="red"
                />
              )}
              <Text style={styles.fromToText}>
                {from} - {to}
              </Text>
            </View>
            <Image
              source={{ uri: bus.image }}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.routesContainer}>
              {bus.routes.map((route, index) => (
                <View key={index} style={styles.routeItem}>
                  <Text style={styles.routeText}>{route}</Text>
                </View>
              ))}
            </View>
          </Card>
        ))
      )}
      <View style={styles.loadMoreButtonContainer}>
        {isSearching ? (
          <ActivityIndicator
            size="small"
            color="#0000ff"
            style={styles.loading}
          />
        ) : shouldShowLoadMoreButton ? ( // Check whether to show "Load More" button
          <Button
            title={loadingMore ? "Loading..." : "Load More"}
            containerStyle={styles.loadMoreButton}
            onPress={loadMore}
            disabled={buses.length >= totalCount || loadingMore}
          />
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  card: {
    borderRadius: 10,
    marginBottom: 15,
    elevation: 4,
  },
  totalCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  cardImage: {
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  routesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  routeItem: {
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    padding: 6,
    margin: 4,
  },
  fromToText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  routeText: {
    fontSize: 12,
    color: "#333",
  },
  loadMoreButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  loading: {
    marginTop: 40,
  },
  loadMoreButtonContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 80,
  },
});

export default BusesScreen;
