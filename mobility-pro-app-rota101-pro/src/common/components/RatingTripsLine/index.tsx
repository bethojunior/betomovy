import { FC } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { RatingTripsLineProps } from './types';
import { Row, RatingText, TripsCountText } from './styles';

// Mesma peça visual usada em TripDetail/PartnerCard (foto+nome+estrela+viagens),
// extraída aqui pra ser reaproveitada num contexto compacto (header de chat).
export const RatingTripsLine: FC<RatingTripsLineProps> = ({
  rating,
  tripsCount,
  tripsCountLabel,
}) => {
  const theme = useTheme();
  const ratingValue = Number(rating);
  const hasRating = Number.isFinite(ratingValue);

  if (!hasRating && tripsCount == null) return null;

  return (
    <Row>
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
    </Row>
  );
};
