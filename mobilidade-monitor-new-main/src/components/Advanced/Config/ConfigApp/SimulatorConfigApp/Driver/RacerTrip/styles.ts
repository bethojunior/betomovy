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
  top: 0.7rem;
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

export const CardTrip = styled.div<ColorDynamicProps>`
  position: absolute;
  bottom: 0;
  background-color: ${({ backgroundColorElement }) => backgroundColorElement};
  width: 100%;
  height: 400px;
  z-index: 10000;
  border-radius: 5px 5px 29px 29px;
  padding: 0.2rem 0.6rem;
  -webkit-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.75);
`;

export const HeaderCardTrip = styled.div<ColorDynamicProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > h3 {
    color: ${({ colorElement }) => colorElement};
    font-weight: bold;
  }

  > button {
    background: none;
    border: none;
    font-size: 23px;
    color: #dc143c;
    cursor: pointer;
  }
`;

export const ContentClient = styled.div<ColorDynamicProps>`
  display: flex;
  align-items: center;
  gap: 1rem;

  color: ${({ colorElement }) => colorElement};

  > div:nth-child(2) {
    display: flex;
    flex-direction: column;

    > span {
      display: flex;
      align-items: center;
      gap: 0.2rem;
    }
  }
`;

export const ContentPrices = styled.div<ColorDynamicProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.5rem 0;
  color: ${({ colorElement }) => colorElement};

  > div {
    > div {
      margin-bottom: 0.3rem;
      h3 {
        font-size: 14px;
        font-weight: bold;
        color: ${({ colorElement }) => colorElement};
      }
    }
  }
`;

export const CardPrice = styled.div<ColorDynamicProps>`
  padding: 0.5rem 1rem;
  font-size: 20px;
  font-weight: bold;
  background-color: ${({ backgroundColorElement }) => backgroundColorElement};
  color: ${({ colorElement }) => colorElement};
  border-radius: 5px;
  font-size: 16px;
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
  font-size: 16px;
`;

export const ContentButtonAccept = styled.div`
  text-align: center;
  margin-top: 0.2rem;
`;

export const ButtonAccept = styled.button<ColorDynamicProps>`
  width: 100%;
  background-color: ${({ backgroundColorElement }) => backgroundColorElement};
  border-radius: 5px;
  color: ${({ colorElement }) => colorElement};
  padding: 0.3rem 0.8rem;
  border: none;
  margin-top: 0.2rem;
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
