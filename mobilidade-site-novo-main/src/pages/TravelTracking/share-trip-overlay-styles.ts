import styled from "styled-components";
import { colors } from "../../theme/colors";
import {
  SHARE_TRIP_ROUTE_DOT,
  type ShareTripRouteDotVariant,
} from "./share-trip-overlay-constants";

export const ShareOverlayRoot = styled.div`
  position: absolute;
  z-index: 900;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  pointer-events: none;
  align-items: stretch;

  @media (min-width: 992px) {
    top: 1.5rem;
    left: 1.5rem;
    right: auto;
    width: min(360px, 32vw);
    align-items: stretch;
  }
`;

export const ShareOverlayCard = styled.section`
  pointer-events: auto;
  background-color: ${colors.white};
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(124, 121, 121, 0.45);
  padding: 1rem 1.25rem;
`;

export const ShareOverlayCardHeading = styled.h2`
  margin: 0 0 0.75rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: ${colors.black};
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;

export const ShareOverlayCustomerName = styled.p`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.black};
`;

export const ShareOverlayCustomerPhone = styled.p`
  margin: 0.35rem 0 0;
  font-size: 0.875rem;
  color: ${colors.gray};
`;

export const ShareOverlayAddressBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`;

export const ShareOverlayAddressRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  min-width: 0;
`;

export const ShareOverlayDot = styled.span<{ $variant: ShareTripRouteDotVariant }>`
  flex-shrink: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 0.35rem;
  background-color: ${({ $variant }) => SHARE_TRIP_ROUTE_DOT[$variant]};
`;

export const ShareOverlayAddressText = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 0.875rem;
  line-height: 1.35;
  color: ${colors.black};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ShareOverlayAddressColumn = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ShareOverlayRouteLabel = styled.small`
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.75rem;
  color: ${colors.gray};
`;

export const ShareOverlayDestinationText = styled.span`
  display: block;
  font-size: 0.875rem;
  line-height: 1.35;
  color: ${colors.black};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ShareOverlayDriverRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  min-width: 0;
`;

export const ShareOverlayDriverAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  background-color: ${colors.black};

  @media (max-width: 425px) {
    width: 40px;
    height: 40px;
  }
`;

export const ShareOverlayDriverDetails = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

export const ShareOverlayDriverNickname = styled.p`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.black};
  line-height: 1.2;
`;

export const ShareOverlayDriverPlate = styled.p`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: ${colors.black};
`;

export const ShareOverlayDriverCarInfo = styled.p`
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.3;
  color: ${colors.black};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ShareOverlayDriverRating = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.35rem;
  margin-top: 0.35rem;

  svg {
    flex-shrink: 0;
  }

  span {
    font-size: 0.95rem;
    font-weight: 600;
    line-height: 1;
  }
`;
