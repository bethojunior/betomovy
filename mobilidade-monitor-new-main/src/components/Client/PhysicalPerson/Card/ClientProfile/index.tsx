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
import { getCustomerPhotoCandidates } from "../../../../../utils/imageUtils";

const getInitials = (name?: string) => {
  if (!name || !name.trim()) return "CL";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const ClientProfile = ({
  name,
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
  const [imgLoadFailed, setImgLoadFailed] = useState(false);

  useEffect(() => {
    setCandidateIndex(0);
    setImgLoadFailed(false);
  }, [profileImage, profileImageLink]);

  const hasCandidate = candidates.length > 0 && candidateIndex < candidates.length && !imgLoadFailed;
  const resolvedPhoto = hasCandidate ? candidates[candidateIndex] : null;

  return (
    <ProfileCard>
      <ContentImage>
        {resolvedPhoto ? (
          <Avatar
            key={resolvedPhoto}
            src={resolvedPhoto}
            preview={true}
            onError={() => {
              if (candidateIndex + 1 < candidates.length) {
                setCandidateIndex((prev) => prev + 1);
              } else {
                setImgLoadFailed(true);
              }
            }}
          />
        ) : (
          <div
            style={{
              width: 130,
              height: 130,
              borderRadius: 12,
              background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "2.5rem",
              fontWeight: 700,
              letterSpacing: 1.5,
              boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
              textTransform: "uppercase",
              userSelect: "none",
              margin: "0 auto",
            }}
          >
            {getInitials(name)}
          </div>
        )}
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
