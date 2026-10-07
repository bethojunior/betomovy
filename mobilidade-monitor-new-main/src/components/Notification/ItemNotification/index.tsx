import { FC, ReactNode } from "react";
import { FiCheck } from "react-icons/fi";
import { Content, Image, ButtonIcon, Video } from "./styles";
import DefaultIcon from "../../../assets/imageDefaultIcon.png";
import { Constants } from "../../../utils/constants";

type NotificationData = {
  read: number;
  id: number;
  title: string;
  message: string;
  created_at: string;
  user: {
    profileImage: string;
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

const iconClient = import.meta.env.S3_LINK;

const ItemNotification: FC<ModalProps> = ({ item, readNotification, extraLink }) => {
  return (
    <Content key={item.id}>
      <Image
        src={
          item?.user?.profileImage
            ? Constants.url_photo_driver + item?.user?.profileImage
            : DefaultIcon
        }
        alt="Imagem da notificação"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = `${iconClient}default.jpg`;
        }}
      />
      <div style={{ width: "100%", display: 'flex', flexDirection: 'column' }}>
        <h3>{item.title}</h3>
        {(item.adminNotificationTypeId === 14 || item.adminNotificationTypeId === 13) && item.notificationCityName && (
          <p style={{ margin: 0, marginBottom: 2, color: '#222', fontSize: 14, fontWeight: 'normal' }}>Cidade: {item.notificationCityName}</p>
        )}
        <p dangerouslySetInnerHTML={{ __html: item.message }} />
        {extraLink}
        {item?.picture ? <Video controls src={item?.picture} /> : null}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <p style={{ marginBottom: 0, wordBreak: 'break-word', fontSize: 15 }}>{new Date(item.created_at).toLocaleString()}</p>
          {!item.read && (
            <ButtonIcon type="primary" onClick={() => readNotification(item.id)}>
              <FiCheck />
            </ButtonIcon>
          )}
        </div>
      </div>
    </Content>
  );
};

export default ItemNotification;
