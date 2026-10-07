import { NavigationContainer } from "@react-navigation/native";
import Routes from "./routes";
import { AuthProvider } from "./contexts/auth";
import { KeyboardAvoidingView, SafeAreaView } from "react-native";

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <SafeAreaView>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
          >
            <Routes />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </AuthProvider>
    </NavigationContainer>
  );
}
