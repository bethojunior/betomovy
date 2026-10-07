import { FC, useEffect, useState } from "react";
import { Button, Input } from "antd";
import apiv1 from "../../../../../../services/apiv1";
import Alert from "../../../../../Utils/Alert";
import Preload from "../../../../../Utils/Preload";
import MockupTripTypeInfo from "./Mockup";
import { Container, Content, FormSection, FirstSection, SecondSection, MockupSection, Title, SaveButton } from "./styles";

const InformationTrip: FC = () => {
  const [loading, setLoading] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");

  const [titleInformation, setTitleInformation] = useState("");
  const [descriptionInformation, setDescriptionInformation] = useState("");
  const [savedTitle, setSavedTitle] = useState("");
  const [savedDescription, setSavedDescription] = useState("");

  const loadInformation = () => {
    setLoading(true);

    apiv1
      .get("config/textTripTypes")
      .then((result) => {
        const { response } = result.request;
        if (!JSON.parse(response).status || !result.data.status) {
          setMessageAlert(
            "Não foi possível carregar as configurações de chamado, tente novamente"
          );
          setTypeAlert("error");
          return setShowAlert(true);
        }

        let title = "";
        let description = "";

        const data = result.data.data || result.data.response || result.data;

        if (Array.isArray(data)) {
          const titleItem = data.find((item: any) => item.key === "title_trip_types");
          const descriptionItem = data.find((item: any) => item.key === "description_trip_types");
          title = titleItem?.value || "";
          description = descriptionItem?.value || "";
        } 
        // Se for um objeto direto com as propriedades
        else if (data && typeof data === "object") {
          title = data.title_trip_types || "";
          description = data.description_trip_types || "";
        }

        // Garantir que valores null/undefined sejam tratados como string vazia
        const finalTitle = title ?? "";
        const finalDescription = description ?? "";
        setTitleInformation(finalTitle);
        setDescriptionInformation(finalDescription);
        // Salvar valores iniciais do banco para usar quando campos estiverem vazios
        setSavedTitle(finalTitle);
        setSavedDescription(finalDescription);
      })
      .catch(() => {
        setMessageAlert(
          "Não foi possível carregar as configurações de chamado, tente novamente"
        );
        setTypeAlert("error");
        setShowAlert(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadInformation();
  }, []);

  const updateInformation = () => {
    // Validar se ambos os campos têm valor
    const titleTrimmed = titleInformation.trim();
    const descriptionTrimmed = descriptionInformation.trim();
    
    if (!titleTrimmed || !descriptionTrimmed) {
      setMessageAlert("Preencha o título e a descrição para salvar");
      setTypeAlert("warning");
      setShowAlert(true);
      return;
    }

    setLoading(true);
    apiv1
      .put("config/textTripTypes", {
        description_trip_types: descriptionTrimmed,
        title_trip_types: titleTrimmed,
      })
      .then((result) => {
        if (!result.data.status) {
          setMessageAlert(
            "Não foi possível alterar as informações, tente novamente"
          );
          setTypeAlert("error");
          setShowAlert(true);
          return;
        }

        setMessageAlert("Informações atualizadas com sucesso!");
        setTypeAlert("success");
        // Atualizar valores salvos após salvar com sucesso
        setSavedTitle(titleTrimmed);
        setSavedDescription(descriptionTrimmed);
        setShowAlert(true);
      })
      .catch((error) => {
        console.error("Erro ao salvar informações:", error);
        setMessageAlert(
          "Não foi possível alterar as informações, tente novamente"
        );
        setTypeAlert("error");
        setShowAlert(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container>
      <Preload visible={loading} />
      <Alert
        visibility={showAlert}
        message={messageAlert}
        typeAlert={typeAlert}
        setVisibility={setShowAlert}
      />
      <Content>
        <FormSection>
          <FirstSection>
            <Title>Título</Title>
            <Input
              size="large"
              placeholder="Ex: PAPAI WATCH"
              value={titleInformation}
              onChange={(e) => setTitleInformation(e.target.value)}
            />
          </FirstSection>
          <SecondSection>
            <Title>Descrição</Title>
            <Input
              size="large"
              placeholder="Ex: Viagem confortável e segura"
              value={descriptionInformation}
              onChange={(e) => setDescriptionInformation(e.target.value)}
            />
          </SecondSection>
        </FormSection>
        <SaveButton>
          <Button type="primary" onClick={updateInformation} size="large">
            Salvar
          </Button>
        </SaveButton>
      </Content>
      <MockupSection>
        <MockupTripTypeInfo
          title={titleInformation}
          description={descriptionInformation}
          savedTitle={savedTitle}
          savedDescription={savedDescription}
        />
      </MockupSection>
    </Container>
  );
};

export default InformationTrip;
