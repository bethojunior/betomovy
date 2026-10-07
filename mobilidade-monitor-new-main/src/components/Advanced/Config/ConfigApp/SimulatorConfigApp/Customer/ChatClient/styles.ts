import styled from "styled-components";
import { useShadeColor } from "../../../../../../../hooks/useShadeColor";

interface ButtonIconDefaultProps {
  backgroundElement?: string;
  colorElement?: string;
  widthElement?: string;
  heightElement?: string;
  fontsizeElement?: string;
  colorSwitch?: string;
}

export const Container = styled.div<ButtonIconDefaultProps>`
  width: 292px;
  position: absolute;
  height: 91.6%;
  top: 2.5rem;
  border-radius: 0 0 30px 30px;
  background-color: ${({ backgroundElement }) =>
    backgroundElement && useShadeColor(0.1, backgroundElement)};

  .ant-switch.ant-switch-small.ant-switch-checked {
    background-color: ${({ colorSwitch }) => colorSwitch};
  }
`;

export const HeaderChat = styled.div<ButtonIconDefaultProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background-color: ${({ backgroundElement }) => backgroundElement};

  > div {
    display: flex;
    align-items: center;
    gap: 1rem;

    > div {
      padding-top: 0.5rem;
    }
  }
`;

export const ContentIconBack = styled.div<ButtonIconDefaultProps>`
  font-size: 20px;
  color: ${({ colorElement }) => colorElement};
  cursor: pointer;
`;

export const TitleHeader = styled.span<ButtonIconDefaultProps>`
  font-size: 14px;
  font-weight: bold;
  color: ${({ colorElement }) => colorElement};
`;

export const ContentButtonIconDefault = styled.div``;

export const ButtonIconDefault = styled.button<ButtonIconDefaultProps>`
  background-color: ${({ backgroundElement }) => backgroundElement};
  color: ${({ colorElement }) => colorElement};
  border-radius: 360px;
  border: none;
  width: ${({ widthElement }) => widthElement}px;
  height: ${({ heightElement }) => heightElement}px;
  font-size: ${({ fontsizeElement }) => fontsizeElement}px;
  padding-top: 0.3rem;
  .ant-switch.ant-switch-small.ant-switch-checked {
    background-color: ${({ colorSwitch }) => colorSwitch};
  }
`;

export const BodyChat = styled.div`
  padding: 0 0.5rem;
`;

export const CardChat = styled.div<ButtonIconDefaultProps>`
  width: 200px;
  background-color: ${({ backgroundElement }) => backgroundElement};
  padding: 1rem;
  border: none;
  border-radius: 10px;
`;

export const HeaderCardChat = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const TextTime = styled.span`
  color: gray;
  font-size: 10px;
`;

export const ContentMessage = styled.span<ButtonIconDefaultProps>`
  font-size: 12px;
  color: ${({ colorElement }) => colorElement};
`;

export const ObsMessage = styled.p<ButtonIconDefaultProps>`
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 1rem;
  color: ${({ colorElement }) => colorElement};
`;

export const ContentInputChat = styled.div`
  position: absolute;
  bottom: 10px;
  display: flex;
`;

export const InputChat = styled.input`
  width: 270px;
  padding: 0.4rem 3rem 0.4rem 1rem;
  border-radius: 20px;
  border: none;
`;

export const ContentButtonMessageVoice = styled.div``;
