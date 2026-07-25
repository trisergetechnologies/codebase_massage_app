import React, { useEffect, useRef, useState } from "react";
import { View, Pressable, Image, Alert, ActivityIndicator, ScrollView, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import * as Location from "expo-location";

import { Screen, Text, Button, Card, IconButton, Divider, QtyStepper, BottomNav } from "../ui";
import { palette, spacing, radii, layout, type } from "../theme/tokens";
import { useCart } from "../CartContext";
import { api } from "../api";

export default function CartScreen({ navigation }) {
  const cart = useCart();
  const [loc, setLoc] = useState(null);
  const [locLoading, setLocLoading] = useState(true);
  const [permErr, setPermErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [discount, setDiscount] = useState("");
  const [paymentTiming, setPaymentTiming] = useState("pay_later");

  useEffect(() => {
    (async () => {
      setLocLoading(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setPermErr("Location permission is required to book. Enable it in settings.");
          setLoc(null);
          return;
        }
        const here = await Location.getCurrentPositionAsync({});
        setLoc(here);
        setPermErr("");
      } catch (e) {
        setPermErr(e.message || "Could not get your location.");
        setLoc(null);
      } finally {
        setLocLoading(false);
      }
    })();
  }, []);

  const tax = Math.round(cart.total * 0.05);
  const grand = cart.total + tax;

  async function book() {
    if (!loc) {
      Alert.alert("Location required", permErr || "Waiting for your location.");
      return;
    }
    setBusy(true);
    try {
      // Expand cart by quantity for backend (one line item per body)
      const ids = cart.items.flatMap((i) => Array(i.quantity || 1).fill(i.id));
      const booking = await api.createBooking(ids, {
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
        address: "Current location",
      }, paymentTiming);
      cart.clear();
      navigation.replace("Booking", { bookingId: booking.id });
    } catch (e) {
      Alert.alert("Booking failed", e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen edges={["top"]} noPadding>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: layout.screenPadding,
          paddingBottom: layout.scrollBottomGuard + 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Editorial header — large left title, count inline, ... menu right */}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: spacing.md }}>
          <IconButton elevated onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={18} color={palette.ink} />
          </IconButton>
          <View style={{ flex: 1 }} />
          <IconButton elevated>
            <Feather name="more-horizontal" size={18} color={palette.ink} />
          </IconButton>
        </View>
        <View style={{ height: spacing.lg }} />
        <Text variant="h1">My cart ({cart.count})</Text>

        {/* Items list */}
        <View style={{ height: spacing.xl }} />

        {cart.items.length === 0 ? (
          <Card elevation="sm" padding={spacing.xxl}>
            <View style={{ alignItems: "center" }}>
              <Feather name="shopping-bag" size={28} color={palette.textMuted} />
              <Text variant="bodyMd" color="muted" style={{ marginTop: spacing.sm }}>
                Your cart is empty.
              </Text>
            </View>
          </Card>
        ) : (
          cart.items.map((it) => (
            <View key={it.id} style={{ marginBottom: spacing.md }}>
              <SwipeableRow onDelete={() => cart.remove(it.id)}>
                <CartRow
                  item={it}
                  onMinus={() => cart.decrement(it.id)}
                  onPlus={() => cart.increment(it.id)}
                />
              </SwipeableRow>
            </View>
          ))
        )}

        {/* Discount code */}
        {cart.items.length > 0 && (
          <>
            <View style={{ height: spacing.md }} />
            <Card elevation="sm" padding={spacing.md}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Feather name="tag" size={14} color={palette.textSecondary} />
                <Text variant="bodySm" color="secondary" style={{ marginLeft: spacing.sm, flex: 1 }}>
                  {discount ? discount : "Enter discount code"}
                </Text>
                <Pressable hitSlop={8} onPress={() => Alert.alert("Coupons coming soon")}>
                  <Text variant="bodySmMd" color="ink">Apply</Text>
                </Pressable>
              </View>
            </Card>

            {/* Address */}
            <View style={{ height: spacing.lg }} />
            <Card elevation="sm">
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    width: 40, height: 40, borderRadius: 20,
                    backgroundColor: palette.surfaceSoft,
                    alignItems: "center", justifyContent: "center",
                    marginRight: spacing.md,
                  }}
                >
                  <Feather name="map-pin" size={18} color={palette.ink} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="bodyMd">Current location</Text>
                  {loc ? (
                    <Text variant="bodySm" color="secondary" numberOfLines={1} style={{ marginTop: 2 }}>
                      {loc.coords.latitude.toFixed(4)}, {loc.coords.longitude.toFixed(4)}
                    </Text>
                  ) : (
                    <ActivityIndicator size="small" color={palette.ink} style={{ alignSelf: "flex-start" }} />
                  )}
                </View>
              </View>
              {permErr ? (
                <Text variant="bodySm" style={{ marginTop: spacing.sm, color: palette.warn }}>
                  {permErr}
                </Text>
              ) : null}
            </Card>

            {/* Bill summary — straight rows, no card frame, mirrors reference */}
            <View style={{ height: spacing.xl }} />
            <Row label="Subtotal" value={`₹${cart.total}`} />
            <View style={{ height: spacing.md }} />
            <Row label="Taxes (5%)" value={`₹${tax}`} />
            <View style={{ height: spacing.md }} />
            <Divider my={0} />
            <View style={{ height: spacing.md }} />
            <Row label="Total" value={`₹${grand}`} bold />

            <View style={{ height: spacing.lg }} />
            <Text variant="bodyMdMd">When would you like to pay?</Text>
            <View style={{ height: spacing.sm }} />
            <Pressable
              onPress={() => setPaymentTiming("pay_now")}
              style={{
                borderRadius: radii.lg,
                borderWidth: 1.5,
                borderColor: paymentTiming === "pay_now" ? palette.ink : palette.hairline,
                backgroundColor: paymentTiming === "pay_now" ? palette.surfaceSoft : palette.bg,
                padding: spacing.md,
                marginBottom: spacing.sm,
              }}
            >
              <Text variant="bodyMdMd">Pay now</Text>
              <Text variant="bodySm" color="secondary" style={{ marginTop: 4 }}>
                Pay to confirm and find your expert
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setPaymentTiming("pay_later")}
              style={{
                borderRadius: radii.lg,
                borderWidth: 1.5,
                borderColor: paymentTiming === "pay_later" ? palette.ink : palette.hairline,
                backgroundColor: paymentTiming === "pay_later" ? palette.surfaceSoft : palette.bg,
                padding: spacing.md,
              }}
            >
              <Text variant="bodyMdMd">Pay later</Text>
              <Text variant="bodySm" color="secondary" style={{ marginTop: 4 }}>
                Find expert first, pay anytime before session ends
              </Text>
            </Pressable>

            <View style={{ height: spacing.lg }} />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: spacing.md,
                borderRadius: radii.lg,
                backgroundColor: palette.successSoft,
              }}
            >
              <Feather name="zap" size={16} color={palette.success} />
              <Text variant="bodySmMd" style={{ marginLeft: spacing.sm, color: palette.success }}>
                Therapist arrives within 15 minutes — guaranteed.
              </Text>
            </View>

            <View style={{ height: spacing.xl }} />
            <Button
              title={paymentTiming === "pay_now" ? "Continue to payment" : "Confirm & find expert"}
              onPress={book}
              loading={busy}
              disabled={cart.items.length === 0 || locLoading || !loc}
              fullWidth
              rightIcon={<Feather name="arrow-right" size={16} color={palette.textOnInk} />}
            />
          </>
        )}
      </ScrollView>

      <BottomNav active="cart" />
    </Screen>
  );
}

