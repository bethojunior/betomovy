import { Collapse, Button } from "antd";
import { useContext, useEffect, useState } from "react";
import swal from "sweetalert";

import { Container, Content, ContentInput, ContentBtnCollapse, Loader } from "./styles";
import { ConfigMapsProps } from "./types";

import api from "../../../../services/api";

import Preload from "../../../../components/Utils/Preload";
import AuthContext from "../../../../contexts/auth";
import { MAPA } from "../../../../constants/permissions";
import { ALLOWED_CREDENCIES_KEYS, BLOCKED_CREDENCIES_KEYS, FIELD_OPTIONS } from "./constants";
import { ConfigField } from "../../../../components/ConfigField";

export const ConfigMaps = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [credencies, setCredencies] = useState<ConfigMapsProps[]>([]);
  const [services, setServices] = useState<ConfigMapsProps[]>([]);

  const { hasPermission } = useContext(AuthContext);

  const getServices = () => {
    setLoading(true);
    const responseCredencies = api.get("config/type/13");
    const responseServices = api.get("config/type/21");

    Promise.all([responseCredencies, responseServices])
      .then((response) => {
        if (response[0]?.status) {
          const raw0 = response[0]?.data?.response;
          const filtered = Array.isArray(raw0)
            ? raw0.filter((item: ConfigMapsProps) => ALLOWED_CREDENCIES_KEYS.includes(item.key))
            : [];
          setCredencies(filtered);
        }

        if (response[1]?.status) {
          const raw1 = response[1]?.data?.response;
          const filtered = Array.isArray(raw1)
            ? raw1.filter((item: any) => !BLOCKED_CREDENCIES_KEYS.includes(item.key))
            : [];

          setServices(filtered);
        }
      })
      .catch((err) => {
        console.error(err);
        setCredencies([]);
        setServices([]);
      })
      .finally(() => setLoading(false));
  };

  const handleChangeInput = (
    valueUpdated: ConfigMapsProps,
    index: number,
    value: string,
    type: "credencies" | "services"
  ) => {
    if (type === "credencies") {
      const cloneCredencies = [...credencies];
      valueUpdated.value = value;
      const newValue = (cloneCredencies[index] = valueUpdated);
      cloneCredencies[index] = newValue;
      setCredencies(cloneCredencies);
    } else {
      const cloneServices = [...services];
      valueUpdated.value = value;
      const newValue = (cloneServices[index] = valueUpdated);
      cloneServices[index] = newValue;
      setServices(cloneServices);
    }
  };

  const updateKeys = async (valueUpdated: ConfigMapsProps) => {
    swal({
      title: "Você deseja alterar esse dado?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);
        const object: any = {};
        object[valueUpdated.key] = valueUpdated.value;

        api
          .put("config", object)
          .then((response) => {
            if (response.status) {
              swal({
                title: "Modificado com sucesso",
                icon: "success",
              });
              getServices();
            }
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  useEffect(() => {
    getServices();
  }, []);

  if (loading) return <Loader spinning />;

  return (
    <Container>
      <Preload visible={loading} />
      <Content>
        <h1>Credenciais</h1>
        <Collapse>
          {credencies.map((value, index) => {
            return (
              <Collapse.Panel key={value.key} header={value.description}>
                <ContentInput>
                  <ConfigField
                    type={value.inputTypePro}
                    value={value.value}
                    options={FIELD_OPTIONS[value.key]}
                    onChange={(v) => handleChangeInput(value, index, v, "credencies")}
                  />
                  
                  <ContentBtnCollapse>
                    <Button
                      style={{
                        width: "100%",
                      }}
                      type="primary"
                      onClick={() => updateKeys(value)}
                    >
                      Salvar
                    </Button>
                  </ContentBtnCollapse>
                </ContentInput>
              </Collapse.Panel>
            );
          })}
        </Collapse>
      </Content>

      <Content>
        <h1>Serviços</h1>
        <Collapse>
          {services.map((value, index) => {
            return (
              <Collapse.Panel key={value.key} header={value.description}>
                <ContentInput>
                  <ConfigField
                    type={value.inputTypePro}
                    value={value.value}
                    options={FIELD_OPTIONS[value.key]}
                    onChange={(v) => handleChangeInput(value, index, v, "services")}
                  />
                  
                  {hasPermission(MAPA, "editar_configuracoes_gerais") && (
                    <ContentBtnCollapse>
                      <Button type="primary" onClick={() => updateKeys(value)}>
                        Salvar
                      </Button>
                    </ContentBtnCollapse>
                  )}
                </ContentInput>
              </Collapse.Panel>
            );
          })}
        </Collapse>
      </Content>
    </Container>
  );
};
	