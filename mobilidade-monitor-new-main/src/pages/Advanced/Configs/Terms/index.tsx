import { Button, Upload, UploadFile } from "antd";
import { AiOutlineUpload } from "react-icons/ai";
import React, { useState } from "react";

import {
  Container,
  Content,
  ContentButton,
  Card,
  ContentPdf,
  ContentUploadTerms,
} from "./styles";

import api from "../../../../services/api";
import Preload from "../../../../components/Utils/Preload";
import Alert from "../../../../components/Utils/Alert";

import Utils from "../../../../utils/Utils";
import swal from "sweetalert";

type TypeAlertMessageProps = "success" | "info" | "warning" | "error";

const Terms = () => {
  const [visibleAlert, setVisibleAlert] = useState<boolean>(false);
  const [typeMessage, setTypeMessage] =
    useState<TypeAlertMessageProps>("success");
  const [messageAlert, setMessageAlert] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [termsDriver, setTermsDriver] = useState<File | null>(null);
  const [termsCustomer, setTermsCustomer] = useState<File | null>(null);

  const { bytesToKb } = Utils;

  const handleCallMessageAlert = (
    message: string,
    type: TypeAlertMessageProps
  ) => {
    setMessageAlert(message);
    setTypeMessage(type);
    setVisibleAlert(true);
  };

  const onChangeFileTermsDriver = (event: UploadFile) => {
    if (event.originFileObj) {
      setTermsDriver(event.originFileObj);
    }
  };

  const onChangeFileTermsCustomer = (event: UploadFile) => {
    if (event.originFileObj) {
      setTermsCustomer(event.originFileObj);
    }
  };

  const onChangeBeforeUpload = (event: UploadFile) => {
    if (event) {
      const sizeKiloBytes = bytesToKb(event.size as number);

      if (Number(sizeKiloBytes) > 200) {
        swal({
          title: "Arquivos maiores de 200kb não são permitidos",
          icon: "warning",
        });

        return Upload.LIST_IGNORE;
      }
    }
  };

  const handleSendFileDriver = (event: React.FormEvent) => {
    event.preventDefault();

    if (termsDriver) {
      const formData = new FormData();
      formData.append("driver", termsDriver);
      setLoading(true);
      api
        .post("/config/terms", formData)
        .then((response) => {
          setLoading(false);
          if (response.data.status) {
            handleCallMessageAlert(
              "Termos atualizados com sucesso!",
              "success"
            );
          }
        })
        .catch((error) => {
          setLoading(false);
          handleCallMessageAlert("Erro na atualização de termos!", "error");
          console.log(error);
        });
    }
  };

  const handleSendFileCustomer = (event: React.FormEvent) => {
    event.preventDefault();

    if (termsCustomer) {
      const files = termsCustomer;
      const formData = new FormData();
      formData.append("customer", files);
      setLoading(true);
      api
        .post("/config/terms", formData)
        .then((response) => {
          setLoading(false);
          if (response.data.status) {
            handleCallMessageAlert(
              "Termos atualizados com sucesso!",
              "success"
            );
          }
        })
        .catch((error) => {
          setLoading(false);
          handleCallMessageAlert("Erro na atualização de termos!", "error");
          console.log(error);
        });
    }
  };

  return (
    <Container>
      <Preload visible={loading} />
      <Alert
        message={messageAlert}
        typeAlert={typeMessage}
        visibility={visibleAlert}
        setVisibility={setVisibleAlert}
      />
      <Content>
        <Card title="Termos Motorista">
          <ContentUploadTerms>
            <Upload
              listType="picture"
              maxCount={1}
              action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
              accept=".pdf"
              beforeUpload={(event) => onChangeBeforeUpload(event)}
              onChange={(event) => onChangeFileTermsDriver(event.file)}
            >
              <Button icon={<AiOutlineUpload />}>Termos do Motorista</Button>
            </Upload>
          </ContentUploadTerms>

          {termsDriver && (
            <ContentButton>
              <Button
                style={{
                  width: "100% !important",
                }}
                onClick={handleSendFileDriver}
                type="primary"
              >
                Enviar
              </Button>
            </ContentButton>
          )}

          {termsDriver && (
            <ContentPdf>
              <object
                data={URL.createObjectURL(termsDriver)}
                type="application/pdf"
              >
                <div>No PDF viewer available</div>
              </object>
            </ContentPdf>
          )}
        </Card>

        <Card title="Termos Passageiro">
          <ContentUploadTerms>
            <Upload
              listType="picture"
              maxCount={1}
              action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
              accept=".pdf"
              beforeUpload={(event) => onChangeBeforeUpload(event)}
              onChange={(event) => onChangeFileTermsCustomer(event.file)}
            >
              <Button icon={<AiOutlineUpload />}>Termos do Passageiro</Button>
            </Upload>
          </ContentUploadTerms>

          {termsCustomer && (
            <ContentButton>
              <Button onClick={handleSendFileCustomer} type="primary">
                Enviar
              </Button>
            </ContentButton>
          )}

          {termsCustomer && (
            <ContentPdf>
              <object
                data={URL.createObjectURL(termsCustomer)}
                type="application/pdf"
              >
                <div>No PDF viewer available</div>
              </object>
            </ContentPdf>
          )}
        </Card>
      </Content>
    </Container>
  );
};

export default Terms;
