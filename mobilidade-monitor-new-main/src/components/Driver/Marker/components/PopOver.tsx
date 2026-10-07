import { Constants } from "@/utils/constants";
import { breadCrumble } from "@/utils/translation/breadCrumble";
import { CalendarOutlined, CarOutlined, IdcardOutlined, SendOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import { useState } from "react";
import swal from "sweetalert";
import api from "../../../../services/api";
import NotificationModal from "../../../Monitoring/NotificationModal";
import {
  DriverAvatarWrapper,
  DriverImage,
  DriverName,
  DriverPopoverContent,
  NotifyButton,
  PopoverTrigger,
  VehicleInfoList,
  VehicleInfoRow,
  popoverOverlayStyle,
} from "./styles";

export const DriverPopover = ({ driver, driverDetails, children }: any) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [sendingNotification, setSendingNotification] = useState(false);

  const hasVehicleInfo =
    driverDetails && (driverDetails.model || driverDetails.year || driverDetails.plate);

  const driverImageSrc = driver?.profileImage
    ? Constants.url_photo_driver + driver.profileImage
    : Constants.defaultImgNotFound;

  const handleSendNotification = async (title: string, message: string) => {
    if (!driver?.userId) {
      swal({
        title: breadCrumble('error.title'),
        text: `${breadCrumble('error.user_id_not_found')} ${breadCrumble('common.driver').toLowerCase()}`,
        icon: 'error'
      });
      return;
    }

    setSendingNotification(true);
    try {
      const loggedUser = JSON.parse(localStorage.getItem('@App:user') || '{}');

      await api.post('/notification/', {
        action: 'message',
        link: '',
        message,
        notificationTypeId: 2,
        title,
        userIdAdministrator: loggedUser?.idUser || Constants.DEFAULT_ADMIN_USER_ID,
        userTypeId: '4',
        usersId: [driver.userId]
      });

      swal({
        title: breadCrumble('success.notification_sent'),
        icon: 'success'
      });
      setNotificationModalVisible(false);
    } catch (error: any) {
      swal({
        title: breadCrumble('error.notification_failed'),
        text: error.response?.data?.message || breadCrumble('error.unknown'),
        icon: 'error'
      });
    } finally {
      setSendingNotification(false);
    }
  };

  return (
    <>
      <Popover
        content={
          <DriverPopoverContent>
            <DriverAvatarWrapper>
              <DriverImage
                src={driverImageSrc}
                onError={(e) => {
                  e.currentTarget.src = Constants.defaultImgNotFound;
                }}
              />
            </DriverAvatarWrapper>
            <DriverName>{driver.userName || driver.name || 'Nome não informado'}</DriverName>
            {hasVehicleInfo && (
              <VehicleInfoList>
                {driverDetails.model && (
                  <VehicleInfoRow>
                    <span>
                      <CarOutlined /> Modelo
                    </span>
                    <span>{driverDetails.model}</span>
                  </VehicleInfoRow>
                )}
                {driverDetails.year && (
                  <VehicleInfoRow>
                    <span>
                      <CalendarOutlined /> Ano
                    </span>
                    <span>{driverDetails.year}</span>
                  </VehicleInfoRow>
                )}
                {driverDetails.plate && (
                  <VehicleInfoRow>
                    <span>
                      <IdcardOutlined /> Placa
                    </span>
                    <span>{driverDetails.plate}</span>
                  </VehicleInfoRow>
                )}
              </VehicleInfoList>
            )}
            <NotifyButton
              type="primary"
              icon={<SendOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                setPopoverOpen(false);
                setNotificationModalVisible(true);
              }}
            >
              Enviar notificação
            </NotifyButton>
          </DriverPopoverContent>
        }
        trigger="hover"
        placement="top"
        mouseEnterDelay={0.3}
        mouseLeaveDelay={0.1}
        overlayStyle={popoverOverlayStyle}
        open={popoverOpen}
        onOpenChange={(open) => {
          if (notificationModalVisible) return;
          setPopoverOpen(open);
        }}
      >
        <PopoverTrigger>
          {children}
        </PopoverTrigger>
      </Popover>

      <NotificationModal
        visible={notificationModalVisible}
        target="driver"
        targetName={driver.userName || driver.name || 'Motorista'}
        targetPhoto={driver?.profileImage}
        onCancel={() => setNotificationModalVisible(false)}
        onSend={handleSendNotification}
        loading={sendingNotification}
      />
    </>
  );
};
