import styled from "styled-components";

export const GeneralContent = styled.div`
  padding-bottom: 50px;
`;

export const ButtonReleaseRacer = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  margin: 1rem 0;
  background-color: #001529;
  color: #FFFFFF;
  border-radius: 0.2rem;
  border: none;
`;

export const ButtonCancelRacer = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  margin: 1rem 0;
  background-color: #FF4D4F;
  color: #FFFFFF;
  border-radius: 0.2rem;
  border: none;
`;

export const RouteTripContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;

  @media (max-width: 800px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Information = styled.p`
  margin-bottom: 0;

  @media (max-width: 800px) {
    width: 100%;
  }
`;

export const InformationContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  margin: 0.5rem 0;
  @media (max-width: 800px) {
    width: 100%;
    justify-content: space-between;
  }
`;

export const DisplacementInformationContent = styled(InformationContent)`
  margin: 0;
  gap: 2rem;
  
  @media (max-width: 800px) {
    gap: 1rem;
  }
`;

export const SectionInformation = styled.div`
  width: 100%;
  @media (max-width: 800px) {
    width: 50%;
  }
`;

export const Hour = styled.p`
  background-color: #EDEDED;
  margin-bottom: 0;
  padding: 0.5rem;
`;

export const Content = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  background-color: #FFFFFF;
  border-radius: 6px;

  @media (max-width: 800px) {
    flex-direction: column-reverse;
  }
`;

export const TrajetContent = styled.div`
  padding-right: 5px;
  padding-left: 5px;
  padding-bottom: 10px;
  border-bottom: 1px solid #D3D3D3;
  margin-bottom: 10px;
`;
export const Span = styled.span`
  color: #000000;
  opacity: 0.4;
`;
export const TextArea = styled.textarea`
  min-height: 100px;
  max-height: 150px;
  width: 100%;
  padding: 0.5rem;
  border-radius: 5px;
  margin: 5px 0;
  background-color: #CCCCCC;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  width: max-content;
`;

export const SectionContent = styled.div`
  width: 50%;
  padding: 10px;

  @media (max-width: 800px) {
    width: 100%;
  }
`;

export const FoorterMapContent = styled.div``;

export const Title = styled.p`
  margin-bottom: 0;
  font-weight: bold;
  font-size: 12px;
`;

export const FooterMapInformation = styled.p`
  margin-bottom: 0;
  color: #8C8C8C;
`;

export const Marker = styled.div`
  background-size: cover;
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;

export const Button = styled.button`
  background-color: #27283C;
  padding: 6px 12px;
  color: #F1F1F1;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  margin: 1rem 0;

  :hover {
    transition: all ease 0.3s;
    background-color: #191B46;
  }
`;

export const TextBalanceDriver = styled.span`
  font-weight: bold;
  font-size: 14px;
`;

export const ContainerCancel = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const RadioButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

export const DisplacementInfoContainer = styled.div`
  margin: 0.5rem 0;
  background-color: #FFFFFF;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: #003366;
  }
`;

export const DisplacementSection = styled.div`
  margin: 0;
  padding: 0.75rem;
  background-color: #F5F5F5;
  border-bottom: 1px solid #E8E8E8;
`;

export const ComparisonTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  background-color: #FFFFFF;
  
  th, td {
    padding: 0.5rem 0.75rem;
    text-align: left;
    border-bottom: 1px solid #E8E8E8;
  }
  
  th {
    background-color: #FAFAFA;
    font-weight: 600;
    font-size: 11px;
    color: #333333;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  td {
    color: #666666;
    font-size: 12px;
    vertical-align: middle;
  }
  
  tbody tr:hover {
    background-color: #F9F9F9;
  }
  
  tbody tr:last-child td {
    border-bottom: none;
  }
  
  tbody tr:first-child td {
    font-weight: 500;
    color: #333333;
  }
`;

export const DisplacementTitle = styled(Title)`
  margin-bottom: 0.5rem;
  font-size: 13px;
  color: #333333;
  font-weight: 600;
`;
