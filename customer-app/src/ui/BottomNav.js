import React from "react";
import { View, Pressable } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { palette, spacing, layout, shadows } from "../theme/tokens";

/**
 * BottomNav — flat white bar with hairline top, four tabs.
 *
 * Active tab is the deep-mocha brown filled icon; inactives are muted
 * outline icons. No floating pill — premium calm minimalism, like the
 * salon-app reference.
 *
 * Tabs:
 *   home      -> Home
 *   calendar  -> History (acts as bookings list)
 *   bag       -> Cart
 *   user      -> History (acts as profile)
 */
const TABS = [
  { id: "home",     icon: "home",          route: "Home"    },
  { id: "calendar", icon: "calendar",      route: "History" },
  { id: "bag",      icon: "shopping-bag",  route: "Cart"    },
  { id: "user",     icon: "user",          route: "History" },
];

export default function BottomNav({ active }) {
  const navigation = useNavigation();
  const route = useRoute();
  const auto =
    route.name === "Home" ? "home"
    : route.name === "Cart" ? "bag"
    : route.name === "History" ? "calendar"
    : "home";
  const current = active || auto;

  function go(tab) {
    if (tab.id === current) return;
    navigation.navigate(tab.route);
  }

  return (
    <View
      pointerEvents="box-none"
      style={[
        {
          position: "absolute",
          left: 0, right: 0, bottom: 0,
          backgroundColor: palette.surface,
          borderTopWidth: 1,
          borderTopColor: palette.hairline,
        },
        shadows.nav,
      ]}
    >
      <SafeAreaView edges={["bottom"]}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            paddingHorizontal: spacing.lg,
            height: layout.bottomNavHeight,
          }}
        >
          {TABS.map((t) => {
            const isActive = t.id === current;
            return (
              <Pressable
                key={t.id}
                onPress={() => go(t)}
                hitSlop={8}
                style={({ pressed }) => ({
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 6,
                  opacity: pressed ? 0.6 : 1,
                })}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    alignItems: "center",
                    justifyContent: "center",
                    // Active tab gets a soft brand-tinted halo + brown icon.
                    backgroundColor: isActive ? palette.brandSoft : "transparent",
                  }}
                >
                  <Feather
                    name={t.icon}
                    size={20}
                    color={isActive ? palette.brand : palette.textMuted}
                  />
                </View>
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
}
