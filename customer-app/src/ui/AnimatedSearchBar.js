import React, { useEffect, useRef, useState } from "react";
import { View, Pressable, TextInput, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";

import { palette, radii, spacing, type } from "../theme/tokens";

/**
 * AnimatedSearchBar — modern Zepto-/Zomato-style search field.
 *
 *   ┌─────────────────────────────────────────────┐
 *   │  🔍   Search for "Swedish massage"   ┊  ⌘   │
 *   └─────────────────────────────────────────────┘
 *
 * - Pill-shape, soft warm-off-white fill, no visible borders.
 * - Animated cycling placeholder: each `hint` slides up + fades out,
 *   the next one slides in from below.
 * - A thin vertical divider on the right separates the integrated
 *   filter button (brand-colored icon) from the input area.
 * - When the user starts typing, the animated hint freezes/hides
 *   and the live value takes over.
 *
 * Props:
 *   value, onChangeText  - controlled input
 *   hints              - string[] cycled every 2.5s
 *   onFilter           - filter icon tap
 *   inputRef           - forwarded ref to the TextInput
 */
export default function AnimatedSearchBar({
  value,
  onChangeText,
  hints = [],
  onFilter,
  inputRef,
  prefix = "Search for ",
  ...rest
}) {
  const [hintIdx, setHintIdx] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;
  const ty = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Don't cycle while the user is typing.
    if (value || hints.length === 0) return;
    let mounted = true;

    const tick = () => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(ty, { toValue: -14, duration: 250, useNativeDriver: true }),
      ]).start(() => {
        if (!mounted) return;
        setHintIdx((i) => (i + 1) % hints.length);
        ty.setValue(14);
        Animated.parallel([
          Animated.timing(opacity, { toValue: 1, duration: 280, useNativeDriver: true }),
          Animated.timing(ty, { toValue: 0, duration: 280, useNativeDriver: true }),
        ]).start();
      });
    };

    const id = setInterval(tick, 2500);
    return () => { mounted = false; clearInterval(id); };
  }, [value, hints.length]);

  const showHint = !value && hints.length > 0;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: palette.surface, // pure white
        borderRadius: radii.pill,
        height: 56,
        paddingHorizontal: spacing.lg,
        borderWidth: 1,
        borderColor: palette.hairline,
        // Subtle elevation — makes white-on-white feel premium, not boring.
        shadowColor: "#2A1A12",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
        elevation: 3,
      }}
    >
      <Feather name="search" size={18} color={palette.brand} />

      <View
        style={{
          flex: 1,
          marginLeft: spacing.md,
          height: 24,
          justifyContent: "center",
        }}
      >
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder=""
          placeholderTextColor={palette.textMuted}
          style={{
            ...type.bodyMd,
            color: palette.textPrimary,
            paddingVertical: 0,
            margin: 0,
          }}
          {...rest}
        />
        {showHint && (
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              opacity,
              transform: [{ translateY: ty }],
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Animated.Text
                numberOfLines={1}
                style={{
                  ...type.bodyMd,
                  color: palette.textMuted,
                }}
              >
                {prefix}
                <Animated.Text style={{ color: palette.textSecondary }}>
                  "{hints[hintIdx]}"
                </Animated.Text>
              </Animated.Text>
            </View>
          </Animated.View>
        )}
      </View>

      {value ? (
        <Pressable hitSlop={8} onPress={() => onChangeText("")} style={{ marginLeft: spacing.sm }}>
          <Feather name="x" size={16} color={palette.textSecondary} />
        </Pressable>
      ) : null}

      {/* Thin divider + filter button — integrated, not a separate chip. */}
      <View
        style={{
          width: 1,
          height: 22,
          backgroundColor: palette.hairline,
          marginHorizontal: spacing.md,
        }}
      />
      <Pressable onPress={onFilter} hitSlop={8}>
        <Feather name="sliders" size={18} color={palette.brand} />
      </Pressable>
    </View>
  );
}
