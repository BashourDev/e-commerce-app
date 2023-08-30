import React from "react";
import { StyleSheet } from "react-native";

import { COLORS } from "../constants/colors";

import TextInput from "./TextInput";

export default function SearchInput(props) {
  let { style, ...otherProps } = props;

  return (
    <TextInput
      containerStyle={[styles.textInputContainer, style]}
      clearButtonMode="while-editing"
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  textInputContainer: {
    height: 42,
    borderRadius: 8,
    backgroundColor: COLORS.darkWhite,
    borderColor: COLORS.darkWhite,
  },
});
