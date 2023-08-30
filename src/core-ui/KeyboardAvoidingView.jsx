import React from "react";
import { StyleSheet, View } from "react-native";

export default function KeyboardAvoidingView({ style, children }) {
  return <View style={[styles.defaultContainer, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  defaultContainer: { flex: 1 },
});
