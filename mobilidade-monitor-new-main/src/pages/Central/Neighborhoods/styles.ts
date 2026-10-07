import styled from "styled-components";

export const Container = styled.div`
  margin: 0.5rem;
`;

export const ContentSearch = styled.div`
  width: 100%;
  display: flex;
`;

export const ContentNeighborhoods = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ContentPlaces = styled.div`
  width: 35%;
  max-height: 400px;
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 7px !important;
  }

  ::-webkit-scrollbar-thumb {
    background: #d3d3d3 !important;
    border-radius: 5px !important;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const PlaceCard = styled.div`
  border: 1px solid #d9d9d9;
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 0.5rem;
  background: #fff;
  transition: all 0.3s ease;

  &:hover {
    border-color: #1890ff;
    background: #f0f8ff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const PlaceName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 0.25rem;
  word-wrap: break-word;
  line-height: 1.4;
`;

export const PlaceDetails = styled.div`
  font-size: 12px;
  color: #8c8c8c;
  word-wrap: break-word;
  line-height: 1.3;
`;

export const ContentMap = styled.div`
  width: 65%;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const ContentBtnSave = styled.div`
  margin: 1rem 0;
  width: 100%;
`;

export const ContentTable = styled.div`
  overflow: auto;

  td {
    background-color: #ffffff;
  }
`;
