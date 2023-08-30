import React from "react";
import { StyleSheet, View } from "react-native";

import { ModalBottomSheet } from "../../../core-ui";

import SortRadioGroup from "./SortRadioGroup";
import { t } from "../../../helpers/translate";

export default function SortModal(props) {
  let { isModalVisible, toggleModal, radioButtonValue, onValueChange } = props;

  return (
    <ModalBottomSheet
      isModalVisible={isModalVisible}
      toggleModal={toggleModal}
      title={t("Sort By")}
      height={240}
      width={360}
    >
      <View style={styles.content}>
        <SortRadioGroup
          radioButtonValue={radioButtonValue}
          onValueChange={onValueChange}
        />
      </View>
    </ModalBottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingBottom: 16,
    paddingLeft: 27,
  },
});
