import { FC, ReactNode, useState } from "react";
import { FiCheck, FiUser, FiBell, FiNavigation, FiInfo, FiSmartphone } from "react-icons/fi";
import {
  Content,
  AvatarWrap,
  Image,
  ButtonIcon,
  Video,
  NotificationTitle,
  NotificationMessage,
  NotificationFooter,
  NotificationDate,
  CityBadge,
  UnreadBadge,
} from "./styles";
import { getDriverPhotoUrl } from "../../../utils/imageUtils";

type NotificationData = {
  read: number;
  id: number;
  title: string;
  message: string;
  created_at: string;
  user?: {
    profileImage?: string;
    phone?: string;
    name?: string;
    email?: string;
    idUser?: number;
  };
  picture?: null | string;
  adminNotificationTypeId?: number;
  notificationCityName?: string;
  city?: {
    nome?: string;
    id?: number;
  };
};

interface ModalProps {
  item: NotificationData;
  readNotification: (id: number) => Promise<void>;
  extraLink?: ReactNode;
}

const getNotificationMeta = (item: NotificationData) => {
  const title = (item.title || "").toLowerCase();
  const typeId = item.adminNotificationTypeId;

  if (typeId === 14 || typeId === 13 || title.includes("motorista") || title.includes("driver")) {
    if (title.includes("app") || title.includes("configura")) {
      return {
        icon: <FiSmartphone />,
        bg: "#EFF6FF",
        color: "#2563EB",
      };
    }
    return {
      icon: <FiUser />,
      bg: "#EEF2FF",
      color: "#4F46E5",
    };
  }

  if (title.includes("viagem") || title.includes("corrida") || title.includes("trip")) {
    return {
      icon: <FiNavigation />,
      bg: "#ECFDF5",
      color: "#059669",
    };
  }

  if (title.includes("alerta") || title.includes("aviso") || title.includes("cancel") || title.includes("urgente")) {
    return {
      icon: <FiInfo />,
      bg: "#FEF2F2",
      color: "#DC2626",
    };
  }

  return {
    icon: <FiBell />,
    bg: "#F1F5F9",
    color: "#475569",
  };
};

const ItemNotification: FC<ModalProps> = ({ item, readNotification, extraLink }) => {
  const [imageError, setImageError] = useState(false);
  const meta = getNotificationMeta(item);

  const rawPhoto = item?.user?.profileImage;
  const photoUrl = rawPhoto ? getDriverPhotoUrl(rawPhoto) : null;
  const hasValidPhoto = Boolean(photoUrl && !imageError);

  const formattedDate = (() => {
    try {
      const d = new Date(item.created_at);
      if (isNaN(d.getTime())) return item.created_at;
      return d.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return item.created_at;
    }
  })();

  return (
    <Content key={item.id} $isRead={Boolean(item.read)}>
      {!item.read && <UnreadBadge title="Não lida" />}

      {hasValidPhoto ? (
        <Image
          src={photoUrl!}
          alt={item.title || "Notificação"}
          onError={() => setImageError(true)}
        />
      ) : (
        <AvatarWrap $bg={meta.bg} $color={meta.color}>
          {meta.icon}
        </AvatarWrap>
      )}

      <div style={{ width: "100%", display: "flex", flexDirection: "column", minWidth: 0 }}>
        <NotificationTitle>{item.title}</NotificationTitle>

        {(item.adminNotificationTypeId === 14 || item.adminNotificationTypeId === 13 || item.notificationCityName) &&
          item.notificationCityName && (
            <CityBadge>📍 {item.notificationCityName}</CityBadge>
          )}

        <NotificationMessage dangerouslySetInnerHTML={{ __html: item.message }} />
        {extraLink}
        {item?.picture ? <Video controls src={item?.picture} /> : null}

        <NotificationFooter>
          <NotificationDate>{formattedDate}</NotificationDate>
          {!item.read && (
            <ButtonIcon
              type="primary"
              onClick={() => readNotification(item.id)}
              title="Marcar como lida"
            >
              <FiCheck /> Marcar lida
            </ButtonIcon>
          )}
        </NotificationFooter>
      </div>
    </Content>
  );
};

export default ItemNotification;
