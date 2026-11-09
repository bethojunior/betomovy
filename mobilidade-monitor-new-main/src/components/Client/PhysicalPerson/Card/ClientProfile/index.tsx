import {
  ProfileCard,
  ContentImage,
  Avatar,
  Divider,
  ContentMidiaSocials,
} from "./styles";
import { ClientProfileProps } from "./types";
import { IconLink } from "../../../../Utils/IconLink";
import Mask from "../../../../../services/Mask";

import IconWhatsApp from "../../../../../assets/whatsappIcon.svg";
import IconGmail from "../../../../../assets/gmailIcon.svg";
import { Constants } from "../../../../../utils/constants";
import { getCustomerPhotoUrl, isPlaceholderPhoto } from "../../../../../utils/imageUtils";

const MINIO_DEFAULT_AVATAR = "https://minio.704app.com.br/rota101fb704/default.jpg";

export const ClientProfile = ({
  profileImage,
  profileImageLink,
  baseImageLink,
  phone,
  email,
  message,
}: ClientProfileProps) => {
  const isCustomPhoto = !isPlaceholderPhoto(profileImage);

  const primary =
    (profileImageLink && !isPlaceholderPhoto(profileImageLink) ? profileImageLink : null) ||
    (isCustomPhoto ? getCustomerPhotoUrl(profileImage) : null) ||
    (isCustomPhoto && baseImageLink ? `${baseImageLink}${profileImage}` : null) ||
    MINIO_DEFAULT_AVATAR;

  const fallback = primary?.includes("/compressed/")
    ? primary.replace("/compressed/", "/")
    : (primary !== MINIO_DEFAULT_AVATAR ? MINIO_DEFAULT_AVATAR : Constants.defaultImgNotFound);

  const imgSrc = primary || MINIO_DEFAULT_AVATAR;

  return (
    <ProfileCard>
      <ContentImage>
        <Avatar
          src={imgSrc}
          fallback={Constants.defaultImgNotFound}
          preview={Boolean(isCustomPhoto && imgSrc !== MINIO_DEFAULT_AVATAR && imgSrc !== Constants.defaultImgNotFound)}
          onError={(e) => {
            if (fallback && e.currentTarget.src !== fallback) {
              e.currentTarget.src = fallback;
              return;
            }
            if (e.currentTarget.src !== MINIO_DEFAULT_AVATAR) {
              e.currentTarget.src = MINIO_DEFAULT_AVATAR;
              return;
            }
            e.currentTarget.onerror = null;
            e.currentTarget.src = Constants.defaultImgNotFound;
          }}
        />
      </ContentImage>
      <Divider />
      <ContentMidiaSocials>
        <IconLink
          link={`https://api.whatsapp.com/send?phone=${Mask.toWhatsAppDialable(phone)}&text=${message}`}
          icon={IconWhatsApp}
        />
        <IconLink
          link={`https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${email}`}
          icon={IconGmail}
        />
      </ContentMidiaSocials>
    </ProfileCard>
  );
};
