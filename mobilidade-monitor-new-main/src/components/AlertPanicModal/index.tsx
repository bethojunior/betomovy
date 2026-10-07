import { Modal, Button } from "antd";
import { PanicNotificationType } from "../Notification/CitiesAndNotifications/types";

interface AlertPanicModalProps {
  open: boolean;
  onConfirm: () => void;
  notification: PanicNotificationType | undefined;
  loadingButton?: boolean;
}

export const AlertPanicModal = ({
  open,
  onConfirm,
  notification,
  loadingButton = false,
}: AlertPanicModalProps) => {
  return (
    <Modal
      title="Alerta de Pânico"
      open={open}
      styles={{
        mask: { backgroundColor: "rgba(255, 0, 0, 0.45)" },
      }}
      footer={[
        <Button
          key="confirm"
          type="primary"
          onClick={onConfirm}
          loading={loadingButton}
          disabled={loadingButton}
        >
          Marcar como lido
        </Button>,
      ]}
      closable={false}
    >
      <div style={{ position: "relative", paddingTop: "56.25%" }}>
        <video
          src={notification?.picture}
          controls
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: 8,
            objectFit: "cover",
          }}
        />
      </div>

      <h3 style={{ marginBottom: 8 }}>Situação de emergência detectada</h3>
      <p>{notification?.message}</p>
      <a
        href={`${window.location.origin}/driver/monitoring/${notification?.driver?.idDriver}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Abrir monitoramento do motorista
      </a>
    </Modal>
  );
};
