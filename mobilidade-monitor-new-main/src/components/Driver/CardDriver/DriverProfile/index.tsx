import { FiStar } from "react-icons/fi";

import {
  ProfileCard,
  ContentImage,
  Avatar,
  FavoriteCode,
  FavoriteCodeLabel,
  FavoriteCodeValue,
  Divider,
  ContentMidiaSocials,
} from "./styles";
import { DriverProfileProps } from "./types";
import { IconLink } from "../../../Utils/IconLink";
import Mask from "../../../../services/Mask";

import IconWhatsApp from "../../../../assets/whatsappIcon.svg";
import IconGmail from "../../../../assets/gmailIcon.svg";
import { Constants } from "../../../../utils/constants";

export const DriverProfile = ({
  profileImage,
  baseImageLink,
  nickname,
  idDriver,
  phone,
  email,
  message,
}: DriverProfileProps) => {
  const imgSrc = profileImage
    ? (profileImage.startsWith("http") ? profileImage : `${baseImageLink || ""}${profileImage}`)
    : Constants.defaultImgNotFound;

  return (
    <ProfileCard>
      <ContentImage>
        <Avatar
          src={imgSrc}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = Constants.defaultImgNotFound;
          }}
        />
      </ContentImage>
      <FavoriteCode>
        <FavoriteCodeLabel>
          Código de Favorito
          <FiStar size={14} />
        </FavoriteCodeLabel>
        <FavoriteCodeValue>
          {Mask.createCodeDriver(nickname, idDriver)}
        </FavoriteCodeValue>
      </FavoriteCode>
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
