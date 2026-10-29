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
import AvatarDefault from "../../../../../assets/avatar.png";
import { Constants } from "../../../../../utils/constants";
import { getCustomerPhotoUrl } from "../../../../../utils/imageUtils";

export const ClientProfile = ({
  profileImage,
  baseImageLink,
  phone,
  email,
  message,
}: ClientProfileProps) => {
  const isDefaultOrEmpty =
    !profileImage ||
    profileImage === "user.png" ||
    profileImage.includes("user.png") ||
    profileImage === "defaultImgNotFound";

  const resolvedPhoto = isDefaultOrEmpty
    ? AvatarDefault
    : getCustomerPhotoUrl(profileImage) ||
      (profileImage.startsWith("http")
        ? profileImage
        : `${baseImageLink || Constants.url_photo_customer}${profileImage}`);

  return (
    <ProfileCard>
      <ContentImage>
        <Avatar
          src={resolvedPhoto}
          fallback={AvatarDefault}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = AvatarDefault;
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
