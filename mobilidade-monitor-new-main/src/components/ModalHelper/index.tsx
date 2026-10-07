import { Modal, Button } from "antd";

import { Container, TitleModal, Iframe } from "./styles";

import { HelpersProps } from "../Notification/CitiesAndNotifications/types";

interface ModalHelperProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  helperInformation: HelpersProps | undefined;
}

export const ModalHelper = ({
  setVisible,
  visible,
  helperInformation,
}: ModalHelperProps) => {
  const convertLinkEmbebed = () => {
    return `https://www.youtube.com/embed/${
      helperInformation?.url_video.split("=")[1]
    }`;
  };

  return (
    <Modal
      open={visible}
      onCancel={() => setVisible(false)}
      footer={[
        // <Button type="primary">Ativar Implementações</Button>,
        <Button href={helperInformation?.url_redirect} target="_blank">
          Ver mais...
        </Button>,
      ]}
    >
      <Container>
        <TitleModal>{helperInformation?.title}</TitleModal>
        {helperInformation && <Iframe src={convertLinkEmbebed()} />}
      </Container>
    </Modal>
  );
};
