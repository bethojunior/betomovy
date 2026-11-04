import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';

import userImage from '../../client/assets/images/user.png';
import { AvatarImage, Container, LoadingOverlay, MenuIconBadge } from './styles';

function resolveAvatarUri(rawUri?: string | null): string | null {
  if (!rawUri || typeof rawUri !== 'string') return null;
  const trimmed = rawUri.trim();
  if (!trimmed || trimmed === 'user.png' || trimmed.endsWith('/user.png') || trimmed === 'null' || trimmed === 'undefined') return null;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('file://')) {
    return trimmed;
  }
  if (trimmed.startsWith('/')) {
    return `https://api.movymob.com${trimmed}`;
  }
  if (trimmed.includes('customer/profile/') || trimmed.includes('driver/profile/') || trimmed.includes('driver/docs/')) {
    return `https://api.movymob.com/${trimmed.replace(/^\/+/, '')}`;
  }
  if (trimmed.startsWith('driver_') || trimmed.includes('driver')) {
    return `https://api.movymob.com/driver/profile/${trimmed}`;
  }
  return `https://api.movymob.com/customer/profile/compressed/${trimmed}`;
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

  const resolved = resolveAvatarUri(uri);

  const [displaySource, setDisplaySource] = useState<ImageSourcePropType>(
    !showPreloadOverlay && resolved ? { uri: resolved } : userImage,
  );

  const [pendingUri, setPendingUri] = useState<string | null>(
    resolved ? resolved : null,
  );

  useEffect(() => {
    const freshResolved = resolveAvatarUri(uri);
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
  }, [uri, showPreloadOverlay]);

  const handlePreloadLoad = () => {
    if (!pendingUri) return;

    setDisplaySource({ uri: pendingUri });
    setPendingUri(null);
  };

  const handlePreloadError = () => {
    setDisplaySource(userImage);
    setPendingUri(null);
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
        onError={() => setDisplaySource(userImage)}
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
