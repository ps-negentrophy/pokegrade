import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AuthScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }
    Alert.alert(
      mode === "signin" ? "Welcome Back!" : "Account Created!",
      mode === "signin" ? "You are now signed in." : "Your account has been created.",
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Logo */}
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoChar}>P</Text>
            </View>
            <Text style={styles.logoText}>
              Poke<Text style={styles.logoRed}>Grade</Text>
            </Text>
            <Text style={styles.tagline}>
              {mode === "signin" ? "Welcome back, collector" : "Join thousands of collectors"}
            </Text>
          </View>

          {/* Mode toggle */}
          <View style={styles.modeToggle}>
            {(["signin", "signup"] as const).map((m) => (
              <TouchableOpacity
                key={m}
                style={[styles.modeBtn, mode === m && styles.modeBtnActive]}
                onPress={() => setMode(m)}
              >
                <Text style={[styles.modeBtnText, mode === m && styles.modeBtnTextActive]}>
                  {m === "signin" ? "Sign In" : "Create Account"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Fields */}
          <View style={styles.fields}>
            {mode === "signup" && (
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Username</Text>
                <View style={styles.inputWrap}>
                  <Text style={styles.inputPrefix}>@</Text>
                  <TextInput
                    value={username}
                    onChangeText={(t) => setUsername(t.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                    placeholder="username"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                    style={[styles.input, styles.inputPrefixed]}
                  />
                </View>
              </View>
            )}

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Email</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="mail-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={[styles.input, styles.inputIconPad]}
                />
              </View>
            </View>

            <View style={styles.field}>
              <View style={styles.fieldLabelRow}>
                <Text style={styles.fieldLabel}>Password</Text>
                {mode === "signin" && (
                  <TouchableOpacity>
                    <Text style={styles.forgotText}>Forgot?</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"}
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  style={[styles.input, styles.inputIconPad, styles.inputPwPad]}
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.8}>
            <Text style={styles.submitText}>{mode === "signin" ? "Sign In" : "Create Account"}</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google */}
          <TouchableOpacity style={styles.googleBtn}>
            <Ionicons name="logo-google" size={20} color="#4285F4" />
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>

          {mode === "signup" && (
            <Text style={styles.terms}>
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </Text>
          )}

          {/* Feature bullets */}
          <View style={styles.features}>
            {[
              { icon: "shield-checkmark-outline" as const, text: "Buyer Protection on every order" },
              { icon: "checkmark-circle-outline" as const, text: "Cert verified before listing goes live" },
              { icon: "flash-outline" as const, text: "Fast payouts within 48 hours" },
            ].map((f) => (
              <View key={f.text} style={styles.featureRow}>
                <Ionicons name={f.icon} size={16} color="#CC0000" />
                <Text style={styles.featureText}>{f.text}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  flex: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 40 },

  logoSection: { alignItems: "center", marginBottom: 28 },
  logoCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#CC0000", justifyContent: "center", alignItems: "center", marginBottom: 10, shadowColor: "#CC0000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  logoChar: { color: "#fff", fontSize: 28, fontWeight: "900" },
  logoText: { fontSize: 26, fontWeight: "900", color: "#111827" },
  logoRed: { color: "#CC0000" },
  tagline: { fontSize: 14, color: "#6B7280", marginTop: 4 },

  modeToggle: { flexDirection: "row", backgroundColor: "#F3F4F6", borderRadius: 12, padding: 4, marginBottom: 24 },
  modeBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  modeBtnActive: { backgroundColor: "#fff", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 },
  modeBtnText: { fontSize: 14, fontWeight: "600", color: "#9CA3AF" },
  modeBtnTextActive: { color: "#111827", fontWeight: "700" },

  fields: { gap: 16, marginBottom: 20 },
  field: {},
  fieldLabel: { fontSize: 13, fontWeight: "700", color: "#374151", marginBottom: 6 },
  fieldLabelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  forgotText: { fontSize: 12, color: "#CC0000", fontWeight: "600" },
  inputWrap: { position: "relative", flexDirection: "row", alignItems: "center" },
  inputIcon: { position: "absolute", left: 14, zIndex: 1 },
  inputPrefix: { position: "absolute", left: 14, fontSize: 16, color: "#6B7280", zIndex: 1 },
  input: { flex: 1, backgroundColor: "#fff", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, paddingVertical: 13, paddingHorizontal: 14, fontSize: 14, color: "#111827" },
  inputIconPad: { paddingLeft: 44 },
  inputPrefixed: { paddingLeft: 32 },
  inputPwPad: { paddingRight: 50 },
  eyeBtn: { position: "absolute", right: 14, padding: 4 },

  submitBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#CC0000", borderRadius: 14, paddingVertical: 15, marginBottom: 20, shadowColor: "#CC0000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "800" },

  divider: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E5E7EB" },
  dividerText: { fontSize: 13, color: "#9CA3AF" },

  googleBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: "#fff", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 14, paddingVertical: 14, marginBottom: 16 },
  googleText: { fontSize: 15, fontWeight: "600", color: "#374151" },

  terms: { fontSize: 11, color: "#9CA3AF", textAlign: "center", lineHeight: 17, marginBottom: 24 },

  features: { backgroundColor: "#fff", borderRadius: 14, padding: 16, gap: 12, borderWidth: 1, borderColor: "#F3F4F6" },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  featureText: { fontSize: 13, color: "#374151" },
});
