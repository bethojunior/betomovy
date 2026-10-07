import styled from "styled-components";
import { theme_colors } from "../../theme/theme";

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  padding: 2rem;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;

  @media (max-width: 850px) {
    background: ${theme_colors.black} !important;
  }
`;

export const Content = styled.div`
  max-width: 1440px;
  width: 100%;

  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 2rem;
`;

export const ContentText = styled.div`
  display: flex;
  align-items: center;
  color: ${theme_colors.white};
  position: relative;

  h1 {
    font-size: 60px;
    font-weight: 500;
    letter-spacing: 0.5rem;

    > span {
      font-weight: bold;
    }
  }

  h2 {
    font-size: 40px;
    letter-spacing: 0.3rem;
  }

  @media (max-width: 850px) {
    display: none;
  }
`;

export const Ball = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 360px;
  background-color: ${theme_colors.white};
`;

export const Line = styled.div`
  width: 30px;
  height: 400px;
  background-color: white;
  position: relative;
  top: -10px;
`;

export const ContentIconArrow = styled.div`
  font-size: 50px;
  margin-right: 4rem;
  text-align: center;
`;

export const ContainerSimulationLogin = styled.div``;

export const ContentLogo = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;

  > img {
    width: 50px;
  }
`;
