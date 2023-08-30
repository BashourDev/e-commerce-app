import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { COLORS } from "../constants/colors";
import { FONT_FAMILY } from "../constants/fonts";

import Text from "./Text";

export default function Avatar(props) {
  let { firstName, lastName, size, containerStyle } = props;

  let avatarSize = {
    width: size,
    height: size,
    borderRadius: Math.round(size / 2),
  };
  let textSize = {
    fontSize: Math.round(size / 2),
  };

  return (
    <View style={[styles.avatar, containerStyle, avatarSize]}>
      <Text
        style={[styles.nameInitial, textSize]}
      >{`${firstName[0]}${lastName[0]}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: COLORS.primaryColor,
    justifyContent: "center",
    alignItems: "center",
  },
  nameInitial: {
    color: COLORS.white,
    fontFamily: FONT_FAMILY.MEDIUM,
  },
});
