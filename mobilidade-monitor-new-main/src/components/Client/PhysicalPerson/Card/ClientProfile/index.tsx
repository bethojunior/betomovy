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

export const ClientProfile = ({
  profileImage,
  baseImageLink,
  phone,
  email,
  message,
}: ClientProfileProps) => {
  const iconClient = import.meta.env.S3_LINK;

  return (
    <ProfileCard>
      <ContentImage>
        <Avatar
          src={`${baseImageLink}${profileImage}`}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `${iconClient}default.jpg`;
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