/* ---------------- swipe-to-delete row wrapper ---------------- */

function SwipeableRow({ children, onDelete }) {
  const swipeRef = useRef(null);
  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0.7],
      extrapolate: "clamp",
    });
    return (
      <Pressable
        onPress={() => { swipeRef.current?.close?.(); onDelete(); }}
        style={{
          width: 76,
          marginLeft: spacing.md,
          backgroundColor: palette.heartSoft,
          borderRadius: radii.xl,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Feather name="trash-2" size={18} color={palette.heart} />
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <Swipeable ref={swipeRef} renderRightActions={renderRightActions} overshootRight={false}>
      {children}
    </Swipeable>
  );
}

/* ---------------- cart row ---------------- */

function CartRow({ item, onMinus, onPlus }) {
  return (
    <Card padding={spacing.md} radius={radii.xxl}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 64, height: 64,
            borderRadius: radii.xl,
            backgroundColor: palette.surfaceWarm,
            overflow: "hidden",
            marginRight: spacing.md,
            alignItems: "center",
            justifyContent: "center",
            padding: 4,
          }}
        >
          <Image
            source={{ uri: item.imageUrl }}
            style={{ width: "100%", height: "100%", borderRadius: radii.lg }}
            resizeMode="cover"
          />
        </View>
        <View style={{ flex: 1, paddingRight: spacing.sm }}>
          <Text variant="bodyMd" numberOfLines={1}>{item.name}</Text>
          <Text variant="price" style={{ marginTop: 2 }}>₹{item.price}</Text>
        </View>
        <QtyStepper
          value={item.quantity || 1}
          onMinus={onMinus}
          onPlus={onPlus}
        />
      </View>
    </Card>
  );
}

/* ---------------- bill row ---------------- */

function Row({ label, value, bold = false }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
      <Text variant={bold ? "h2" : "bodyMd"} color={bold ? "primary" : "secondary"}>{label}</Text>
      <Text variant={bold ? "priceLg" : "bodyMd"}>{value}</Text>
    </View>
  );
}
