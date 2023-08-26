import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { SearchBar } from "react-native-elements";

function SearchableDropdown({
  data,
  labelExtractor,
  onItemPress,
  placeholder,
  selectedValue,
}) {
  const [query, setQuery] = useState(selectedValue || "");
  const [filteredData, setFilteredData] = useState(data);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const newData = data.filter((item) => {
        const itemData = labelExtractor(item).toLowerCase();
        return itemData.includes(query.toLowerCase());
      });

      setFilteredData(newData);
      setNoResults(newData.length === 0);
      setShowSuggestions(query !== "" && newData.length > 0);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, data]);

  const handleItemPress = (item) => {
    onItemPress(item);
    setQuery(labelExtractor(item));
    setShowSuggestions(false);
  };

  return (
    <View style={{ marginBottom: 15 }}>
      <SearchBar
        placeholder={placeholder}
        onChangeText={(text) => {
          setQuery(text);
          setShowSuggestions(text !== "");
        }}
        value={query}
        lightTheme
        round
        clearIcon={{ color: "gray" }}
      />
      {filteredData.length === 0 && showSuggestions && (
        <Text style={{ alignSelf: "center", marginTop: 10, color: "gray" }}>
          No results found
        </Text>
      )}
      {showSuggestions && (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => labelExtractor(item)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#eee",
              }}
              onPress={() => handleItemPress(item)}
            >
              <Text>{labelExtractor(item)}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

export default SearchableDropdown;
