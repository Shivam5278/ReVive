import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet } from "react-native";

import Card from "../components/Card";
import colors from "../config/colors";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import ActivityIndicator from "../components/ActivityIndicator";
import { filterListings } from "../store/listings";
import { getCategories } from "../store/categories";
import { useIsFocused } from "@react-navigation/native";
import CategoryFilter from "../components/CategoryFilter";
import AppText from "../components/AppText";
import dbManager from "../firebase/database";

const categories = getCategories();

function ListingsScreen({ navigation }) {
  const [listings, setListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Call the function to retrieve listings from the Firebase Realtime Database
        const data = await dbManager.getListings();
        setListings(data);
        setLoading(false);
      } catch (error) {
        console.error("Error retrieving listings:", error);
        setLoading(false);
      }
    };

    fetchListings();
  }, []);
  const listingsArray = Object.entries(listings).map(
    ([listingId, listing]) => ({
      id: listingId,
      title: listing.title,
      price: listing.price,
      images: listing.images,
      category: listing.categoryId,
    })
  );
  // console.log(listingsArray);
  return (
    <>
      <ActivityIndicator visible={loading} />

      <Screen style={styles.screen}>
        <AppText style={styles.sectionHeader}>CATEGORIES</AppText>
        {isFocused && (
          <FlatList
            ListHeaderComponent={<CategoryFilter categories={categories} />}
            data={listingsArray}
            keyExtractor={(listing) => listing.id.toString()}
            renderItem={({ item }) => (
              <Card
                item={item}
                title={item.title}
                subTitle={"₹ " + item.price}
                imageUrl={item.images[0]}
                onPress={() =>
                  navigation.navigate(routes.LISTING_DETAILS, item)
                }
              />
            )}
          />
        )}
        {/* </ScrollView> */}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    margin: 10,
    color: colors.dark,
    fontWeight: "bold",
  },
  screen: {
    backgroundColor: colors.lightgrey,
  },
  categoryFilter: {
    marginTop: 10,
  },
});

export default ListingsScreen;
