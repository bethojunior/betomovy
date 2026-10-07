import { Container, Image, LabelText, Content, Text } from "./styles";

import { Button, Modal, Collapse } from "antd";

import { PublicityProps } from "../../../../pages/Advanced/Publicity/ListPublicity/types";

interface ModalListPublictyProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  publicityDetails: PublicityProps | undefined;
}

export const ModalListPublicty = ({
  setVisible,
  visible,
  publicityDetails,
}: ModalListPublictyProps) => {
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleDateString();
    } catch {
      return "-";
    }
  };

  if (!publicityDetails) {
    return (
      <Modal
        title="Publicidade"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button type="primary" onClick={() => setVisible(false)}>
            Fechar
          </Button>,
        ]}
      >
        <Container>
          <Text>Nenhuma informação disponível.</Text>
        </Container>
      </Modal>
    );
  }

  return (
    <Modal
      title="Publicidade"
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
              <LabelText>Banner</LabelText>
              <Image 
                src={publicityDetails?.banner || undefined} 
                alt="Banner"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </Content>
            <Content
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <LabelText>Thumbnail</LabelText>
              <Image 
                src={publicityDetails?.thumbnail || undefined} 
                alt="Thumbnail"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </Content>
          </Collapse.Panel>
          <Collapse.Panel key={2} header="Informações Gerais">
            <Content>
              <LabelText>Empresa:</LabelText>
              <Text>{publicityDetails?.company?.name ?? "-"}</Text>
            </Content>
            <Content>
              <LabelText>Nome Fantasia:</LabelText>
              <Text>{publicityDetails?.company?.fantasyName ?? "-"}</Text>
            </Content>
            <Content>
              <LabelText>Cidade:</LabelText>
              <Text>{publicityDetails?.city?.cityName ?? "-"}</Text>
            </Content>
            <Content>
              <LabelText>Aplicativo alvo:</LabelText>
              <Text>{publicityDetails?.app?.name ?? "-"}</Text>
            </Content>
            <Content>
              <LabelText>Link:</LabelText>
              <Text>{publicityDetails?.link || "-"}</Text>
            </Content>
            <Content>
              <LabelText>Email Informativo:</LabelText>
              <Text>{publicityDetails?.emailInformation || "-"}</Text>
            </Content>
            <Content>
              <LabelText>Email Redirecionamento:</LabelText>
              <Text>{publicityDetails?.emailRedirect || "-"}</Text>
            </Content>
            <Content>
              <LabelText>Gênero:</LabelText>
              <Text>{publicityDetails?.gender?.name ?? "-"}</Text>
            </Content>
            <Content>
              <LabelText>Descrição:</LabelText>
              <Text>{publicityDetails?.description ?? "-"}</Text>
            </Content>
            <Content>
              <LabelText>Tempo de exibição do anúncio:</LabelText>
              <Text>
                {publicityDetails?.amountOfTime ? `${publicityDetails.amountOfTime} segundos` : "-"}
              </Text>
            </Content>
            <Content>
              <LabelText>Data:</LabelText>
              <Text>
                {`${formatDate(publicityDetails?.dateStart)} até ${formatDate(publicityDetails?.dateEnd)}`}
              </Text>
            </Content>
          </Collapse.Panel>
        </Collapse>
      </Container>
    </Modal>
  );
};
