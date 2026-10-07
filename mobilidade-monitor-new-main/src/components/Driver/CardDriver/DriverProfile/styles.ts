import styled from "styled-components";
import { Image } from "antd";
import { theme_colors } from "../../../../theme/theme";

export const ProfileCard = styled.div`
  display: flex;
  flex: 0 0 230px;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1rem;
  background-color: ${theme_colors.white};
  border-radius: 12px;
  border: 1px solid #eef0f2;

  @media (max-width: 900px) {
    width: 100%;
    max-width: 360px;
    align-self: center;
  }
`;

export const ContentImage = styled.div`
  text-align: center;
`;

export const Avatar = styled(Image)`
  min-width: 130px;
  max-width: 130px;
  min-height: 130px;
  max-height: 130px;
  border-radius: 10px;
  object-fit: cover;

  @media (max-width: 800px) {
    min-width: 90px;
    max-width: 90px;
    min-height: 90px;
    max-height: 90px;
  }
`;

export const FavoriteCode = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
`;

export const FavoriteCodeLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #000000;
  font-weight: 700;
`;

export const FavoriteCodeValue = styled.span`
  font-size: 15px;
  font-weight: 400;
  color: #000000;
`;

export const Divider = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid #eef0f2;
  margin: 0.25rem 0;
`;

export const ContentMidiaSocials = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  width: 100%;
`;
