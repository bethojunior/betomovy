import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';

import userImage from '../../client/assets/images/user.png';
import { AvatarImage, Container, LoadingOverlay, MenuIconBadge } from './styles';

const STORAGE_BASE = 'https://minio.704app.com.br/rota101fb704/';

function photoCandidates(rawUri?: string | null): string[] {
  if (!rawUri || typeof rawUri !== 'string') return [];
  const trimmed = rawUri.trim();
  if (!trimmed || trimmed === 'user.png' || trimmed.endsWith('/user.png') || trimmed === 'null' || trimmed === 'undefined') {
    return [];
  }

  const urls: string[] = [];
  const push = (value?: string) => {
    if (!value || urls.includes(value)) return;
    urls.push(value);
  };

  if (trimmed.startsWith('file://')) return [trimmed];

  const markerIndex = ['driver/profile/', 'driver/docs/', 'customer/profile/']
    .map(marker => trimmed.indexOf(marker))
    .find(index => index >= 0);
  const relative = markerIndex !== undefined && markerIndex >= 0
    ? trimmed.slice(markerIndex)
    : trimmed.replace(/^\/+/, '');

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) push(trimmed);
  push(`${STORAGE_BASE}${relative.replace(/^\/+/, '')}`);
  if (relative.includes('/compressed/')) {
    push(`${STORAGE_BASE}${relative.replace('/compressed/', '/')}`);
  } else if (relative.includes('profile/')) {
    push(`${STORAGE_BASE}${relative.replace('profile/', 'profile/compressed/')}`);
  }
  if (!relative.includes('/')) {
    push(`${STORAGE_BASE}driver/profile/compressed/${relative}`);
    push(`${STORAGE_BASE}driver/profile/${relative}`);
  }

  return urls;
}

function resolveAvatarUri(rawUri?: string | null): string | null {
  return photoCandidates(rawUri)[0] || null;
}

function isValidUri(uri?: string | null) {
  return !!resolveAvatarUri(uri);
}

interface AvatarProfileProps {
  uri?: string | null;
  size?: number;
  loading?: boolean;
  showPreloadOverlay?: boolean;
  borderColor?: string;
  borderWidth?: number;
  showMenuIcon?: boolean;
}

export function AvatarProfile({
  uri,
  size = RFValue(60),
  loading = false,
  showPreloadOverlay = false,
  borderColor,
  borderWidth,
  showMenuIcon = false,
}: AvatarProfileProps) {
  const theme = useTheme();

  const candidates = photoCandidates(uri);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const resolved = candidates[candidateIndex] || null;

  const [displaySource, setDisplaySource] = useState<ImageSourcePropType>(
    !showPreloadOverlay && resolved ? { uri: resolved } : userImage,
  );

  const [pendingUri, setPendingUri] = useState<string | null>(
    resolved ? resolved : null,
  );

  useEffect(() => {
    setCandidateIndex(0);
  }, [uri]);

  useEffect(() => {
    const freshResolved = photoCandidates(uri)[candidateIndex] || null;
    if (!freshResolved) {
      setDisplaySource(userImage);
      setPendingUri(null);
      return;
    }

    if (showPreloadOverlay) {
      setPendingUri(freshResolved);
    } else {
      setDisplaySource({ uri: freshResolved });
      setPendingUri(null);
    }
  }, [uri, showPreloadOverlay, candidateIndex]);

  const tryNextCandidate = () => {
    if (candidateIndex + 1 < candidates.length) {
      setCandidateIndex(candidateIndex + 1);
      return;
    }
    setDisplaySource(userImage);
    setPendingUri(null);
  };

  const handlePreloadLoad = () => {
    if (!pendingUri) return;

    setDisplaySource({ uri: pendingUri });
    setPendingUri(null);
  };

  const handlePreloadError = () => {
    tryNextCandidate();
  };

  const isPreloading = pendingUri !== null;

  return (
    <Container size={size}>
      <AvatarImage
        source={displaySource}
        size={size}
        borderColor={borderColor}
        borderWidth={borderWidth}
        resizeMode="cover"
        onError={tryNextCandidate}
      />

      {isPreloading && (
        <Image
          source={{ uri: pendingUri }}
          style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
          onLoad={handlePreloadLoad}
          onError={handlePreloadError}
        />
      )}

      {(loading || (showPreloadOverlay && isPreloading)) && (
        <LoadingOverlay size={size}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </LoadingOverlay>
      )}

      {showMenuIcon && (
        <MenuIconBadge size={size}>
          <Ionicons name="menu" size={size * 0.26} color={theme.colors.secondary} />
        </MenuIconBadge>
      )}
    </Container>
  );
}
