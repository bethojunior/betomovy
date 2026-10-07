import { PublicityAppProps } from "../../../../pages/Advanced/Publicity/PublicityAppList/types";
import { Container, Image, LabelText, Content, Text } from "./styles";

import { Button, Modal, Collapse } from "antd";



interface ModalListPublictyProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  publicityDetails: PublicityAppProps | undefined;
}

export const ModalListPublictyApp = ({
  setVisible,
  visible,
  publicityDetails,
}: ModalListPublictyProps) => {
  return (
    <Modal
      title="Publicidade App"
      open={visible}
      onCancel={() => setVisible(false)}
      footer={[
        <Button type="primary" onClick={() => setVisible(false)}>
          Fechar
        </Button>,
      ]}
    >
      <Container>
        <Collapse>
          <Collapse.Panel key={1} header="Imagens">
            <Content
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <LabelText>Tela Inicial Passageiro</LabelText>
              <Image src={publicityDetails?.image_passenger_screen} />
            </Content>
            <Content
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <LabelText>Tela Passageiro em Trânsito</LabelText>
              <Image src={publicityDetails?.image_passenger_transit} />
            </Content>
            <Content
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <LabelText>Tela Inicial Motorista</LabelText>
              <Image src={publicityDetails?.image_driver_initial} />
            </Content>
            <Content
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <LabelText>Tela Motorista em Trânsito</LabelText>
              <Image src={publicityDetails?.image_driver_transit} />
            </Content>
          </Collapse.Panel>
          <Collapse.Panel key={2} header="Informações Gerais">
            <Content>
              <LabelText>Empresa:</LabelText>
              <Text>{publicityDetails?.company_name}</Text>
            </Content>
            <Content>
              <LabelText>Gestor Responsável</LabelText>
              <Text>{publicityDetails?.responsible_manager}</Text>
            </Content>
            <Content>
              <LabelText>Email:</LabelText>
              <Text>{publicityDetails?.company_email}</Text>
            </Content>
            <Content>
              <LabelText>WhatsApp:</LabelText>
              <Text>{publicityDetails?.company_whatsapp}</Text>
            </Content>
            <Content>
              <LabelText>Link:</LabelText>
              <Text>{publicityDetails?.link}</Text>
            </Content>
          </Collapse.Panel>
        </Collapse>
      </Container>
    </Modal>
  );
};
