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
  background-color: #ffffff;
  border-radius: 16px;
  align-self: center;
  border: 1.5px solid #e2e8f0;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
  box-sizing: border-box;
  overflow: hidden;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
  }
`

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: -12px;
  font-weight: bold;
`

export const StatusTrip = styled.div<{ layout?: string }>`
  align-items: center;
  color: #ffffff;
  width: 100%;
  padding: 10px 14px;
  border-radius: 14px 14px 0 0;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ layout }) => layout === 'simple' ? '16px' : '0px'};

  &.gradientRed {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  }

  &.gradientYellow {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }

  &.gradientGreen {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }

  &.gradientScheduled {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  }

  @media (max-width: 800px) {
    padding: 8px 10px;
  }
`

export const StatusTripTitle = styled.span`
  margin-left: 6px;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.2px;
  color: #ffffff;
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
  'default' = '#aaaaaa',
  'not_answered' = '#8c8c89',
  'refused' = '#ee4839',
  'calling' = '#269900'
}

interface DriversCalledProps {
  status: 'default' | 'not_answered' | 'refused' | 'calling'
}

export const DriversCalled = styled.div<DriversCalledProps>`
  background-color: ${({ status }) => (status ? DriversCalledBackgrounds[status] : '#8c8c89')};
  color: ${({ status }) => (status === 'calling' ? '#fff' : '#000')};
  padding: 2px 4px;
  text-align: center;
  border-radius: 5px;
  width: 100px;
  min-width: 100px;
  height: 60px;
  font-size: 15px;
  box-shadow: #808080 1px 1px 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: default;
  user-select: none;
  box-sizing: border-box;

  @media (max-width: 320px) {
    width: 85px;
    min-width: 85px;
  }
`

export const DriversCalledText = styled.p`
  margin: 0;
  width: 100%;
  padding: 0;
  text-align: center;
  color: inherit;
  font-size: 13.5px;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 320px) {
    font-size: 12px;
  }
`

export const DriversCalledSubtext = styled.span`
  margin-top: 2px;
  font-size: 12px;
  font-weight: 500;
  color: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  line-height: 1.2;

  @media (max-width: 320px) {
    font-size: 10.5px;
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
