import Routes from "./routes";
import GlobalStyle from "./styles/global";
import { AuthProvider } from "./contexts/auth";
import { LanguageProvider } from "./contexts/language";
import { FullyProvider } from "./providers/FullyProvider";
import { UserGroupProvider } from "./providers/UserGroupProvider";
import { UserTypeProvider } from "./providers/UserTypeProvider";
import { MapboxProvider } from "./contexts/mapbox";
import { TripTimesProvider } from "./contexts/TripTimesContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <LanguageProvider>
          <FullyProvider>
            <UserGroupProvider>
              <UserTypeProvider>
                <MapboxProvider>
                  <TripTimesProvider>
                    <GlobalStyle />
                    <Routes />
                  </TripTimesProvider>
                </MapboxProvider>
              </UserTypeProvider>
            </UserGroupProvider>
          </FullyProvider>
        </LanguageProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
