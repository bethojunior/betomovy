import styled from "styled-components";

interface DefaultProps {
  notShowMoldure: boolean;
}

export const Container = styled.div`
  position: relative;
`;

export const TitleSimulator = styled.h1`
  text-align: center;
  font-weight: bold;
  font-size: 14px;
`;

export const ContentMoldureDevice = styled.div<DefaultProps>`
  position: relative;
  width: 250px;

  > img {
    width: 250px;
  }

  @media (max-width: 768px) {
    > img {
      display: ${({ notShowMoldure }) => (notShowMoldure ? "none" : "block")};
    }
  }
`;

export const ContentMapSimulator = styled.div`
  position: absolute;
  top: 6%;
  left: 6%;

  > img {
    width: 220px;
    height: 460px;
    border-radius: 0 0 20px 20px;
  }
`;

export const ContentScreen = styled.div<DefaultProps>`
  position: absolute;
  top: 10%;
  left: 6%;
  max-width: 250px;
  width: 220px;
  height: 460px;
  border-radius: 0 0 20px 20px;

  @media (max-width: 768px) {
    position: ${({ notShowMoldure }) =>
      notShowMoldure ? "static" : "absolute"};
    width: ${({ notShowMoldure }) => (notShowMoldure ? "100%" : "220px")};
  }
`;
