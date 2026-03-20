import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const GRADERS = ["PSA", "BGS", "CGC", "SGC"];
const GRADES = [7, 7.5, 8, 8.5, 9, 9.5, 10];

interface UploadedImage {
  uri: string;
  label: string;
}

export default function SellScreen() {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [cardName, setCardName] = useState("");
  const [set, setSet] = useState("");
  const [year, setYear] = useState("");
  const [grader, setGrader] = useState("");
  const [grade, setGrade] = useState<number | null>(null);
  const [certNumber, setCertNumber] = useState("");
  const [price, setPrice] = useState("");
  const [isFirstEdition, setIsFirstEdition] = useState(false);

  const pickImage = async (source: "camera" | "library") => {
    const permission = source === "camera"
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission Required", `Please allow ${source} access in Settings.`);
      return;
    }

    const result = source === "camera"
      ? await ImagePicker.launchCameraAsync({ quality: 0.8, allowsEditing: true, aspect: [3, 4] })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsMultipleSelection: true, quality: 0.8 });

    if (!result.canceled) {
      const labels = ["front", "back", "label", "slab"];
      const newImages = result.assets.slice(0, 4 - images.length).map((asset, i) => ({
        uri: asset.uri,
        label: labels[images.length + i] ?? "other",
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const TOTAL_STEPS = 4;
  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>List a Card</Text>
        <Text style={styles.headerStep}>Step {step} of {TOTAL_STEPS}</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` as `${number}%` }]} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Step 1: Photos */}
        {step === 1 && (
          <View>
            <Text style={styles.stepTitle}>Add Photos</Text>
            <Text style={styles.stepSubtitle}>Upload up to 4 photos. Better photos lead to faster sales.</Text>

            {/* Upload buttons */}
            <View style={styles.uploadButtons}>
              <TouchableOpacity style={[styles.uploadBtn, styles.uploadBtnPrimary]} onPress={() => pickImage("camera")}>
                <Ionicons name="camera" size={24} color="#fff" />
                <Text style={styles.uploadBtnTextPrimary}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.uploadBtn, styles.uploadBtnSecondary]} onPress={() => pickImage("library")}>
                <Ionicons name="images-outline" size={24} color="#CC0000" />
                <Text style={styles.uploadBtnTextSecondary}>From Library</Text>
              </TouchableOpacity>
            </View>

            {/* Image grid */}
            {images.length > 0 && (
              <View style={styles.imageGrid}>
                {images.map((img, i) => (
                  <View key={i} style={styles.imageThumb}>
                    <Image source={{ uri: img.uri }} style={styles.thumbImage} />
                    <View style={styles.thumbLabel}>
                      <Text style={styles.thumbLabelText}>{img.label}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.thumbRemove}
                      onPress={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    >
                      <Ionicons name="close" size={12} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.tipBox}>
              <Ionicons name="bulb-outline" size={16} color="#6366F1" />
              <Text style={styles.tipText}>Tip: Include front, back, PSA label, and full slab shots for best results.</Text>
            </View>
          </View>
        )}

        {/* Step 2: Card Info */}
        {step === 2 && (
          <View style={styles.formSection}>
            <Text style={styles.stepTitle}>Card Details</Text>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Card Name *</Text>
              <TextInput
                value={cardName}
                onChangeText={setCardName}
                placeholder="e.g. Charizard"
                style={styles.input}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Set *</Text>
              <TextInput
                value={set}
                onChangeText={setSet}
                placeholder="e.g. Base Set"
                style={styles.input}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Year *</Text>
                <TextInput
                  value={year}
                  onChangeText={setYear}
                  placeholder="1999"
                  keyboardType="numeric"
                  style={styles.input}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.checkboxRow}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setIsFirstEdition(!isFirstEdition)}
              >
                <View style={[styles.checkboxBox, isFirstEdition && styles.checkboxChecked]}>
                  {isFirstEdition && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>
                <Text style={styles.checkboxLabel}>1st Edition</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Step 3: Grading */}
        {step === 3 && (
          <View style={styles.formSection}>
            <Text style={styles.stepTitle}>Grading Info</Text>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Grading Company *</Text>
              <View style={styles.optionGrid}>
                {GRADERS.map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.optionBtn, grader === g && styles.optionBtnActive]}
                    onPress={() => setGrader(g)}
                  >
                    <Text style={[styles.optionBtnText, grader === g && styles.optionBtnTextActive]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Grade *</Text>
              <View style={styles.gradeGrid}>
                {GRADES.map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.gradeBtn, grade === g && styles.gradeBtnActive, g === 10 && grade === g && styles.gradeBtnGem]}
                    onPress={() => setGrade(g)}
                  >
                    <Text style={[styles.gradeBtnText, grade === g && styles.gradeBtnTextActive]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Certificate Number *</Text>
              <TextInput
                value={certNumber}
                onChangeText={setCertNumber}
                placeholder="e.g. 12345678"
                keyboardType="numeric"
                style={styles.input}
                placeholderTextColor="#9CA3AF"
              />
              <Text style={styles.fieldHint}>Found on the front label of the slab</Text>
            </View>
          </View>
        )}

        {/* Step 4: Price */}
        {step === 4 && (
          <View style={styles.formSection}>
            <Text style={styles.stepTitle}>Set Your Price</Text>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Price (USD) *</Text>
              <View style={styles.priceInputRow}>
                <Text style={styles.priceCurrencySymbol}>$</Text>
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0"
                  keyboardType="numeric"
                  style={[styles.input, styles.priceInput]}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {price && (
              <View style={styles.earningsBox}>
                <Text style={styles.earningsLabel}>Your earnings (after 5% fee)</Text>
                <Text style={styles.earningsValue}>
                  ${(parseFloat(price) * 0.95).toFixed(0)}
                </Text>
              </View>
            )}

            {/* Review summary */}
            <View style={styles.reviewBox}>
              <Text style={styles.reviewTitle}>Listing Summary</Text>
              {[
                ["Card", cardName || "—"],
                ["Set", set || "—"],
                ["Year", year || "—"],
                ["1st Ed", isFirstEdition ? "Yes" : "No"],
                ["Grade", grader && grade ? `${grader} ${grade}` : "—"],
                ["Cert #", certNumber || "—"],
              ].map(([label, value]) => (
                <View key={label} style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>{label}</Text>
                  <Text style={styles.reviewValue}>{value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom nav */}
      <View style={styles.bottomNav}>
        {step > 1 && (
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep((s) => s - 1)}>
            <Ionicons name="chevron-back" size={18} color="#374151" />
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextBtn, step > 1 && styles.nextBtnSmall]}
          onPress={() => {
            if (step === TOTAL_STEPS) {
              Alert.alert("Listing Submitted!", "Your card has been submitted for review. It will go live within 24 hours.");
            } else {
              setStep((s) => s + 1);
            }
          }}
        >
          <Text style={styles.nextBtnText}>{step === TOTAL_STEPS ? "Submit Listing" : "Continue"}</Text>
          <Ionicons name={step === TOTAL_STEPS ? "checkmark-circle" : "chevron-forward"} size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  headerTitle: { fontSize: 22, fontWeight: "900", color: "#111827" },
  headerStep: { fontSize: 13, color: "#6B7280", fontWeight: "600" },
  progressTrack: { height: 4, backgroundColor: "#F3F4F6", marginHorizontal: 20, borderRadius: 2 },
  progressFill: { height: "100%", backgroundColor: "#CC0000", borderRadius: 2 },

  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 120 },

  stepTitle: { fontSize: 20, fontWeight: "800", color: "#111827", marginBottom: 4 },
  stepSubtitle: { fontSize: 13, color: "#6B7280", marginBottom: 20 },

  uploadButtons: { flexDirection: "row", gap: 12, marginBottom: 16 },
  uploadBtn: { flex: 1, borderRadius: 14, padding: 18, alignItems: "center", gap: 8 },
  uploadBtnPrimary: { backgroundColor: "#CC0000" },
  uploadBtnSecondary: { backgroundColor: "#FFF1F1", borderWidth: 1.5, borderColor: "#CC0000" },
  uploadBtnTextPrimary: { color: "#fff", fontWeight: "700", fontSize: 14 },
  uploadBtnTextSecondary: { color: "#CC0000", fontWeight: "700", fontSize: 14 },

  imageGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  imageThumb: { width: 80, height: 80, borderRadius: 10, overflow: "hidden", position: "relative" },
  thumbImage: { width: "100%", height: "100%" },
  thumbLabel: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.6)", paddingVertical: 2 },
  thumbLabelText: { color: "#fff", fontSize: 8, textAlign: "center", fontWeight: "600", textTransform: "capitalize" },
  thumbRemove: { position: "absolute", top: 4, right: 4, width: 18, height: 18, borderRadius: 9, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center" },

  tipBox: { flexDirection: "row", alignItems: "flex-start", gap: 8, backgroundColor: "#EEF2FF", borderRadius: 10, padding: 12 },
  tipText: { flex: 1, fontSize: 12, color: "#4F46E5", lineHeight: 18 },

  formSection: { gap: 8 },
  field: { marginBottom: 12 },
  fieldLabel: { fontSize: 13, fontWeight: "700", color: "#374151", marginBottom: 6 },
  fieldHint: { fontSize: 11, color: "#9CA3AF", marginTop: 4 },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: "#111827" },
  row: { flexDirection: "row", gap: 12 },

  checkboxRow: { flexDirection: "row", gap: 20, marginTop: 4 },
  checkbox: { flexDirection: "row", alignItems: "center", gap: 8 },
  checkboxBox: { width: 20, height: 20, borderRadius: 5, borderWidth: 1.5, borderColor: "#D1D5DB", justifyContent: "center", alignItems: "center" },
  checkboxChecked: { backgroundColor: "#CC0000", borderColor: "#CC0000" },
  checkboxLabel: { fontSize: 14, color: "#374151", fontWeight: "600" },

  optionGrid: { flexDirection: "row", gap: 8 },
  optionBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 2, borderColor: "#E5E7EB", backgroundColor: "#fff", alignItems: "center" },
  optionBtnActive: { borderColor: "#CC0000", backgroundColor: "#FFF1F1" },
  optionBtnText: { fontSize: 14, fontWeight: "700", color: "#9CA3AF" },
  optionBtnTextActive: { color: "#CC0000" },

  gradeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  gradeBtn: { width: 56, paddingVertical: 10, borderRadius: 12, borderWidth: 2, borderColor: "#E5E7EB", backgroundColor: "#fff", alignItems: "center" },
  gradeBtnActive: { borderColor: "#CC0000", backgroundColor: "#FFF1F1" },
  gradeBtnGem: { borderColor: "#EAB308", backgroundColor: "#FEF9C3" },
  gradeBtnText: { fontSize: 13, fontWeight: "800", color: "#9CA3AF" },
  gradeBtnTextActive: { color: "#CC0000" },

  priceInputRow: { flexDirection: "row", alignItems: "center" },
  priceCurrencySymbol: { position: "absolute", left: 14, fontSize: 18, color: "#374151", fontWeight: "700", zIndex: 1 },
  priceInput: { paddingLeft: 34 },

  earningsBox: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#F0FDF4", borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: "#BBF7D0" },
  earningsLabel: { fontSize: 13, color: "#166534" },
  earningsValue: { fontSize: 20, fontWeight: "900", color: "#15803D" },

  reviewBox: { backgroundColor: "#fff", borderRadius: 14, borderWidth: 1, borderColor: "#F3F4F6", overflow: "hidden" },
  reviewTitle: { fontSize: 14, fontWeight: "700", color: "#374151", padding: 14, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  reviewRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#F9FAFB" },
  reviewLabel: { fontSize: 13, color: "#6B7280" },
  reviewValue: { fontSize: 13, fontWeight: "600", color: "#111827" },

  bottomNav: { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", gap: 10, padding: 20, paddingBottom: 34, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#F3F4F6" },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 20, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB" },
  backBtnText: { fontSize: 15, fontWeight: "700", color: "#374151" },
  nextBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "#CC0000", borderRadius: 14, paddingVertical: 14 },
  nextBtnSmall: { flex: 1 },
  nextBtnText: { fontSize: 16, fontWeight: "800", color: "#fff" },
});
