import "../global.css";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 min
    },
  },
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="emotions" />
            <Stack.Screen name="journal" />
            <Stack.Screen name="sommeil" />
            <Stack.Screen name="addictions" />
            <Stack.Screen name="ressources" />
            <Stack.Screen name="tendances" />
            <Stack.Screen name="recompenses" />
            <Stack.Screen name="coaching" />
            <Stack.Screen name="professionnels" />
            <Stack.Screen name="parametres" />
            <Stack.Screen name="preferences" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
