import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "./CommonCp";
import { appStyles } from "../../styles/appStyles";
import { screenStyles } from "../../styles/screenStyles";
export function ScreenContent({
  title,
  subtitle = "HONEY RESTAURANT",
  rightText = undefined,
  children = undefined,
}) {
  return (
    <SafeAreaView
      style={appStyles.container}
      edges={["bottom", "left", "right"]}
    >
      <ScreenHeader
        title={title}
        subtitle={subtitle}
        rightText={rightText}
      />
      <ScrollView
        contentContainerStyle={[appStyles.scrollContent, screenStyles.stack]}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
export function FilterBar({ options, value, onChange }) {
  return (
    <View style={screenStyles.wrap}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.key}
          accessibilityRole="button"
          accessibilityState={{
            selected: value === option.key,
          }}
          style={[
            screenStyles.filter,
            value === option.key && screenStyles.filterActive,
          ]}
          onPress={() => onChange(option.key)}
        >
          <Text
            style={[
              screenStyles.filterText,
              value === option.key && screenStyles.filterTextActive,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
export function EmptyState({ title = "ไม่พบรายการ" }) {
  return (
    <View style={appStyles.emptyContainer}>
      <Text style={appStyles.emptyTitle}>{title}</Text>
    </View>
  );
}

export function QueryState({ query, children = undefined }) {
  if (query.loading && !query.data) return <ActivityIndicator size="large" />;
  if (query.error)
    return (
      <View style={screenStyles.stack}>
        <Text style={appStyles.emptyText}>{query.error}</Text>
        <TouchableOpacity
          style={appStyles.secondaryButton}
          onPress={query.refresh}
        >
          <Text style={appStyles.secondaryButtonText}>ลองใหม่</Text>
        </TouchableOpacity>
      </View>
    );
  return children;
}
