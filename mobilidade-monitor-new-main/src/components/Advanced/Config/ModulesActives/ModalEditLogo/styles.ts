import styled from "styled-components";

interface LogoProps {
  backgroundImg: string | null;
}

export const Container = styled.div``;

export const ContainerLogo = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

export const ContentLogo = styled.div`
  margin: 1rem 0;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  input[type="file"] {
    display: none;
  }
`;

export const Logo = styled.label<LogoProps>`
  display: block;
  width: 90px;
  height: 90px;
  cursor: pointer;
  text-align: center;
  background-image: ${({ backgroundImg }) => `url(${backgroundImg})`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  object-fit: cover;
  -webkit-box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.75);
`;

export const ContentIcon = styled.div`
  margin-top: 2rem;
  font-size: 24px;
`;

export const ObsText = styled.span`
  color: gray;
  text-align: center;
  display: block;
  margin: 1rem 0;
`;
