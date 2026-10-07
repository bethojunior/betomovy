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

export const ButtonIcon = styled.button<ColorDynamicProps>`
  width: 45px;
  height: 45px;
  background-color: ${({ backgroundColorElement }) => backgroundColorElement};
  border: none;
  border-radius: 360px;
  font-size: 24px;
  padding-top: 0.5rem;
  color: ${({ colorElement }) => colorElement};
  cursor: pointer;
`;

export const ContentKm = styled.div<ColorDynamicProps>`
  background-color: ${({ backgroundColorElement }) => backgroundColorElement};
  color: ${({ colorElement }) => colorElement};
  position: absolute;
  top: 10px;
  left: 40%;
  font-size: 12px;
  text-align: center;
  border-radius: 10px;
  padding: 0.3rem 0.8rem;
`;

export const ContentAddress = styled.div<ColorDynamicProps>`
  width: 200px;
  display: flex;
  align-items: center;
  background-color: ${({ backgroundColorElement }) => backgroundColorElement};
  position: absolute;
  top: 26%;
  left: 65px;

  font-size: 12px;
  border-radius: 5px;

  > div:nth-child(1) {
    padding: 0.3rem 0.8rem;
    background-color: ${({ backgroundColorElement }) => backgroundColorElement};
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
    border-radius: 5px 0px 0px 5px;
  }

  > div:nth-child(2) {
    padding: 0.3rem;
  }

  > div:nth-child(3) {
    font-size: 22px;
  }
`;

export const CardSelectTravel = styled.div<ColorDynamicProps>`
  position: absolute;
  bottom: 0;
  background-color: ${({ backgroundColorElement }) => backgroundColorElement};
  width: 100%;
  height: 270px;
  z-index: 10000;
  border-radius: 0px 0px 20px 30px;
  padding: 0.2rem 0.6rem;
  -webkit-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.75);
`;

export const HeaderCardSelectTravel = styled.div<ColorDynamicProps>`
  font-size: 12px;
  text-align: center;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #80808063;
  font-weight: bold;
  color: ${({ colorElement }) => colorElement};
`;

export const ContentOptionsTravels = styled.div<ColorDynamicProps>`
  overflow: auto;
  height: 125px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-bottom: 1px solid #80808063;
  color: ${({ colorElement }) => colorElement};
`;

export const OptionsTravels = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  > div {
    font-size: 14px;
    font-weight: bold;

    img {
      margin-right: 0.5rem;
      width: 50px;
      height: 50px;
    }
  }

  > div:nth-child(2) {
    font-size: 14px;
    font-weight: bold;
  }
`;

export const ContentSelectTravel = styled.div``;

export const SelectTravel = styled.div<ColorDynamicProps>`
  width: 150px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-right: 1px solid #80808063;
  font-weight: bold;
  cursor: pointer;
  color: ${({ colorElement }) => colorElement};

  > div {
    font-size: 18px;
  }
`;

export const ContentControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.4rem;
  border-top: 1px solid #80808063;
  padding: 0.5rem;
`;

export const ButtonControl = styled.button<ColorDynamicProps>`
  width: 200px;
  font-size: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.1rem;
  -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  border: none;
  border-radius: 5px;
  color: ${({ colorElement }) => colorElement};
  background-color: ${({ backgroundColorElement }) => backgroundColorElement};

  > div {
    font-size: 14px;
  }
`;

export const ButtonConfirmTravel = styled.button<ColorDynamicProps>`
  padding: 0.5rem 0.8rem;
  border-radius: 5px;
  border: none;
  -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  font-size: 14px;
  background-color: ${({ backgroundColorElement }) => backgroundColorElement};
  color: ${({ colorElement }) => colorElement};
`;
