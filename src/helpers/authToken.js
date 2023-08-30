import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_TOKEN_NAME = "@AuthToken";

export function saveToken(userToken) {
  AsyncStorage.setItem(AUTH_TOKEN_NAME, userToken);
}

export function getToken() {
  return AsyncStorage.getItem(AUTH_TOKEN_NAME);
}

export function removeToken() {
  return AsyncStorage.removeItem(AUTH_TOKEN_NAME);
}
