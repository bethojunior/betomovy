import { NavigationContainer } from "@react-navigation/native";
import Routes from "./routes";
import { AuthProvider } from "./contexts/auth";
import { KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
