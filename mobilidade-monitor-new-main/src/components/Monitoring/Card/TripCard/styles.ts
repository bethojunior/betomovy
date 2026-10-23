import { Button, Image, Progress } from 'antd'
import { AiOutlineAlert } from 'react-icons/ai'
import { FiMoreHorizontal } from 'react-icons/fi'
import styled from 'styled-components'
import {
  Adress,
  AdressWrapper,
  CardBody,
  ContainerDestination,
  ContainerDetailsTrip,
  DetailsWrapper,
  FooterContainer,
  FooterContent,
  PanelCollapse,
  SectionAdress,
  TitleAdress,
  TitleDetails,
  ToggleButton,
  ValueDetail
} from '../sharedStyles'

export const CardTripList = styled.div`
  background-color: #fff;
  border-radius: 13px;
  align-self: center;
  box-shadow: 1px 2px 10px #a2a2a2;
  box-sizing: border-box;
`

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: -12px;
  font-weight: bold;
`

export const StatusTrip = styled.div<{ layout?: string }>`
  align-items: center;
  color: black;
  width: 100%;
  padding: 10px 10px;
  border-radius: 5px 5px 0 0;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ layout }) => layout === 'simple' ? '20px' : '0px'};

  &.gradientRed {
    background-image: linear-gradient(to right, #ff3232, #ff7f7f);
  }

  &.gradientYellow {
    background-image: linear-gradient(to right, #d8931b, #f3b641);
  }

  &.gradientGreen {
    background-image: linear-gradient(to right, #007300, #4ca64c);
  }

  &.gradientScheduled {
    background-image: linear-gradient(to right, #024d24, #028a51);
  }

  @media (max-width: 800px) {
    padding: 8px 5px;
  }
`

export const StatusTripTitle = styled.span`
  margin-left: 10px;
  font-size: 17px;
  color: white;
`

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const HeaderTimestamp = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  display: flex;
  gap: 4px;
  white-space: nowrap;
`

export const HeaderTimestampValue = styled.span`
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
`

export const HeaderDate = styled.span`
  font-size: 14px;
  font-weight: 700;
  opacity: 0.95;
  margin-left: auto;
  color: #fff;
  display: flex;
  align-items: center;
  white-space: nowrap;
`

export const IconMoreDetails = styled(FiMoreHorizontal)`
  font-size: 20px;
  color: #fff;
`

export const ButtonAlertTrip = styled(Button)`
  margin-right: 5px;
  &:hover {
    border-color: red;
  }
`

export const IconALert = styled(AiOutlineAlert)`
  color: red;
  font-size: 20px;
`

export const GraphicTrip = styled(Progress)`
  width: 100%;

  .ant-progress-inner {
    background-color: #c3c1c1;
  }

  .ant-progress-outer {
    width: 100%;
  }
`

export const CustomersContainer = styled.div`
  padding: 16px 16px 6px 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  @media (max-width: 800px) {
    flex-direction: column;
    gap: 12px;
  }
`

export const TitleUser = styled.p`
  margin: 0;
  font-size: 14px;
  color: #000;
  font-weight: 400;
`

export const NameUser = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 16px;
  color: #000;
`

export const VersionApp = styled.p`
  font-size: 11px;
  color: #000;
  margin: 0;
  margin-top: 2px;
`

export const TitleGraphic = styled.p`
  margin-bottom: 4px;
  font-size: 14px;
`

export const UsersSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`

export const Users = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const PictureContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 4px;
`

export const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 200px;

  @media (max-width: 800px) {
    min-width: 0;
    width: 100%;
    max-width: 100%;
    align-items: stretch;
    overflow: hidden;
  }
`

export const TripDateContainer = styled.div<{ layout?: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${({ layout }) => layout === 'simple' ? `
    justify-content: center;
    width: 100%;
    margin-bottom: 12px;
  ` : `
    justify-content: flex-end;
  `}
`

export const TripDateText = styled.p`
  font-weight: normal;
  display: flex;
  flex-direction: row;
  gap: 4px;
  flex-wrap: nowrap;
  align-items: center;
  margin: 0;
  font-size: 14px;
  color: #fff;
  white-space: nowrap;
`

export const TripDateValue = styled.span`
  font-weight: bold;
  font-size: 14px;
  color: #fff;
`

export const TripTimeValue = styled.span`
  font-weight: bold;
  font-size: 14px;
  color: #fff;
`

export const BadgeHourRequested = styled.div<{ layout?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e0f7fa;
  color: #007bff;
  border-radius: 16px;
  font-weight: 500;
  border: 1px solid ${({ layout }) => layout === 'simple' ? '#007bff' : '#b3e5fc'};
  ${({ layout }) => layout === 'simple' ? `
    padding: 8px 12px;
    font-size: 14px;
    width: 100%;
    margin-bottom: 12px;
  ` : `
    height: 32px;
    padding: 0 12px;
    font-size: 12px;
    margin: 0;
    width: auto;
    min-width: 180px;
  `}
`

export const BadgeText = styled.p`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
`

export const ContainerCustomer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;

  @media (max-width: 800px) {
    gap: 12px;
  }
`

export const CardAvatar = styled(Image)`
  padding: 10px;
  border-radius: 100%;
`

export const GeneralInformationsTrip = styled.div`
  width: 100%;
`

export const LabelInformationTrip = styled.p`
  margin-bottom: 2px;
  font-size: 14px;
  margin: 0 !important;
`

export const InformationTrip = styled.p`
  margin-bottom: 0;
  font-weight: bold;
  margin-left: 2px;
  font-size: 14px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 320px) {
    font-size: 12px;
  }
`

export const TripInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`

export const AdressContainer = styled.div<{ layout?: string }>`
  margin-top: ${({ layout }) => layout === 'simple' ? '12px' : '20px'};
  margin-bottom: 12px;
  width: 100%;
  border-bottom-color: #d3d3d3;
  border-bottom-width: 2px;
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-style: solid;
`

export const AdressSimple = styled.div`
  display: flex;
  font-size: 17px;
  color: black;

  @media (max-width: 800px) {
    font-size: 15px;
  }
`

export const AdressLabel = styled.p`
  width: 21%;
  white-space: nowrap;
  font-size: 15px;

  @media (max-width: 800px) {
    width: 25%;
  }
`

export const AdressLocation = styled.p`
  font-weight: bold;
  margin-left: 4px;
  white-space: nowrap;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 15px;

  @media (max-width: 800px) {
    font-size: 13px;
  }
`

export const DriversCalledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  padding: 8px 16px 14px;
`

export const DriversCalledSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  width: 100%;
  flex-wrap: wrap;
`

enum DriversCalledBackgrounds {
  'default' = 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
  'not_answered' = 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
  'refused' = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  'calling' = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
}

interface DriversCalledProps {
  status: 'default' | 'not_answered' | 'refused' | 'calling'
}

export const DriversCalled = styled.div<DriversCalledProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 116px;
  max-width: 140px;
  padding: 8px 12px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.25s ease;
  cursor: default;
  user-select: none;
  background: ${({ status }) => (status ? DriversCalledBackgrounds[status] : DriversCalledBackgrounds.default)};
  color: #ffffff;
  border: 1px solid ${({ status }) => (status === 'calling' ? '#15803d' : 'rgba(255, 255, 255, 0.25)')};
  box-shadow: ${({ status }) =>
    status === 'calling'
      ? '0 0 14px rgba(34, 197, 94, 0.45), 0 3px 6px rgba(0, 0, 0, 0.12)'
      : '0 2px 4px rgba(0, 0, 0, 0.08)'};

  ${({ status }) =>
    status === 'calling' &&
    `
    transform: translateY(-2px) scale(1.03);
  `}

  @media (max-width: 360px) {
    min-width: 95px;
    padding: 6px 8px;
  }
`

export const DriversCalledText = styled.p`
  margin: 0;
  width: 100%;
  padding: 0;
  text-align: center;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 360px) {
    font-size: 11.5px;
  }
`

export const DriversCalledSubtext = styled.span`
  margin-top: 3px;
  font-size: 11.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  letter-spacing: 0.2px;

  @media (max-width: 360px) {
    font-size: 10px;
  }
`

export {
  Adress,
  AdressWrapper,
  CardBody,
  ContainerDestination,
  ContainerDetailsTrip,
  DetailsWrapper,
  FooterContainer,
  FooterContent,
  PanelCollapse,
  SectionAdress,
  TitleAdress,
  TitleDetails,
  ToggleButton,
  ValueDetail
}
