import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import swal from "sweetalert";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Collapse, Input, Button, Switch } from "antd";

import { Container, Content, ContentButton, Loader } from "./style";

import api from "../../../../services/api";

import Alert from "../../../../components/Utils/Alert";
import { isBooleanConfigInputType } from "../../../../utils/isBooleanConfigInputType";

interface DataListConfigAdditionalProps {
  description: string;
  key: string;
  value: string;
  inputTypePro: string;
}

type TypeMessageAlertProps = "success" | "info" | "warning" | "error";

const AdditionalSettings = () => {
  const { control, handleSubmit } = useForm<any>();

  const [loading, setLoading] = useState<boolean>(false);
  const [dataListConfigAdditional, setDataListConfigAdditional] = useState<
    DataListConfigAdditionalProps[]
  >([]);
  const [keyConfiguration, setKeyConfiguration] = useState<any>();
  const [messageAlert, setMessageAlert] = useState<string>("");
  const [typeMessageAlert, setTypeMessageAlert] =
    useState<TypeMessageAlertProps>("success");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const getConfigsAdditionals = async () => {
    try {
      setLoading(true);
      const responseConfigsAdditionals = await api.get("config/additional");

      if (responseConfigsAdditionals.data) {
        setDataListConfigAdditional(responseConfigsAdditionals.data.response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const persistConfig = (key: string, value: string) => {
    setLoading(true);
    api
      .put("/config", { [key]: value })
      .then((response) => {
        setLoading(false);
        if (response.data.status) {
          setMessageAlert("Modificado com sucesso!");
          setTypeMessageAlert("success");
          setShowAlert(true);
          getConfigsAdditionals();
        }
      })
      .catch((error: AxiosError<{ message?: string }>) => {
        console.error(error);
        setLoading(false);
        setMessageAlert(
          error.response?.data?.message ?? "Erro ao modificar configuração."
        );
        setTypeMessageAlert("error");
        setShowAlert(true);
      });
  };

  const handleChangeData: SubmitHandler<any> = (data) => {
    swal({
      title: "Você deseja alterar esse dado?",
      icon: "info",
      text: "Certifique-se que está alterando o item certo!",
      buttons: ["Não", "Sim"],
    }).then((confirmChange) => {
      if (confirmChange) {
        persistConfig(keyConfiguration, data[keyConfiguration]);
      }
    });
  };

  const handleToggleChange = (key: string) => (checked: boolean) => {
    persistConfig(key, checked ? "1" : "0");
  };

  useEffect(() => {
    getConfigsAdditionals();
  }, []);

  if (loading) return <Loader spinning />;

  return (
    <Container>
       
      <Alert
        message={messageAlert}
        typeAlert={typeMessageAlert}
        visibility={showAlert}
        setVisibility={setShowAlert}
      />
      <h1>Configurações do Gestor</h1>
      <Content>
        <Collapse>
          {dataListConfigAdditional.map((response) => {
            return (
              <Collapse.Panel header={response.description} key={response.key}>
                {isBooleanConfigInputType(response.inputTypePro) ? (
                  <Switch
                    checked={response.value === "1"}
                    onChange={handleToggleChange(response.key)}
                  />
                ) : (
                  <form onSubmit={handleSubmit(handleChangeData)}>
                    <Controller
                      control={control}
                      name={response.key}
                      render={({
                        field: { onChange, value = response.value },
                      }) => <Input value={value} onChange={onChange} />}
                    />

                    <ContentButton>
                      <Button
                        type="primary"
                        htmlType="submit"
                        onClick={() => setKeyConfiguration(response.key)}
                      >
                        Salvar
                      </Button>
                    </ContentButton>
                  </form>
                )}
              </Collapse.Panel>
            );
          })}
        </Collapse>
      </Content>
    </Container>
  );
};

export default AdditionalSettings;
