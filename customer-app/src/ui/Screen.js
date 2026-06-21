import React from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { palette, layout } from "../theme/tokens";

/**
 * Screen — every top-level route wraps in this so:
 *   - SafeAreaView edges are honored consistently
 *   - background color comes from the same token everywhere
 *   - horizontal padding is uniform (`screenPadding` token)
 *   - keyboard avoidance + scrolling behavior is opt-in via `scroll`
 *
 * Use:
 *   <Screen>...</Screen>                     // non-scrolling
 *   <Screen scroll>...</Screen>              // scrolls
 *   <Screen scroll refreshing={r} onRefresh={fn}>
 */
export default function Screen({
  children,
  scroll = false,
  refreshing = false,
  onRefresh,
  contentStyle,
  noPadding = false,
  edges = ["bottom"],
  bg = palette.bg,
  keyboard = false,
}) {
  const padded = noPadding ? null : { paddingHorizontal: layout.screenPadding };

  const Inner = scroll ? ScrollView : View;
  const innerProps = scroll
    ? {
        contentContainerStyle: [{ paddingBottom: 32 }, padded, contentStyle],
        showsVerticalScrollIndicator: false,
        keyboardShouldPersistTaps: "handled",
        refreshControl: onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={palette.ink} />
        ) : undefined,
      }
    : { style: [{ flex: 1 }, padded, contentStyle] };

  const body = <Inner {...innerProps}>{children}</Inner>;

  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: bg }}>
      {keyboard ? (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          {body}
        </KeyboardAvoidingView>
      ) : (
        body
      )}
    </SafeAreaView>
  );
}
