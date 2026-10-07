import { FC } from "react";
import { Dropdown } from "antd";
import { FiSettings } from "react-icons/fi";

import {
  Card,
  HeaderRow,
  SettingsButton,
} from "../../../Utils/EntityCard/styles";
import { CompactHeaderTitle, ClientTopRow } from "./styles";
import { ClientProfile } from "./ClientProfile";
import { ClientInfo } from "./ClientInfo";
import { ClientSummary } from "./ClientSummary";

interface ListClient {
  appVersion: string;
  balanceId: number;
  document: string;
  city: string;
  cityId: number;
  comission: number;
  created_at: string;
  dateOfBirth: number;
  email: string;
  gender: string;
  idCustomer: number;
  idUser: number;
  latitude: number;
  longitude: number;
  militaryForce: string;
  militaryStatus: string;
  name: string;
  nickname: string;
  observation: string;
  om: string;
  patent: string;
  patentPicture: string;
  phone: string;
  platform: string;
  profileImage: string;
  quantityTripsFinished: number;
  rg: number;
  rgBackPicture: string;
  rgFrontPicture: string;
  status: string;
  voucherBalance: number;
  quantityTripsCancelled: number | null;
  zafiraValidated?: number;
}

interface ClientListComponents {
  item: ListClient;
  menu: (item: ListClient) => JSX.Element;
  message: string;
  baseImageLink: string;
  enableZafiraValidationMonitor?: boolean;
}

const ListCLientComponent: FC<ClientListComponents> = ({
  item,
  menu,
  message,
  baseImageLink,
  enableZafiraValidationMonitor,
}) => {
  return (
    <Card>
      <HeaderRow>
        <CompactHeaderTitle>CLIENTE PESSOA FÍSICA</CompactHeaderTitle>
        <Dropdown overlay={menu(item)} placement="bottomRight">
          <SettingsButton
            type="text"
            id={String(item.idCustomer)}
            onClick={(e) => e.preventDefault()}
            icon={<FiSettings size={16} />}
          >
            Configurações
          </SettingsButton>
        </Dropdown>
      </HeaderRow>

      <ClientTopRow>
        <ClientProfile
          profileImage={item.profileImage}
          baseImageLink={baseImageLink}
          phone={item.phone}
          email={item.email}
          message={message}
        />
        <ClientInfo
          name={item.name}
          document={item.document}
          rg={item.rg}
          phone={item.phone}
          email={item.email}
          dateOfBirth={item.dateOfBirth}
          status={item.status}
          created_at={item.created_at}
          city={item.city}
          enableZafiraValidationMonitor={enableZafiraValidationMonitor}
          zafiraValidated={item.zafiraValidated}
        />
        <ClientSummary
          platform={item.platform}
          appVersion={item.appVersion}
          quantityTripsFinished={item.quantityTripsFinished}
          quantityTripsCancelled={item.quantityTripsCancelled}
          voucherBalance={item.voucherBalance}
          comission={item.comission}
        />
      </ClientTopRow>
    </Card>
  );
};

export default ListCLientComponent;
