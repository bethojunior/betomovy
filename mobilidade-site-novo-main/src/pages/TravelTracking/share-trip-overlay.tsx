import { CharLimited } from "../../utils/CharLimited";
import { SHARE_TRIP_ADDRESS_MAX_LENGTH } from "./share-trip-overlay-constants";
import {
  ShareOverlayAddressBlock,
  ShareOverlayAddressColumn,
  ShareOverlayAddressRow,
  ShareOverlayAddressText,
  ShareOverlayCard,
  ShareOverlayCardHeading,
  ShareOverlayCustomerName,
  ShareOverlayCustomerPhone,
  ShareOverlayDestinationText,
  ShareOverlayDot,
  ShareOverlayRoot,
  ShareOverlayRouteLabel,
} from "./share-trip-overlay-styles";
import type { ShareTripOverlayProps } from "./share-trip-overlay.types";
import {
  normalizeShareTripWaypoints,
  resolveShareTripWaypointLabel,
  sanitizePhoneForTelHref,
} from "./share-trip-overlay-utils";

export const ShareTripOverlay = ({ trip }: ShareTripOverlayProps) => {
  const waypoints = normalizeShareTripWaypoints(trip.tripWayPoints);
  const customerName =
    trip.customer?.name ||
    trip.customer?.nickname ||
    trip.customerName ||
    "";
  const customerPhone = trip.customer?.phone?.trim() || "";
  const hasCustomerBlock = Boolean(customerName || customerPhone);
  return (
    <ShareOverlayRoot
      role="region"
      aria-label="Informações da viagem compartilhada"
    >
      {hasCustomerBlock ? (
        <ShareOverlayCard aria-labelledby="share-trip-customer-heading">
          <ShareOverlayCardHeading id="share-trip-customer-heading">
            Passageiro
          </ShareOverlayCardHeading>
          {customerName ? (
            <ShareOverlayCustomerName>{customerName}</ShareOverlayCustomerName>
          ) : null}
          {customerPhone ? (
            <ShareOverlayCustomerPhone>
              <a href={`tel:${sanitizePhoneForTelHref(customerPhone)}`}>
                {customerPhone}
              </a>
            </ShareOverlayCustomerPhone>
          ) : null}
        </ShareOverlayCard>
      ) : null}
      <ShareOverlayCard aria-labelledby="share-trip-route-heading">
        <ShareOverlayCardHeading id="share-trip-route-heading">
          Rota
        </ShareOverlayCardHeading>
        <ShareOverlayAddressBlock>
          <ShareOverlayAddressRow>
            <ShareOverlayDot $variant="origin" aria-hidden />
            <ShareOverlayAddressText title={trip.origin.address}>
              {CharLimited(trip.origin.address, SHARE_TRIP_ADDRESS_MAX_LENGTH)}
            </ShareOverlayAddressText>
          </ShareOverlayAddressRow>
          {waypoints.map((waypoint, index) => {
            const waypointLabel = resolveShareTripWaypointLabel(
              waypoint,
              index
            );
            return (
              <ShareOverlayAddressRow key={`share-trip-wp-${index}`}>
                <ShareOverlayDot $variant="waypoint" aria-hidden />
                <ShareOverlayAddressText title={waypointLabel}>
                  {CharLimited(waypointLabel, SHARE_TRIP_ADDRESS_MAX_LENGTH)}
                </ShareOverlayAddressText>
              </ShareOverlayAddressRow>
            );
          })}
          <ShareOverlayAddressRow>
            <ShareOverlayDot $variant="destination" aria-hidden />
            <ShareOverlayAddressColumn>
              <ShareOverlayRouteLabel>Destino</ShareOverlayRouteLabel>
              <ShareOverlayDestinationText title={trip.destination.name}>
                {CharLimited(
                  trip.destination.name,
                  SHARE_TRIP_ADDRESS_MAX_LENGTH
                )}
              </ShareOverlayDestinationText>
            </ShareOverlayAddressColumn>
          </ShareOverlayAddressRow>
        </ShareOverlayAddressBlock>
      </ShareOverlayCard>
    </ShareOverlayRoot>
  );
};
