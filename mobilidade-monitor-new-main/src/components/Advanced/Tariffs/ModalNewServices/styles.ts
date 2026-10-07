import styled from "styled-components";

export const ContainerTariffs = styled.div`
  height: 400px;
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
`;

export const CardTariffs = styled.div`
  width: 100%;
  border: 1px solid gray;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
`;

export const ContentTariffs = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

export const DescriptionTariffs = styled.div``;

export const PictureTariff = styled.img`
  width: 100px;
`;

export const TitleTariff = styled.h3``;

export const TextTariff = styled.p``;

export const GenderTariff = styled.span`
  color: gray;
  font-size: 13px;
`;
