import { FaStar } from "react-icons/fa";
import {
  ShareOverlayCard,
  ShareOverlayCardHeading,
  ShareOverlayDriverAvatar,
  ShareOverlayDriverCarInfo,
  ShareOverlayDriverDetails,
  ShareOverlayDriverNickname,
  ShareOverlayDriverPlate,
  ShareOverlayDriverRating,
  ShareOverlayDriverRow,
} from "./share-trip-overlay-styles";
import type { ShareTripOverlayProps } from "./share-trip-overlay.types";
import {
  formatShareTripDriverCarSummary,
  formatShareTripDriverRating,
} from "./share-trip-overlay-utils";

const DRIVER_FALLBACK_PHOTO = require("../../assets/img/driver-not-found.jpg") as string;

export const ShareTripDriverCard = ({ trip }: ShareTripOverlayProps) => {
  const driver = trip.driver;
  if (!driver) {
    return null;
  }
  const driverPhotoSrc = driver.profileImage
    ? `${window.env.REACT_APP_BUCKET_URL}driver/profile/${driver.profileImage}`
    : DRIVER_FALLBACK_PHOTO;
  const driverDisplayName =
    driver.nickname?.trim() || driver.name?.trim() || "";
  return (
    <ShareOverlayCard aria-labelledby="share-trip-driver-heading">
      <ShareOverlayCardHeading id="share-trip-driver-heading">
        Motorista
      </ShareOverlayCardHeading>
      <ShareOverlayDriverRow>
        <ShareOverlayDriverAvatar src={driverPhotoSrc} alt="" />
        <ShareOverlayDriverDetails>
          {driverDisplayName ? (
            <ShareOverlayDriverNickname>{driverDisplayName}</ShareOverlayDriverNickname>
          ) : null}
          <ShareOverlayDriverPlate>{driver.car.plate}</ShareOverlayDriverPlate>
          <ShareOverlayDriverCarInfo
            title={formatShareTripDriverCarSummary(driver)}
          >
            {formatShareTripDriverCarSummary(driver)}
          </ShareOverlayDriverCarInfo>
          <ShareOverlayDriverRating>
            <FaStar aria-hidden focusable="false" />
            <span>{formatShareTripDriverRating(driver.rating)}</span>
          </ShareOverlayDriverRating>
        </ShareOverlayDriverDetails>
      </ShareOverlayDriverRow>
    </ShareOverlayCard>
  );
};
