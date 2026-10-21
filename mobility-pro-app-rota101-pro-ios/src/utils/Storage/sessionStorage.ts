import AsyncStorage from '@react-native-async-storage/async-storage';

const ACTIVE_SESSION_KEY = '@Auth:activeSession';

const KEYS = {
  driver: {user: '@Auth:userDriver', token: '@Auth:tokenDriver'},
  user: {user: '@Auth:user', token: 'lastToken'},
} as const;

export type SessionType = keyof typeof KEYS;

export async function saveSession(
  key: SessionType,
  user: string | null,
  token: string | null,
) {
  const {user: userKey, token: tokenKey} = KEYS[key];
  const otherKey: SessionType = key === 'user' ? 'driver' : 'user';
  const {user: otherUserKey, token: otherTokenKey} = KEYS[otherKey];

  await Promise.all([
    AsyncStorage.setItem(userKey, user ?? ''),
    AsyncStorage.setItem(tokenKey, token ?? ''),
    AsyncStorage.setItem(ACTIVE_SESSION_KEY, key),
    AsyncStorage.removeItem(otherUserKey),
    AsyncStorage.removeItem(otherTokenKey),
  ]);
}

export async function clearSession(key: SessionType) {
  const {user: userKey, token: tokenKey} = KEYS[key];

  await Promise.all([
    AsyncStorage.removeItem(userKey),
    AsyncStorage.removeItem(tokenKey),
    AsyncStorage.removeItem(ACTIVE_SESSION_KEY),
  ]);
}

export async function loadSession() {
  const activeSession = await AsyncStorage.getItem(ACTIVE_SESSION_KEY);

  if (activeSession === 'driver') {
    const [driver, driverToken] = await Promise.all([
      AsyncStorage.getItem(KEYS.driver.user),
      AsyncStorage.getItem(KEYS.driver.token),
    ]);
    if (driver || driverToken) {
      return {user: driver, token: driverToken, isDriver: true};
    }
  }

  if (activeSession === 'user') {
    const [user, token] = await Promise.all([
      AsyncStorage.getItem(KEYS.user.user),
      AsyncStorage.getItem(KEYS.user.token),
    ]);
    if (user || token) {
      return {user, token, isDriver: false};
    }
  }

  const [user, token, driver, driverToken] = await Promise.all([
    AsyncStorage.getItem(KEYS.user.user),
    AsyncStorage.getItem(KEYS.user.token),
    AsyncStorage.getItem(KEYS.driver.user),
    AsyncStorage.getItem(KEYS.driver.token),
  ]);

  if (user || token) {
    return {user, token, isDriver: false};
  }

  if (driver || driverToken) {
    return {user: driver, token: driverToken, isDriver: true};
  }

  return {user: null, token: null, isDriver: false};
}

export async function saveSessionUser(key: SessionType, user: string | null) {
  const {user: userKey} = KEYS[key];
  await AsyncStorage.setItem(userKey, user ?? '');
}

export async function saveSessionToken(key: SessionType, token: string | null) {
  const {token: tokenKey} = KEYS[key];

  const prevToken = await AsyncStorage.getItem(tokenKey);

  if (prevToken !== token) {
    await AsyncStorage.setItem(tokenKey, token ?? '');
  }
}
