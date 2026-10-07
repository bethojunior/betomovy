import { getDriverPhotoUrl } from "@/utils/imageUtils";
import { Popover, Skeleton, Tooltip } from "antd";
import { FC, useMemo, useState } from "react";
import { FiMapPin, FiPhone, FiUser } from "react-icons/fi";
import { IoLogoWhatsapp } from "react-icons/io";
import DriverProfile from "../../../Driver/Modal/Profile";
import {
  Content,
  DriverButton,
  DriverCalled,
  DriverCalledContent,
  DriverEmptyState,
  DriverEmptyTitle,
  DriverWhatsappButton,
  NotifiedDriverInfoLabel,
  NotifiedDriverInfoRow,
  NotifiedDriverName,
  NotifiedDriverPopoverContent,
  NotifiedDriverWhatsappButton,
  TripDriver,
  TripDriverContent,
  TripDriverName,
  TripDriverType,
  TitleDriver,
} from "./styles";
import { TripDetailsProps } from "./types";
import { Constants } from "../../../../utils/constants";
import {
  generateWhatsAppUrl,
  isValidBrazilianPhone,
} from "@/utils/whatsappUtils";

interface HeaderProps {
  data: TripDetailsProps;
  loading?: boolean;
}

const Header: FC<HeaderProps> = ({ data, loading = false }) => {
  const [profileIsShow, setProfileIsShow] = useState(false);
  const hasDriver = Boolean(data?.driverId);
  const formattedDate = useMemo(() => {
    if (!data?.date) return "Data não disponível";
    const parsed = new Date(String(data.date));
    return !isNaN(parsed.getTime())
      ? parsed.toLocaleDateString()
      : "Data não disponível";
  }, [data?.date]);

  if (loading) {
    return (
      <Content>
        <div style={{ padding: 10 }}>
          <Skeleton active={true} />
          <Skeleton active={true} />
        </div>
      </Content>
    );
  }

  return (
    <>
      <DriverProfile
        driverId={data?.driverId || 0}
        visibility={profileIsShow && hasDriver}
        handleCloseModal={() => setProfileIsShow(false)}
      />
      <Content>
        <div>
          <div
            style={{
              display: "flex",
              marginBottom: "15px",
              alignItems: "center",
            }}
          >
            <TitleDriver>MOTORISTA DA VIAGEM</TitleDriver>
            {hasDriver && (
              <DriverWhatsappButton
                type="text"
                target="_blank"
                href={`https://api.whatsapp.com/send?phone=55${data?.driverPhone}&text=Olá motorista`}
              >
                <IoLogoWhatsapp size={30} color="#25D366" />
              </DriverWhatsappButton>
            )}
          </div>
          {hasDriver ? (
            <div style={{ display: "flex" }}>
              <Tooltip
                placement="bottom"
                title="clique para ver o perfil do motorista"
              >
                <DriverButton
                  type="text"
                  size="small"
                  onClick={() => setProfileIsShow(true)}
                >
                  <TripDriver
                    src={
                      getDriverPhotoUrl(data?.driverPhoto) ||
                      Constants.defaultImgNotFound
                    }
                    alt="Foto do motorista da viagem"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = Constants.defaultImgNotFound;
                    }}
                  />
                </DriverButton>
              </Tooltip>
              <TripDriverContent>
                <TripDriverName>{data?.driverName}</TripDriverName>
                <TripDriverType>{data?.driverType || "--"}</TripDriverType>
                <TripDriverType style={{ marginTop: -5 }}>
                  {formattedDate}
                </TripDriverType>
              </TripDriverContent>
            </div>
          ) : (
            <DriverEmptyState>
              <DriverEmptyTitle>
                Nenhum motorista aceitou esta viagem.
              </DriverEmptyTitle>
              <p>{formattedDate}</p>
            </DriverEmptyState>
          )}
        </div>
        <DriverCalledContent>
          <div>
            <TitleDriver>MOTORISTAS NOTIFICADOS</TitleDriver>
            {data?.driver_called?.map((item) => {
              const driverPhone = item.driver?.user?.phone;
              return (
                <Popover
                  key={item.id}
                  trigger="hover"
                  placement="top"
                  mouseEnterDelay={0.3}
                  mouseLeaveDelay={0.1}
                  content={
                    <NotifiedDriverPopoverContent>
                      <NotifiedDriverInfoRow>
                        <FiUser size={14} />
                        <NotifiedDriverName>
                          {item.driver?.user?.name || "Nome não informado"}
                        </NotifiedDriverName>
                      </NotifiedDriverInfoRow>
                      <NotifiedDriverInfoRow>
                        <FiPhone size={14} />
                        <NotifiedDriverInfoLabel>
                          Telefone:
                        </NotifiedDriverInfoLabel>
                        {driverPhone || "--"}
                      </NotifiedDriverInfoRow>
                      <NotifiedDriverInfoRow>
                        <FiMapPin size={14} />
                        <NotifiedDriverInfoLabel>
                          Distância na chamada:
                        </NotifiedDriverInfoLabel>
                        {item.proximity != null
                          ? `${item.proximity.toFixed(2)}km`
                          : "--"}
                      </NotifiedDriverInfoRow>
                      {isValidBrazilianPhone(driverPhone) && (
                        <NotifiedDriverWhatsappButton
                          type="text"
                          size="small"
                          target="_blank"
                          href={generateWhatsAppUrl(
                            driverPhone,
                            "Olá, motorista"
                          )}
                        >
                          <IoLogoWhatsapp size={16} color="#25D366" />
                          Conversar no WhatsApp
                        </NotifiedDriverWhatsappButton>
                      )}
                    </NotifiedDriverPopoverContent>
                  }
                >
                  <span style={{ display: "inline-block" }}>
                    <DriverButton
                      type="text"
                      size="small"
                      disabled
                      style={{ cursor: "inherit" }}
                    >
                      <DriverCalled
                        alt="Foto do motorista"
                        src={
                          getDriverPhotoUrl(item.driver?.profileImage) ||
                          Constants.defaultImgNotFound
                        }
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = Constants.defaultImgNotFound;
                        }}
                      />
                    </DriverButton>
                  </span>
                </Popover>
              );
            })}
          </div>
        </DriverCalledContent>
      </Content>
    </>
  );
};

export default Header;
