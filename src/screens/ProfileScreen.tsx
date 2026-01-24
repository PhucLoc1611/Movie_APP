import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, Settings, Bell, HelpCircle, LogOut } from "lucide-react-native";
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
} from "../styles/theme";

export const ProfileScreen: React.FC = () => {
  const menuItems = [
    { icon: Settings, label: "Settings", onPress: () => {} },
    { icon: Bell, label: "Notifications", onPress: () => {} },
    { icon: HelpCircle, label: "Help & Support", onPress: () => {} },
    { icon: LogOut, label: "Sign Out", onPress: () => {} },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarContainer}>
          <User size={48} color={colors.textPrimary} />
        </View>
        <Text style={styles.userName}>Movie Lover</Text>
        <Text style={styles.userEmail}>user@example.com</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <Pressable
            key={item.label}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <item.icon size={24} color={colors.textSecondary} />
            <Text style={styles.menuLabel}>{item.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* App Version */}
      <Text style={styles.version}>Version 1.0.0</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  userName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  menuContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  menuLabel: {
    fontSize: fontSize.lg,
    color: colors.textPrimary,
  },
  version: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: "auto",
    marginBottom: spacing.xxl,
  },
});
