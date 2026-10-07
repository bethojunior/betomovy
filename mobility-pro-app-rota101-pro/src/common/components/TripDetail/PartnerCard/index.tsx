import { FC } from 'react';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { PartnerCardProps } from './types';
import {
  AvatarFallback,
  Card,
  Info,
  Label,
  Name,
  Photo,
  ProfileRow,
  RatingRow,
  RatingText,
  TripsCountText,
} from './styles';

export const PartnerCard: FC<PartnerCardProps> = ({
  label,
  name,
  photoUrl,
  rating,
  tripsCount,
  tripsCountLabel,
  children,
}) => {
  const theme = useTheme();
  const ratingValue = Number(rating);
  const hasRating = Number.isFinite(ratingValue);

  return (
    <Card>
      <ProfileRow>
        {photoUrl ? (
          <Photo source={{ uri: photoUrl }} />
        ) : (
          <AvatarFallback>
            <MaterialIcons name="person" size={RFValue(24)} color={theme.colors.white} />
          </AvatarFallback>
        )}

        <Info>
          <Label>{label}</Label>
          <Name>{name}</Name>

          {(hasRating || tripsCount != null) && (
            <RatingRow>
              {hasRating && (
                <>
                  <FontAwesome5 name="star" solid size={RFValue(10)} color={theme.colors.yellowStrong} />
                  <RatingText>{ratingValue.toFixed(1)}</RatingText>
                </>
              )}
              {hasRating && tripsCount != null && <TripsCountText>|</TripsCountText>}
              {tripsCount != null && (
                <TripsCountText>
                  {tripsCount} {tripsCountLabel}
                </TripsCountText>
              )}
            </RatingRow>
          )}
        </Info>
      </ProfileRow>

      {children}
    </Card>
  );
};
