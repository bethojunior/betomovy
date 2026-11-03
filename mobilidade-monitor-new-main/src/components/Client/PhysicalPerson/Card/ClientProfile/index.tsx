import { useEffect, useMemo, useState } from "react";
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
import { getCustomerPhotoCandidates } from "../../../../../utils/imageUtils";

export const ClientProfile = ({
  profileImage,
  profileImageLink,
  phone,
  email,
  message,
}: ClientProfileProps) => {
  const candidates = useMemo(
    () => getCustomerPhotoCandidates(profileImage, profileImageLink),
    [profileImage, profileImageLink]
  );
  const [candidateIndex, setCandidateIndex] = useState(0);

  useEffect(() => {
    setCandidateIndex(0);
  }, [profileImage, profileImageLink]);

  const hasCandidate = candidates.length > 0 && candidateIndex < candidates.length;
  const resolvedPhoto = hasCandidate ? candidates[candidateIndex] : AvatarDefault;

  return (
    <ProfileCard>
      <ContentImage>
        <Avatar
          key={resolvedPhoto}
          src={resolvedPhoto}
          preview={hasCandidate}
          fallback={AvatarDefault}
          onError={() => {
            setCandidateIndex((prev) => prev + 1);
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
