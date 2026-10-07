import { useState } from "react";
import { Dropdown } from "antd";
import { FiSettings } from "react-icons/fi";

import {
  Card,
  HeaderRow,
  HeaderTitle,
  SettingsButton,
  TopRow,
  CardBody,
} from "./styles";

import { CardDriverProps } from "./types";
import { DriverProfile } from "./DriverProfile";
import { DriverInfo } from "./DriverInfo";
import { DriverSummary } from "./DriverSummary";
import { BillingMode } from "./BillingMode";
import { ProductionLinks } from "./ProductionLinks";
import Alert from "../../Utils/Alert";

export const CardDriver = ({
  datas,
  message,
  setLoading,
  menu,
  baseImageLink,
  enableZafiraValidationMonitor,
}: CardDriverProps) => {
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");

  const showAlertMessage = (
    text: string,
    type: "success" | "info" | "warning" | "error"
  ) => {
    setMessageAlert(text);
    setTypeAlert(type);
    setShowAlert(true);
  };

  return (
    <Card>
      <Alert
        visibility={showAlert}
        setVisibility={setShowAlert}
        message={messageAlert}
        typeAlert={typeAlert}
      />

      <HeaderRow>
        <HeaderTitle>{datas.userType}</HeaderTitle>
        <Dropdown overlay={menu(datas)} placement="bottomRight">
          <SettingsButton icon={<FiSettings size={16} />}>
            Configurações
          </SettingsButton>
        </Dropdown>
      </HeaderRow>

      <TopRow>
        <DriverProfile
          profileImage={datas.profileImage}
          baseImageLink={baseImageLink}
          nickname={datas.nickname}
          idDriver={datas.idDriver}
          phone={datas.phone}
          email={datas.email}
          message={message}
        />
        <DriverInfo
          name={datas.name}
          document={datas.document}
          phone={datas.phone}
          email={datas.email}
          city={datas.city}
          registerStatus={datas.registerStatus}
          created_at={datas.created_at}
          carModel={datas.carModel}
          carBrand={datas.carBrand}
          carPlate={datas.carPlate}
          carColor={datas.carColor}
          carYear={datas.carYear}
          enableZafiraValidationMonitor={enableZafiraValidationMonitor}
          zafiraValidated={datas.zafiraValidated}
        />
        <DriverSummary
          rating={datas.rating}
          blockedBalance={datas.blockedBalance}
          balance={datas.balance}
          maximumAmountNegativeBalanceDriver={
            datas.maximumAmountNegativeBalanceDriver
          }
          appVersion={datas.appVersion}
          platform={datas.platform}
          hours_worked={datas.hours_worked}
          hours_open={datas.hours_open}
        />
        <BillingMode
          idDriver={datas.idDriver}
          prepaid={datas.prepaid}
          setLoading={setLoading}
          onAlert={showAlertMessage}
        />
      </TopRow>

      <CardBody>
        <ProductionLinks
          idDriver={datas.idDriver}
          name={datas.name}
          setLoading={setLoading}
        />
      </CardBody>
    </Card>
  );
};
