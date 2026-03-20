import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { mockSellers, mockListings, formatPrice } from "../../data/mockListings";

const ME = mockSellers[0];
const MY_LISTINGS = mockListings.filter((l) => l.seller.id === ME.id);

const MENU_ITEMS = [
  { icon: "list-outline" as const, label: "My Listings", sub: `${MY_LISTINGS.length} active`, badge: MY_LISTINGS.length },
  { icon: "bag-check-outline" as const, label: "Purchase History", sub: "3 orders", badge: 0 },
  { icon: "heart-outline" as const, label: "Watchlist", sub: "12 cards saved", badge: 12 },
  { icon: "stats-chart-outline" as const, label: "Sales Analytics", sub: "View earnings", badge: 0 },
  { icon: "shield-checkmark-outline" as const, label: "Verified Seller", sub: "Status: Active", badge: 0 },
  { icon: "settings-outline" as const, label: "Account Settings", sub: "Profile, password, notifications", badge: 0 },
  { icon: "help-circle-outline" as const, label: "Help & Support", sub: "FAQs and contact", badge: 0 },
];

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner} />

        <View style={styles.profileSection}>
          {/* Avatar */}
          <View style={styles.avatarWrap}>
            <Image source={{ uri: ME.avatarUrl }} style={styles.avatar} />
            {ME.isVerified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={12} color="#fff" />
              </View>
            )}
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.displayName}>{ME.displayName}</Text>
              {ME.isVerified && (
                <Ionicons name="checkmark-circle" size={18} color="#3B82F6" />
              )}
            </View>
            <Text style={styles.username}>@{ME.username}</Text>
            {ME.bio && <Text style={styles.bio}>{ME.bio}</Text>}
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={13} color="#9CA3AF" />
              <Text style={styles.location}>{ME.location}</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              { label: "Rep", value: ME.reputationScore.toString(), icon: "star" as const, color: "#EAB308" },
              { label: "Sales", value: ME.totalSales.toString(), icon: "bag-handle-outline" as const, color: "#CC0000" },
              { label: "Bought", value: ME.totalPurchases.toString(), icon: "cart-outline" as const, color: "#3B4CCA" },
            ].map((stat) => (
              <View key={stat.label} style={styles.statItem}>
                <Ionicons name={stat.icon} size={18} color={stat.color} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="pencil-outline" size={15} color="#374151" />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Recent listings */}
        {MY_LISTINGS.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Listings</Text>
              <TouchableOpacity>
                <Text style={styles.sectionLink}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listingsScroll}>
              {MY_LISTINGS.map((l) => (
                <TouchableOpacity
                  key={l.id}
                  style={styles.miniCard}
                  onPress={() => router.push(`/listing/${l.id}`)}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: l.card.images[0].url }} style={styles.miniCardImage} resizeMode="contain" />
                  <Text style={styles.miniCardName} numberOfLines={1}>{l.card.name}</Text>
                  <Text style={styles.miniCardGrade}>{l.card.grading.grader} {l.card.grading.grade}</Text>
                  <Text style={styles.miniCardPrice}>{formatPrice(l.price, l.currency)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Menu */}
        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity key={i} style={styles.menuRow} activeOpacity={0.7}>
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon} size={20} color="#CC0000" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </View>
              {item.badge > 0 ? (
                <View style={styles.menuBadge}>
                  <Text style={styles.menuBadgeText}>{item.badge}</Text>
                </View>
              ) : (
                <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={() => router.push("/auth")}>
          <Ionicons name="log-out-outline" size={18} color="#EF4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  banner: { height: 100, backgroundColor: "#CC0000" },
  profileSection: { backgroundColor: "#fff", paddingHorizontal: 20, paddingBottom: 20, marginBottom: 10 },
  avatarWrap: { position: "relative", width: 72, height: 72, marginTop: -36, marginBottom: 12 },
  avatar: { width: 72, height: 72, borderRadius: 18, borderWidth: 3, borderColor: "#fff" },
  verifiedBadge: { position: "absolute", bottom: -2, right: -2, width: 20, height: 20, borderRadius: 10, backgroundColor: "#3B82F6", justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#fff" },
  profileInfo: { marginBottom: 16 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  displayName: { fontSize: 20, fontWeight: "900", color: "#111827" },
  username: { fontSize: 14, color: "#9CA3AF", marginTop: 2 },
  bio: { fontSize: 13, color: "#374151", marginTop: 6, lineHeight: 19 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
  location: { fontSize: 12, color: "#9CA3AF" },
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  statItem: { flex: 1, backgroundColor: "#F9FAFB", borderRadius: 12, padding: 12, alignItems: "center", gap: 4, borderWidth: 1, borderColor: "#F3F4F6" },
  statValue: { fontSize: 18, fontWeight: "900", color: "#111827" },
  statLabel: { fontSize: 10, color: "#6B7280" },
  editBtn: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 16, alignSelf: "flex-start" },
  editBtnText: { fontSize: 13, fontWeight: "600", color: "#374151" },

  section: { backgroundColor: "#fff", marginBottom: 10, paddingVertical: 16 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#111827" },
  sectionLink: { fontSize: 13, color: "#CC0000", fontWeight: "600" },
  listingsScroll: { paddingHorizontal: 20, gap: 10 },
  miniCard: { width: 100, backgroundColor: "#F9FAFB", borderRadius: 10, overflow: "hidden", borderWidth: 1, borderColor: "#F3F4F6" },
  miniCardImage: { width: "100%", height: 100, backgroundColor: "#F3F4F6" },
  miniCardName: { fontSize: 11, fontWeight: "700", color: "#111827", paddingHorizontal: 6, paddingTop: 6 },
  miniCardGrade: { fontSize: 9, color: "#CC0000", fontWeight: "700", paddingHorizontal: 6, marginTop: 2 },
  miniCardPrice: { fontSize: 12, fontWeight: "900", color: "#111827", paddingHorizontal: 6, paddingBottom: 8, marginTop: 2 },

  menuSection: { backgroundColor: "#fff", marginBottom: 10 },
  menuRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#F9FAFB" },
  menuIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#FFF1F1", justifyContent: "center", alignItems: "center" },
  menuContent: { flex: 1 },
  menuLabel: { fontSize: 14, fontWeight: "600", color: "#111827" },
  menuSub: { fontSize: 11, color: "#9CA3AF", marginTop: 1 },
  menuBadge: { backgroundColor: "#CC0000", borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2 },
  menuBadgeText: { color: "#fff", fontSize: 11, fontWeight: "800" },

  signOutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginHorizontal: 20, marginTop: 6, paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, borderColor: "#FEE2E2" },
  signOutText: { fontSize: 15, fontWeight: "700", color: "#EF4444" },
  bottomPad: { height: 40 },
});
