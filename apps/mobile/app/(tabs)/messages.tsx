import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { mockListings } from "../../data/mockListings";

const MOCK_CONVERSATIONS = mockListings.slice(0, 5).map((l, i) => ({
  id: `conv_${i}`,
  name: l.seller.displayName,
  avatar: l.seller.avatarUrl,
  lastMessage: i === 0 ? "I can do $400 on the Charizard, best offer!" : i === 1 ? "Is the cert verified?" : "Thanks for your purchase! Shipping tomorrow.",
  time: ["2m ago", "15m ago", "1h ago", "3h ago", "Yesterday"][i],
  unread: i < 3 ? [3, 1, 2][i] : 0,
  listing: l.card.name,
}));

export default function MessagesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity style={styles.newBtn}>
          <Ionicons name="create-outline" size={22} color="#CC0000" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_CONVERSATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              {item.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unread}</Text>
                </View>
              )}
            </View>
            <View style={styles.content}>
              <View style={styles.contentTop}>
                <Text style={[styles.name, item.unread > 0 && styles.nameBold]}>{item.name}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={styles.listingTag} numberOfLines={1}>Re: {item.listing}</Text>
              <Text style={[styles.lastMsg, item.unread > 0 && styles.lastMsgBold]} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>💬</Text>
            <Text style={styles.emptyText}>No messages yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  title: { fontSize: 24, fontWeight: "900", color: "#111827" },
  newBtn: { padding: 4 },

  listContent: { paddingVertical: 8 },
  row: { flexDirection: "row", gap: 12, paddingHorizontal: 20, paddingVertical: 14, alignItems: "flex-start" },
  separator: { height: 1, backgroundColor: "#F9FAFB", marginLeft: 72 },
  avatarWrap: { position: "relative", width: 52, height: 52 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#F3F4F6" },
  unreadBadge: { position: "absolute", top: -2, right: -2, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: "#CC0000", justifyContent: "center", alignItems: "center", paddingHorizontal: 4 },
  unreadText: { color: "#fff", fontSize: 10, fontWeight: "800" },
  content: { flex: 1, gap: 2 },
  contentTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { fontSize: 15, fontWeight: "600", color: "#374151" },
  nameBold: { fontWeight: "800", color: "#111827" },
  time: { fontSize: 11, color: "#9CA3AF" },
  listingTag: { fontSize: 11, color: "#CC0000", fontWeight: "600" },
  lastMsg: { fontSize: 13, color: "#9CA3AF" },
  lastMsgBold: { color: "#374151", fontWeight: "600" },
  empty: { alignItems: "center", paddingTop: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: "#9CA3AF" },
});
