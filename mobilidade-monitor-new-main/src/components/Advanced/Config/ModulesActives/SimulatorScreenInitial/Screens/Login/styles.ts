import styled from "styled-components";
import {
  Input as InputAntd,
  Button as ButtonAntd,
  Form as FormAntd,
} from "antd";

import { theme_colors } from "../../../../../../../theme/theme";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 0 1rem;
  background-color: ${theme_colors.white};
  border-radius: 20px;
`;

export const TitleScreen = styled.h3`
  font-size: 21px;
  text-align: center;
  margin: 2rem 0;
`;

export const Form = styled(FormAntd)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
`;

export const Input = styled(InputAntd)``;

export const InputPassword = styled(InputAntd.Password)``;

export const Button = styled(ButtonAntd)`
  width: 100%;
  margin: 1rem 0;
`;

export const TextForgotPassword = styled.span`
  font-size: 12px;
  text-align: left;
  color: ${theme_colors.gray};
  cursor: pointer;

  transform: scale(0.99);

  :hover {
    transition: 0.2s;
    transform: scale(1);
  }
`;

export const ContentCheckRobot = styled.div`
  > div {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 0.5rem;

    > input {
      width: 100%;
      border: 1px solid ${theme_colors.black};
      font-size: 12px;
      padding: 0 0.5rem;
    }

    > button {
      width: 100%;
      font-size: 12px;
      background-color: ${theme_colors.black};
      color: ${theme_colors.white};
      border: none;
      padding: 0.25rem;

      &:focus {
        outline: none;
        border: 1px solid rgba(70, 70, 70, 1);
        box-shadow: 0 0 0 2px rgba(70, 70, 70, 0.8);
      }
    }
  }
`;

export const ContentLogo = styled.div`
  display: flex;
  justify-content: center;
`;

export const ImgLogo = styled.img`
  width: 70px;
`;

export const FooterLogin = styled.div`
  border-top: 1px solid ${theme_colors.black};
  padding-top: 1rem;

  > h6 {
    font-size: 12px;
    font-weight: bold;
  }

  p {
    font-size: 9px;
    margin-bottom: 0.2rem;
  }
`;
