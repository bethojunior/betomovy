import androidIcon from "../../../assets/androidIcon.svg";
import appleIcon from "../../../assets/appleIcon.svg";
import { PlatformWrapper, PlatformIcon } from "./styles";
import { PlatformInfoProps } from "./types";

const PLATFORM_ICONS: Record<string, string> = {
  android: androidIcon,
  ios: appleIcon,
};

export const PlatformInfo = ({ platform }: PlatformInfoProps) => {
  if (!platform) return <span>-</span>;

  const icon = PLATFORM_ICONS[platform.toLowerCase()];

  if (!icon) return <span>{platform}</span>;

  return (
    <PlatformWrapper>
      <PlatformIcon src={icon} alt={platform} />
      {platform}
    </PlatformWrapper>
  );
};
