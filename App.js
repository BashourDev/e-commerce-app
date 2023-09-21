// import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { ApolloProvider } from "@apollo/client";
import { I18nManager, StatusBar } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";

import { CustomTheme } from "./src/constants/theme";

import { Provider as AuthProvider } from "./src/helpers/useAuth";
import { Provider as NetworkProvider } from "./src/helpers/useNetwork";
import {
  ActivityIndicator,
  Provider as ThemeProvider,
} from "react-native-paper";
import { client } from "./src/graphql/client";
import { useFonts } from "expo-font";

// Initialize Apollo Client
// const client = new ApolloClient({
//   uri: "https://b24084.myshopify.com/api/2023-07/graphql.json",
//   headers: {
//     "X-Shopify-Storefront-Access-Token": "9530df8ae16ac90d6ff1d6234bd2ac26",
//   },
//   cache: new InMemoryCache(),
// });
import "./i18n";
I18nManager.forceRTL(CustomTheme.isRTL); // experimental

export default function App() {
  let [fontsLoaded] = useFonts({
    "SourceSansPro-Regular": require("./assets/fonts/SourceSansPro-Regular.ttf"),
    "SourceSansPro-Italic": require("./assets/fonts/SourceSansPro-Italic.ttf"),
    "SourceSansPro-Bold": require("./assets/fonts/SourceSansPro-Bold.ttf"),
    "SourceSansPro-SemiBold": require("./assets/fonts/SourceSansPro-SemiBold.ttf"),
  });
  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }

  return (
    <ApolloProvider client={client}>
      <StatusBar barStyle="default" />
      <ThemeProvider theme={CustomTheme}>
        <NetworkProvider>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </NetworkProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}
// <View style={styles.container}>
//   <Text>Open up App.js to start working on your app!</Text>
//   <StatusBar style="auto" />
//   <DisplayProducts></DisplayProducts>
//   <Button loading={true}>
//     <div>Hello</div>
//   </Button>
// </View>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
