import styled from "styled-components";

export const ContainerTariffs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 480px;
  overflow-y: auto;
  padding: 4px 2px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

export const CardTariffs = styled.div`
  width: 100%;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  cursor: pointer;
  background-color: #ffffff;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: #04F3FA;
    background-color: #f0fdfa;
    box-shadow: 0 4px 16px rgba(4, 243, 250, 0.25);
    transform: translateY(-1px);
  }
`;

export const ContentTariffs = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

export const DescriptionTariffs = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const PictureTariff = styled.img`
  width: 56px;
  height: 56px;
  object-fit: contain;
  border-radius: 8px;
  background-color: #f8fafc;
  padding: 4px;
`;

export const TitleTariff = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

export const TextTariff = styled.p`
  font-size: 13px;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
`;

export const GenderTariff = styled.span`
  color: #00349A;
  font-size: 11px;
  font-weight: 600;
  background-color: #e0f2fe;
  padding: 2px 8px;
  border-radius: 12px;
  width: fit-content;
  margin-top: 4px;
`;
