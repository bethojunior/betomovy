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
  }
`;

export const ContentAvatar = styled.div<ColorDynamicProps>`
  img {
    width: 60px;
    height: 60px;
    border: 2px solid ${({ colorElement }) => colorElement};
    border-radius: 360px;
  }
`;

export const ContentBalance = styled.div<ColorDynamicProps>`
  position: absolute;
  top: 1.5rem;
  right: 1rem;
  background-color: ${({ backgroundColorElement }) => backgroundColorElement};
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 45px;
  font-size: 25px;
  border-radius: 40px;
  color: ${({ colorElement }) => colorElement};
  border: 2px solid ${({ colorElement }) => colorElement};
  cursor: pointer;
`;

export const Column1 = styled.div`
  position: absolute;
  top: 6rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Column2 = styled.div`
  position: absolute;
  top: 6rem;
  right: 1rem;
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

export const ContentCardCallAnswer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CardCallAnswer = styled.div<ColorDynamicProps>`
  position: absolute;
  bottom: 0;
  width: 95%;
  height: 250px;
  z-index: 100;
  border-radius: 5px 5px 20px 20px;
  padding: 0.2rem 0.6rem;
  background-color: ${({ backgroundColorElement }) => backgroundColorElement};
  -webkit-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.75);
`;

export const ContentButtonMinimizeCard = styled.div`
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  top: -1rem;
`;

export const ButtonMinimizeCard = styled.button<ColorDynamicProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ backgroundColorElement }) => backgroundColorElement};
  color: ${({ colorElement }) => colorElement};
  font-size: 20px;
  width: 30px;
  height: 30px;
  border-radius: 360px;
  border: none;
  -webkit-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.75);
`;

export const ContentClient = styled.div`
  position: absolute;
  top: -40px;
  display: flex;
  flex-direction: column;
  align-items: center;

  > span {
    font-size: 16px;
  }

  img {
    width: 60px;
    height: 60px;
    border: none;
    border-radius: 360px;
  }
`;

export const ContentMessageAndClose = styled.div<ColorDynamicProps>`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 1rem;

  > div {
    font-size: 24px;
    color: ${({ backgroundColorElement }) => backgroundColorElement};
    cursor: pointer;
  }
`;

export const ContentFinancial = styled.div<ColorDynamicProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2.5rem;

  > div {
    span {
      font-size: 14px;
      color: ${({ colorElement }) => colorElement};
    }
    h3 {
      font-size: 16px;
      font-weight: bold;
      color: ${({ colorElement }) => colorElement};
    }
  }
`;

export const ContentAddresses = styled.div<ColorDynamicProps>`
  position: relative;
  border-left: 1px dashed #000000;
  padding-left: 1rem;
  color: ${({ colorElement }) => colorElement};
`;

export const Address = styled.span`
  font-size: 12px;
  display: inline-block;
`;

export const DistanceAddress = styled.span`
  display: inline-block;
  font-weight: bold;
  font-size: 14px;
`;

export const Squad = styled.div<ColorDynamicProps>`
  position: absolute;
  top: 0;
  width: 15px;
  height: 15px;
  background-color: ${({ backgroundColorElement }) => backgroundColorElement};
  left: -8px;
`;

export const Ball = styled.div<ColorDynamicProps>`
  position: absolute;
  width: 15px;
  height: 15px;
  background-color: ${({ backgroundColorElement }) => backgroundColorElement};
  border-radius: 360px;
  bottom: 0;
  left: -8px;
`;

export const ContentButtonAccept = styled.div`
  text-align: center;
  margin-top: 0.2rem;
`;

export const ButtonAccept = styled.button<ColorDynamicProps>`
  position: relative;
  width: 100%;
  background-color: ${({ backgroundColorElement }) => backgroundColorElement};
  border-radius: 20px;
  color: ${({ colorElement }) => colorElement};
  padding: 0.5rem 0.8rem;
  border: none;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

export const ContentIconButton = styled.div`
  position: absolute;
  top: 0.1rem;
  left: 0.6rem;
  font-size: 30px;
  animation-name: important1;
  animation: 1s linear 0s infinite alternate animationIcon;

  @keyframes animationIcon {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(1.2);
    }
  }
`;
