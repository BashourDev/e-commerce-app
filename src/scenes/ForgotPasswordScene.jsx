import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

import { useNavigation } from "@react-navigation/native";

import { ModalBottomSheetMessage } from "../components";
import {
  defaultButton,
  defaultButtonLabel,
  flatTextInputContainerStyle,
  flatTextInputStyle,
} from "../constants/theme";
import { Button, ModalBottomSheet, TextInput } from "../core-ui";
import { useForgotPasswordMutation } from "../hooks/api/useAuthenticatedUser";
import { useTranslation } from "react-i18next";

export default function ForgotPasswordScene() {
  let { navigate } = useNavigation();
  const { t } = useTranslation();
  let [emailValue, setEmailValue] = useState("");
  let [isVisible, setVisible] = useState(false);
  let [error, setError] = useState("");

  const isError = error !== "";

  let toggleModalVisible = () => setVisible(!isVisible);

  let { resetPassword, loading } = useForgotPasswordMutation({
    onCompleted({ customerRecover }) {
      if (emailValue === "") {
        setError(errorMessage);
        toggleModalVisible();
      } else {
        if (customerRecover && customerRecover.customerUserErrors.length > 0) {
          setError(customerRecover.customerUserErrors[0].message);
          toggleModalVisible();
        }
        toggleModalVisible();
      }
    },
    onError(error) {
      let { message } = error;
      let errorMessage = message.split("GraphQL error: ")[1];
      setError(errorMessage);
      toggleModalVisible();
    },
  });

  let onPressButton = () => {
    resetPassword({
      variables: {
        email: emailValue,
      },
    });
  };

  let onPressModalButton = () => {
    setVisible(!isVisible);
    setEmailValue("");
    navigate("Auth", { initialRouteKey: "Login" });
  };

  let errorMessage = isError
    ? error
    : t(
        "ForgotPasswordScene.An email has been sent to reset your password. Please check your email."
      );

  return (
    <SafeAreaView style={styles.flex}>
      <ModalBottomSheet
        title={
          isError
            ? t("ForgotPasswordScene.An Error Occured!")
            : t("ForgotPasswordScene.Email Has Been Sent!")
        }
        isModalVisible={isVisible}
        toggleModal={toggleModalVisible}
      >
        <ModalBottomSheetMessage
          isError={isError}
          message={errorMessage}
          onPressModalButton={onPressModalButton}
          buttonText={
            isError
              ? t("ForgotPasswordScene.Try Again")
              : t("ForgotPasswordScene.Back To Login")
          }
        />
      </ModalBottomSheet>
      <View style={styles.textInputContainer}>
        <TextInput
          mode="flat"
          label={t("ForgotPasswordScene.Email Address")}
          value={emailValue}
          onChangeText={setEmailValue}
          autoFocus={true}
          autoCapitalize="none"
          containerStyle={flatTextInputContainerStyle}
          style={flatTextInputStyle}
        />
      </View>
      <Button
        style={[defaultButton, styles.buttonStyle]}
        labelStyle={defaultButtonLabel}
        onPress={onPressButton}
        loading={loading}
      >
        {!loading && t("ForgotPasswordScene.Reset Password")}
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  textInputContainer: {
    flex: 1,
    marginTop: 16,
    marginHorizontal: 24,
  },
  buttonStyle: {
    marginVertical: 24,
    marginHorizontal: 24,
  },
});
