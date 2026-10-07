import styled from "styled-components";
import { Select } from "antd";

import { ContentLogoProps, LogoLabelProps } from "./types";

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2rem;

  @media (max-width: 840px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const ContentDescription = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const ContentInput = styled.div`
  margin: 1rem 0;
`;

export const LabelText = styled.p``;

export const ColorsSectionTitle = styled(LabelText)`
  margin-top: 20px;
`;

export const ContentColorsApp = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  input {
    border: none;
    background: none;
    cursor: pointer;
    width: 50px;
    height: 30px;

    ::-webkit-color-swatch {
      width: 100%;
      height: 100%;
    }
  }
`;

export const ContentLogo = styled.div<ContentLogoProps>`
  display: flex;
  gap: 1rem;

  input {
    display: none;
  }

  > img {
    width: 150px;
    height: 150px;
  }

  > span {
    width: 150px;
    font-size: 14px;
  }

  @media (max-width: 840px) {
    margin-top: 2rem;
  }
`;

export const LogoLabel = styled.label<LogoLabelProps>`
  border: 1px solid #000000;
  width: 150px;
  height: 150px;
  cursor: pointer;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url('${({ bgImage }) => bgImage}');
`;

export const FullWidthSelect = styled(Select)`
  width: 100%;
` as typeof Select;

export const ContentSimulatorApp = styled.div``;
