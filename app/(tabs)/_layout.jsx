import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { Home, MessageCircle, LayoutDashboard, User } from "lucide-react-native";

function TabIcon({ Icon, focused, label }) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemActive]}>
      <Icon
        size={20}
        color={focused ? "#7BA9D8" : "#9CA3AF"}
        strokeWidth={focused ? 2.5 : 2}
      />
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={Home} focused={focused} label="Accueil" />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={LayoutDashboard} focused={focused} label="Dashboard" />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Sakina",
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={MessageCircle} focused={focused} label="Sakina" />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: "Profil",
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={User} focused={focused} label="Profil" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderTopColor: "#F3F4F6",
    borderTopWidth: 1,
    height: 72,
    paddingBottom: 8,
    paddingTop: 4,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 2,
  },
  tabItemActive: {
    backgroundColor: "rgba(123, 169, 216, 0.1)",
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: "#9CA3AF",
  },
  tabLabelActive: {
    color: "#7BA9D8",
  },
});
