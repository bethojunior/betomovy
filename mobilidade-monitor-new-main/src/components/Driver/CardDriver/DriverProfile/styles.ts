import styled from "styled-components";
import { Image } from "antd";
import { theme_colors } from "../../../../theme/theme";

export const ProfileCard = styled.div`
  display: flex;
  flex: 0 0 220px;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
  padding: 1.25rem 1rem;
  background-color: ${theme_colors.white};
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.02);

  @media (max-width: 900px) {
    width: 100%;
    max-width: 360px;
    align-self: center;
  }
`;

export const ContentImage = styled.div`
  text-align: center;
  display: flex;
  justify-content: center;
`;

export const Avatar = styled(Image)`
  min-width: 120px;
  max-width: 120px;
  min-height: 120px;
  max-height: 120px;
  border-radius: 14px;
  object-fit: cover;
  border: 2px solid #e2e8f0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);

  @media (max-width: 800px) {
    min-width: 90px;
    max-width: 90px;
    min-height: 90px;
    max-height: 90px;
  }
`;

export const FavoriteCode = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
  width: 100%;
`;

export const FavoriteCodeLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;

  svg {
    color: #f59e0b;
  }
`;

export const FavoriteCodeValue = styled.span`
  font-size: 13.5px;
  font-weight: 700;
  color: #0f172a;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 3px 10px;
  letter-spacing: 0.5px;
`;

export const Divider = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid #f1f5f9;
  margin: 0.25rem 0;
`;

export const ContentMidiaSocials = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.25rem;
  width: 100%;

  a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

    img {
      width: 22px;
      height: 22px;
      transition: transform 0.2s ease;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      border-color: #cbd5e1;

      img {
        transform: scale(1.12);
      }
    }
  }
`;
