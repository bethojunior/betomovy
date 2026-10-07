import styled from "styled-components";

import { theme_colors } from "../../../../theme/theme";

interface ContentCardAnimationProps {
  selected: boolean;
  selectedPrev: boolean;
}

export const Container = styled.div``;

export const ContainerAnimations = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 2rem;

  @media (max-width: 1050px) {
    flex-direction: column;
    align-items: center;
  }

  @media (max-width: 748px) {
    align-items: start;
  }
`;

export const ContainerCards = styled.div`
  @media (max-width: 864px) {
    width: 100%;
  }
`;

export const ContainerCardsAnimations = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  max-width: 1280px;
  max-height: 600px;
  overflow: auto;

  ::-webkit-scrollbar {
    width: 7px !important;
    height: 10px;
    display: block !important;
  }
  ::-webkit-scrollbar-thumb {
    background: #d3d3d3 !important;
    border-radius: 5px !important;
  }

  @media (max-width: 1317px) {
    max-width: 650px;
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 864px) {
    display: flex;
  }
`;

export const TitleModule = styled.h2`
  font-size: 22px;
`;

export const ContentCardAnimation = styled.div<ContentCardAnimationProps>`
  max-width: 200px;
  width: 100%;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  cursor: ${({ selectedPrev }) => (selectedPrev ? "normal" : "pointer")};
  transform: scale(0.95);
  -webkit-box-shadow: 0px 0px 23px 1px
    ${({ selected }) =>
      selected ? " rgba(22, 119, 255, 0.25)" : "rgba(0, 0, 0, 0.25)"};
  -moz-box-shadow: 0px 0px 23px 1px
    ${({ selected }) =>
      selected ? " rgba(22, 119, 255, 0.25)" : "rgba(0, 0, 0, 0.25)"};
  box-shadow: 0px 0px 23px 1px
    ${({ selected }) =>
      selected ? " rgba(22, 119, 255, 0.25)" : "rgba(0, 0, 0, 0.25)"};
  background-color: #e6ecf1;
  border: ${({ selected }) =>
    selected ? `1px solid ${theme_colors.primary_antd}` : "none"};
  opacity: ${({ selectedPrev }) => (selectedPrev ? 0.3 : 1)};

  :hover {
    transition: all ease 0.3s;
    transform: scale(1);
  }

  @media (max-width: 1990px) {
    max-width: 200px;
    min-height: 200px;
  }
`;

export const ContentMoldurePhone = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  > img {
    width: 250px;
    height: 500px;
  }

  @media (max-width: 768px) {
    align-self: center;
  }
`;

export const ContentAnimationsDevice = styled.div`
  width: 220px;
  height: 457px;
  position: absolute;
  top: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0 0 20px 20px;
`;

export const ContainerButton = styled.div`
  max-width: 1250px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
  gap: 1rem;
`;

export const ContentButton = styled.div`
  max-width: 250px;
  width: 100%;
`;

export const ContentLayoutDevice = styled.div`
  width: 220px;
  height: 473px;
  position: absolute;
  top: 8.2%;
  align-items: center;
  border-radius: 20px;

  > img {
    width: 100%;
    height: 473px;
    border-radius: 20px;
  }

  @media (max-width: 888px) {
    top: 10%;
  }
`;
