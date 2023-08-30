import React from "react";
import {
  KeyboardAvoidingView as NativeKeyboardAvoidingView,
  StyleSheet,
} from "react-native";

export default function KeyboardAvoidingView(props) {
  const { children, behavior = "padding", style, ...otherProps } = props;

  return (
    <NativeKeyboardAvoidingView
      behavior={behavior}
      style={[styles.flex, style]}
      {...otherProps}
    >
      {children}
    </NativeKeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
