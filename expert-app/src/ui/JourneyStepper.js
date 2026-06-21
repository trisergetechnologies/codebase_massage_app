import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "./Text";
import { palette, spacing, radii } from "../theme/tokens";
import { EXPERT_JOURNEY_STEPS } from "../utils/booking";

export function JourneyStepper({ activeIndex }) {
  return (
    <View style={styles.wrap}>
      {EXPERT_JOURNEY_STEPS.map((step, i) => {
        const done = i < activeIndex;
        const current = i === activeIndex;
        return (
          <View key={step.key} style={styles.row}>
            <View style={styles.left}>
              <View
                style={[
                  styles.dot,
                  done && styles.dotDone,
                  current && styles.dotCurrent,
                ]}
              />
              {i < EXPERT_JOURNEY_STEPS.length - 1 && (
                <View style={[styles.line, done && styles.lineDone]} />
              )}
            </View>
            <View style={styles.content}>
              <Text
                variant="subtitle"
                style={{ fontSize: 14, color: current ? palette.accent : palette.text }}
              >
                {step.label}
              </Text>
              {current && (
                <Text variant="caption" style={{ marginTop: 2 }}>
                  {step.desc}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginVertical: spacing.sm },
  row: { flexDirection: "row", minHeight: 52 },
  left: { width: 28, alignItems: "center" },
  dot: {
    width: 12,
    height: 12,
    borderRadius: radii.pill,
    backgroundColor: palette.card2,
    borderWidth: 2,
    borderColor: palette.border,
  },
  dotDone: { backgroundColor: palette.accent, borderColor: palette.accent },
  dotCurrent: { borderColor: palette.accent, backgroundColor: palette.bg },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: palette.border,
    marginVertical: 2,
  },
  lineDone: { backgroundColor: palette.accent },
  content: { flex: 1, paddingBottom: spacing.md, paddingLeft: spacing.sm },
});
