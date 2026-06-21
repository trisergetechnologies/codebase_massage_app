import React, { useState } from "react";
import { View, TextInput } from "react-native";
import Text from "./Text";
import { palette, radii, spacing, type } from "../theme/tokens";

/**
 * TextField — labeled input with focus ring. Used across Login, address forms.
 *
 *   <TextField label="Phone" value={...} onChangeText={...} prefix="+91" />
 */
export default function TextField({
  label,
  value,
  onChangeText,
  prefix,
  placeholder,
  keyboardType,
  maxLength,
  editable = true,
  secureTextEntry = false,
  error,
  hint,
  autoCapitalize = "none",
  style,
}) {
  const [focused, setFocused] = useState(false);
  const borderColor = error
    ? palette.danger
    : focused
    ? palette.ink
    : palette.hairline;

  return (
    <View style={style}>
      {label ? (
        <Text variant="caption" color="secondary" style={{ marginBottom: 6 }}>
          {label}
        </Text>
      ) : null}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: editable ? palette.surface : palette.surfaceSoft,
          borderColor,
          borderWidth: 1.5,
          borderRadius: radii.lg,
          paddingHorizontal: spacing.lg,
          height: 56,
        }}
      >
        {prefix ? (
          <Text variant="bodyMd" color="secondary" style={{ marginRight: spacing.sm }}>
            {prefix}
          </Text>
        ) : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={palette.textMuted}
          keyboardType={keyboardType}
          maxLength={maxLength}
          editable={editable}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            color: palette.textPrimary,
            ...type.bodyMd,
            paddingVertical: 0,
          }}
        />
      </View>
      {error || hint ? (
        <Text
          variant="bodySm"
          color={error ? "danger" : "secondary"}
          style={{ marginTop: 6 }}
        >
          {error || hint}
        </Text>
      ) : null}
    </View>
  );
}
