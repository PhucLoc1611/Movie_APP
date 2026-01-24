import React from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { colors, fontSize } from "../styles/theme";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "large",
  message,
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 20,
  },
  message: {
    marginTop: 12,
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
