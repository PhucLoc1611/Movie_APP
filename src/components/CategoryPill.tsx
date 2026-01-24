import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
} from "../styles/theme";

interface CategoryPillProps {
  label: string;
  isActive?: boolean;
  onPress?: () => void;
}

export const CategoryPill: React.FC<CategoryPillProps> = ({
  label,
  isActive = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.pill, isActive && styles.pillActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, isActive && styles.labelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "transparent",
    marginRight: spacing.sm,
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.background,
  },
});
