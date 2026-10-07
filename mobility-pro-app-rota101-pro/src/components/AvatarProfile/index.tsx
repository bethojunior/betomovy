import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';

import userImage from '../../client/assets/images/user.png';
import { AvatarImage, Container, LoadingOverlay, MenuIconBadge } from './styles';

function isValidUri(uri?: string | null) {
  return !!uri && uri.trim() !== '' && !uri.includes('user.png');
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

  const [displaySource, setDisplaySource] = useState<ImageSourcePropType>(
    !showPreloadOverlay && isValidUri(uri) ? { uri } : userImage,
  );

  const [pendingUri, setPendingUri] = useState<string | null>(
    isValidUri(uri) ? uri : null,
  );

  useEffect(() => {
    if (!isValidUri(uri)) {
      setDisplaySource(userImage);
      setPendingUri(null);
      return;
    }

    if (showPreloadOverlay) {
      setPendingUri(uri);
    } else {
      setDisplaySource({ uri });
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
