import { View, Text, ScrollView, TouchableOpacity, Image, Alert, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { mockListings, formatPrice } from "../../data/mockListings";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const listing = mockListings.find((l) => l.id === id) ?? mockListings[0];
  const { card, seller, price, currency, type } = listing;

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>
        {/* Back nav header */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#111827" />
          </TouchableOpacity>
          <View style={styles.navActions}>
            <TouchableOpacity style={styles.navAction}>
              <Ionicons name="share-outline" size={22} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navAction}>
              <Ionicons name="heart-outline" size={22} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: card.images[0].url }}
            style={styles.mainImage}
            resizeMode="contain"
          />
          {card.isFirstEdition && (
            <View style={styles.firstEdBadge}>
              <Text style={styles.firstEdText}>1st Edition</Text>
            </View>
          )}
          {type !== "fixed" && (
            <View style={[styles.typeBadge, type === "auction" ? styles.auctionBadge : styles.tradeBadge]}>
              <Text style={styles.typeBadgeText}>{type.toUpperCase()}</Text>
            </View>
          )}
        </View>

        {/* Thumbnail strip */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbStrip}>
          {["front", "back", "label", "slab"].map((angle, i) => (
            <TouchableOpacity key={angle} style={[styles.thumb, i === 0 && styles.thumbActive]}>
              <Image source={{ uri: card.images[0].url }} style={styles.thumbImg} resizeMode="contain" />
              <Text style={styles.thumbLabel}>{angle}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.body}>
          {/* Grade & title */}
          <View style={styles.gradeBadgeRow}>
            <View style={styles.gradeBadge}>
              <Text style={styles.gradeBadgeText}>
                {card.grading.grader} {card.grading.grade}
              </Text>
            </View>
            {card.language !== "English" && (
              <View style={styles.langBadge}>
                <Text style={styles.langBadgeText}>{card.language.slice(0, 2).toUpperCase()}</Text>
              </View>
            )}
          </View>

          <Text style={styles.cardTitle}>{card.name}</Text>
          <Text style={styles.cardMeta}>{card.set} · #{card.setNumber} · {card.year}</Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={14} color="#9CA3AF" />
              <Text style={styles.statText}>{listing.viewCount.toLocaleString()} views</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="heart-outline" size={14} color="#9CA3AF" />
              <Text style={styles.statText}>{listing.watchCount} watching</Text>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceBox}>
            <Text style={styles.priceLabel}>{type === "auction" ? "Current Bid" : "Price"}</Text>
            <Text style={styles.priceValue}>{formatPrice(price, currency)}</Text>
            {listing.shippingCost === 0 ? (
              <Text style={styles.freeShipping}>
                <Ionicons name="car-outline" size={12} /> Free insured shipping
              </Text>
            ) : (
              <Text style={styles.shippingCost}>+ {formatPrice(listing.shippingCost ?? 0, currency)} shipping</Text>
            )}
          </View>

          {/* Grading info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Grading Details</Text>
            <View style={styles.detailGrid}>
              {[
                ["Company", card.grading.grader],
                ["Grade", card.grading.grade.toString()],
                ["Cert #", card.grading.certNumber],
                ["Year Graded", card.grading.gradedAt ? new Date(card.grading.gradedAt).getFullYear().toString() : "—"],
              ].map(([label, value]) => (
                <View key={label} style={styles.detailItem}>
                  <Text style={styles.detailLabel}>{label}</Text>
                  <Text style={styles.detailValue}>{value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Card details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Card Details</Text>
            <View style={styles.detailGrid}>
              {[
                ["Rarity", card.rarity],
                ["Language", card.language],
                ["1st Edition", card.isFirstEdition ? "Yes" : "No"],
                ["Shadowless", card.isShadowless ? "Yes" : "No"],
              ].map(([label, value]) => (
                <View key={label} style={styles.detailItem}>
                  <Text style={styles.detailLabel}>{label}</Text>
                  <Text style={styles.detailValue}>{value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Description */}
          {listing.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{listing.description}</Text>
            </View>
          )}

          {/* Seller */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seller</Text>
            <TouchableOpacity style={styles.sellerRow} activeOpacity={0.8}>
              <Image source={{ uri: seller.avatarUrl }} style={styles.sellerAvatar} />
              <View style={styles.sellerInfo}>
                <View style={styles.sellerNameRow}>
                  <Text style={styles.sellerName}>{seller.displayName}</Text>
                  {seller.isVerified && <Ionicons name="checkmark-circle" size={16} color="#3B82F6" />}
                </View>
                <View style={styles.sellerStats}>
                  <Ionicons name="star" size={12} color="#EAB308" />
                  <Text style={styles.sellerStatText}>{seller.reputationScore} · {seller.totalSales} sales</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
            </TouchableOpacity>
          </View>

          {/* Ships to */}
          <Text style={styles.shipsTo}>
            Ships to: {listing.shipsTo.join(" · ")}
          </Text>

          <View style={styles.spacer} />
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={styles.cta}>
        {type === "fixed" && (
          <TouchableOpacity
            style={styles.ctaBuyBtn}
            onPress={() => Alert.alert("Purchase", "Proceeding to checkout...")}
          >
            <Text style={styles.ctaBuyText}>Buy Now</Text>
          </TouchableOpacity>
        )}
        {type === "auction" && (
          <TouchableOpacity
            style={styles.ctaBuyBtn}
            onPress={() => Alert.alert("Auction", "Place your bid...")}
          >
            <Text style={styles.ctaBuyText}>Place Bid</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.ctaOfferBtn}
          onPress={() => Alert.alert("Offer", "Make an offer to the seller...")}
        >
          <Text style={styles.ctaOfferText}>{type === "trade" ? "Propose Trade" : "Make Offer"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  navBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, backgroundColor: "#fff" },
  backBtn: { padding: 4 },
  navActions: { flexDirection: "row", gap: 8 },
  navAction: { padding: 6 },

  imageContainer: { position: "relative", width: SCREEN_WIDTH, height: SCREEN_WIDTH * 1.1, backgroundColor: "#F9FAFB" },
  mainImage: { width: "100%", height: "100%", padding: 24 },
  firstEdBadge: { position: "absolute", top: 16, left: 16, backgroundColor: "rgba(0,0,0,0.75)", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  firstEdText: { color: "#fff", fontSize: 12, fontWeight: "800" },
  typeBadge: { position: "absolute", top: 16, right: 16, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  auctionBadge: { backgroundColor: "#F97316" },
  tradeBadge: { backgroundColor: "#16A34A" },
  typeBadgeText: { color: "#fff", fontSize: 11, fontWeight: "800" },

  thumbStrip: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  thumb: { width: 60, aspectRatio: 1, borderRadius: 10, overflow: "hidden", borderWidth: 2, borderColor: "#E5E7EB", backgroundColor: "#F9FAFB" },
  thumbActive: { borderColor: "#CC0000" },
  thumbImg: { width: "100%", height: "75%" },
  thumbLabel: { fontSize: 8, textAlign: "center", color: "#9CA3AF", paddingVertical: 2, textTransform: "capitalize" },

  body: { paddingHorizontal: 20 },
  gradeBadgeRow: { flexDirection: "row", gap: 6, marginBottom: 8 },
  gradeBadge: { backgroundColor: "#FEF9C3", borderWidth: 1, borderColor: "#FDE047", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  gradeBadgeText: { fontSize: 13, fontWeight: "800", color: "#854D0E" },
  langBadge: { backgroundColor: "#EEF2FF", borderWidth: 1, borderColor: "#C7D2FE", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  langBadgeText: { fontSize: 13, fontWeight: "700", color: "#4338CA" },

  cardTitle: { fontSize: 26, fontWeight: "900", color: "#111827", lineHeight: 32 },
  cardMeta: { fontSize: 13, color: "#6B7280", marginTop: 4, marginBottom: 8 },
  statsRow: { flexDirection: "row", gap: 16, marginBottom: 16 },
  statItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  statText: { fontSize: 12, color: "#9CA3AF" },

  priceBox: { backgroundColor: "#F9FAFB", borderRadius: 14, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: "#F3F4F6" },
  priceLabel: { fontSize: 12, color: "#9CA3AF", fontWeight: "600" },
  priceValue: { fontSize: 32, fontWeight: "900", color: "#111827", marginTop: 2 },
  freeShipping: { fontSize: 12, color: "#16A34A", fontWeight: "600", marginTop: 4 },
  shippingCost: { fontSize: 12, color: "#6B7280", marginTop: 4 },

  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#111827", marginBottom: 10 },
  detailGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  detailItem: { width: "47%", backgroundColor: "#F9FAFB", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: "#F3F4F6" },
  detailLabel: { fontSize: 11, color: "#9CA3AF" },
  detailValue: { fontSize: 14, fontWeight: "700", color: "#111827", marginTop: 2 },

  description: { fontSize: 14, color: "#374151", lineHeight: 22 },

  sellerRow: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#F9FAFB", borderRadius: 12, padding: 12 },
  sellerAvatar: { width: 44, height: 44, borderRadius: 22 },
  sellerInfo: { flex: 1 },
  sellerNameRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  sellerName: { fontSize: 14, fontWeight: "700", color: "#111827" },
  sellerStats: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  sellerStatText: { fontSize: 12, color: "#6B7280" },
  shipsTo: { fontSize: 12, color: "#9CA3AF", marginBottom: 8 },
  spacer: { height: 100 },

  cta: { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", gap: 10, padding: 16, paddingBottom: 34, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#F3F4F6" },
  ctaBuyBtn: { flex: 1, backgroundColor: "#CC0000", borderRadius: 14, paddingVertical: 15, alignItems: "center" },
  ctaBuyText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  ctaOfferBtn: { flex: 1, borderWidth: 2, borderColor: "#CC0000", borderRadius: 14, paddingVertical: 15, alignItems: "center" },
  ctaOfferText: { color: "#CC0000", fontSize: 16, fontWeight: "800" },
});
