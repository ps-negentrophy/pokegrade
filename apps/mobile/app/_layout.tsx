import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="listing/[id]"
          options={{
            headerShown: true,
            headerTitle: "Card Detail",
            headerBackTitle: "Back",
            headerTintColor: "#CC0000",
            headerStyle: { backgroundColor: "#fff" },
          }}
        />
        <Stack.Screen
          name="auth/index"
          options={{
            headerShown: true,
            headerTitle: "Sign In",
            headerTintColor: "#CC0000",
            headerStyle: { backgroundColor: "#fff" },
            presentation: "modal",
          }}
        />
      </Stack>
    </>
  );
}
