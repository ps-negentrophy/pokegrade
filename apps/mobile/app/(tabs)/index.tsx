import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { mockListings, formatPrice, getGradeBadgeColor } from "../../data/mockListings";
import type { Listing } from "@pokecard/types";
import { useState } from "react";

const FILTERS = ["All", "PSA 10", "BGS 9.5", "1st Ed", "Shadowless", "Japanese"];

function MobileListingCard({ listing }: { listing: Listing }) {
  const router = useRouter();
  const primaryImage = listing.card.images[0];

  return (
    <TouchableOpacity
      onPress={() => router.push(`/listing/${listing.id}`)}
      style={styles.card}
      activeOpacity={0.8}
    >
      <View style={styles.cardImageContainer}>
        <Image
          source={{ uri: primaryImage?.url }}
          style={styles.cardImage}
          resizeMode="contain"
        />
        {listing.card.isFirstEdition && (
          <View style={styles.firstEdBadge}>
            <Text style={styles.firstEdText}>1st</Text>
          </View>
        )}
        {listing.type !== "fixed" && (
          <View style={[styles.typeBadge, listing.type === "auction" ? styles.auctionBadge : styles.tradeBadge]}>
            <Text style={styles.typeBadgeText}>{listing.type.toUpperCase()}</Text>
          </View>
        )}
      </View>
      <View style={styles.cardInfo}>
        <View style={styles.gradeBadgeRow}>
          <View style={styles.gradeBadge}>
            <Text style={styles.gradeBadgeText}>
              {listing.card.grading.grader} {listing.card.grading.grade}
            </Text>
          </View>
        </View>
        <Text style={styles.cardName} numberOfLines={1}>{listing.card.name}</Text>
        <Text style={styles.cardSet} numberOfLines={1}>{listing.card.set}</Text>
        <Text style={styles.cardPrice}>{formatPrice(listing.price, listing.currency)}</Text>
        {listing.shippingCost === 0 && (
          <Text style={styles.freeShipping}>Free shipping</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function BrowseScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = mockListings.filter((l) =>
    !searchQuery || l.card.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>P</Text>
          </View>
          <Text style={styles.logoWordmark}>
            Poke<Text style={styles.logoRed}>Grade</Text>
          </Text>
        </View>
        <TouchableOpacity style={styles.notifButton}>
          <Ionicons name="notifications-outline" size={22} color="#374151" />
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search cards, sets, grades..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color="#CC0000" />
        </TouchableOpacity>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={styles.filterRowContent}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setActiveFilter(f)}
            style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
          >
            <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Hero banner */}
      <View style={styles.heroBanner}>
        <View>
          <Text style={styles.heroTitle}>Graded Cards</Text>
          <Text style={styles.heroSubtitle}>{filtered.length} listings available</Text>
        </View>
        <TouchableOpacity style={styles.heroButton}>
          <Text style={styles.heroButtonText}>View All</Text>
          <Ionicons name="arrow-forward" size={14} color="#CC0000" />
        </TouchableOpacity>
      </View>

      {/* Listings grid */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <MobileListingCard listing={item} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>No cards found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#CC0000", justifyContent: "center", alignItems: "center" },
  logoText: { color: "#fff", fontSize: 18, fontWeight: "900" },
  logoWordmark: { fontSize: 22, fontWeight: "900", color: "#111827" },
  logoRed: { color: "#CC0000" },
  notifButton: { position: "relative", padding: 4 },
  notifDot: { position: "absolute", top: 4, right: 4, width: 8, height: 8, borderRadius: 4, backgroundColor: "#CC0000" },

  searchContainer: { flexDirection: "row", gap: 10, paddingHorizontal: 16, marginBottom: 12 },
  searchBar: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB", paddingHorizontal: 12, height: 44 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: "#111827" },
  filterButton: { width: 44, height: 44, backgroundColor: "#FFF1F1", borderRadius: 12, justifyContent: "center", alignItems: "center" },

  filterRow: { maxHeight: 48 },
  filterRowContent: { paddingHorizontal: 16, gap: 8, alignItems: "center" },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: "#E5E7EB", backgroundColor: "#fff" },
  filterChipActive: { backgroundColor: "#CC0000", borderColor: "#CC0000" },
  filterChipText: { fontSize: 12, fontWeight: "600", color: "#6B7280" },
  filterChipTextActive: { color: "#fff" },

  heroBanner: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 16, marginVertical: 12, backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: "#F3F4F6" },
  heroTitle: { fontSize: 16, fontWeight: "800", color: "#111827" },
  heroSubtitle: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  heroButton: { flexDirection: "row", alignItems: "center", gap: 4 },
  heroButtonText: { fontSize: 12, fontWeight: "600", color: "#CC0000" },

  listContent: { paddingHorizontal: 12, paddingBottom: 100 },
  columnWrapper: { justifyContent: "space-between", marginBottom: 12 },

  card: { width: "48.5%", backgroundColor: "#fff", borderRadius: 12, overflow: "hidden", borderWidth: 1, borderColor: "#F3F4F6", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  cardImageContainer: { position: "relative", aspectRatio: 0.75, backgroundColor: "#F9FAFB" },
  cardImage: { width: "100%", height: "100%", padding: 12 },
  firstEdBadge: { position: "absolute", top: 6, left: 6, backgroundColor: "rgba(0,0,0,0.75)", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  firstEdText: { color: "#fff", fontSize: 9, fontWeight: "800" },
  typeBadge: { position: "absolute", top: 6, right: 6, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  auctionBadge: { backgroundColor: "#F97316" },
  tradeBadge: { backgroundColor: "#16A34A" },
  typeBadgeText: { color: "#fff", fontSize: 8, fontWeight: "800" },

  cardInfo: { padding: 10 },
  gradeBadgeRow: { flexDirection: "row", marginBottom: 4 },
  gradeBadge: { backgroundColor: "#FEF9C3", borderWidth: 1, borderColor: "#FDE047", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  gradeBadgeText: { fontSize: 9, fontWeight: "800", color: "#854D0E" },
  cardName: { fontSize: 13, fontWeight: "700", color: "#111827" },
  cardSet: { fontSize: 10, color: "#6B7280", marginTop: 1 },
  cardPrice: { fontSize: 15, fontWeight: "900", color: "#111827", marginTop: 4 },
  freeShipping: { fontSize: 9, color: "#16A34A", fontWeight: "600", marginTop: 1 },

  emptyState: { alignItems: "center", paddingTop: 60 },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 16, color: "#6B7280" },
});
