import styled from "styled-components";

interface ColorDynamicProps {
  backgroundColorElement?: string | undefined;
  colorElement?: string | undefined;
}

export const Container = styled.div`
  width: 292px;
  position: absolute;
  height: 91.6%;
  top: 2.5rem;
  border-radius: 0 0 30px 30px;

  > .map-image {
    width: 100%;
    height: 55%;
  }
`;

export const Column1 = styled.div`
  position: absolute;
  top: 2rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ButtonIcon = styled.button<ColorDynamicProps>`
  width: 50px;
  height: 50px;
  background-color: ${({ backgroundColorElement }) => backgroundColorElement};
  border: none;
  border-radius: 360px;
  font-size: 24px;
  padding-top: 0.5rem;
  color: ${({ colorElement }) => colorElement};
  cursor: pointer;
`;

export const ContentCardTravelInProgress = styled.div<ColorDynamicProps>`
  position: absolute;
  bottom: 0;
  height: 275px;
  border-radius: 5px 5px 29px 29px;
  -webkit-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.75);
  background-color: ${({ backgroundColorElement }) => backgroundColorElement};
`;

export const HeaderCardTravelInProgress = styled.div<ColorDynamicProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  font-size: 12px;
  color: ${({ colorElement }) => colorElement};

  > div:nth-child(2) {
    > div {
      padding: 0.2rem 0.9rem;
      border: 1px solid #80808063;
      border-radius: 3px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  border-bottom: 1px solid #80808063;
`;

export const ContentDriver = styled.div<ColorDynamicProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.2rem 0.6rem;
  margin: 2rem 0;
  color: ${({ colorElement }) => colorElement};

  > div > div:nth-child(1) {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }

  > div:nth-child(2) {
    > h3 {
      font-size: 14px;
      color: ${({ colorElement }) => colorElement};
    }

    > p {
      font-size: 10px;
    }
  }
`;

export const ContentAvatar = styled.div<ColorDynamicProps>`
  position: relative;
  img {
    width: 60px;
    height: 60px;
    border: 2px solid ${({ colorElement }) => colorElement};
    border-radius: 360px;
  }
`;

export const ScoreAvatar = styled.div<ColorDynamicProps>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  gap: 0.2rem;
  bottom: 0px;
  width: 60px;
  border-radius: 10px;
  -webkit-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.75);
  background-color: ${({ backgroundColorElement }) => backgroundColorElement};

  > span {
    font-size: 10px;
  }
`;

export const ContentMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 0 0.6rem;
  gap: 0.3rem;
`;

export const ContentInputMessage = styled.div`
  position: relative;
`;

export const InputMessage = styled.input<ColorDynamicProps>`
  width: 100%;
  border-radius: 20px;
  padding: 0.5rem;
  border: none;
  background-color: ${({ backgroundColorElement }) => backgroundColorElement};
  color: ${({ colorElement }) => colorElement};

  font-size: 11px;

  ::placeholder {
    font-size: 11px;
    color: ${({ colorElement }) => colorElement};
  }
`;

export const ContentIconMessage = styled.div`
  position: absolute;
  top: 3px;
  right: 10px;
  font-size: 22px;
  color: #dc143c;
  cursor: pointer;
`;

export const ContentButtonsMessage = styled.div`
  display: flex;
  gap: 0.2rem;
`;

export const ButtonsMessage = styled.div<ColorDynamicProps>`
  background-color: ${({ backgroundColorElement }) => backgroundColorElement};
  padding: 0.5rem 0.8rem;
  border-radius: 360px;
  font-size: 12px;
  cursor: pointer;
  color: ${({ colorElement }) => colorElement};

  svg {
    margin-top: 0.2rem;
  }
`;
