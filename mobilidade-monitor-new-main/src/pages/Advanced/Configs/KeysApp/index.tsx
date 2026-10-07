import { Collapse } from "antd";
import { FC, useEffect, useState } from "react";
      
import { InputLink } from "../../../../components/Advanced/Config/KeysApp/InputLink";
import { Content, Title, ContentKeys, Loader } from "./styles";
import api from "../../../../services/api";
import swal from "sweetalert";
import { AxiosError } from "axios";

const { Panel } = Collapse;

const KeysApp: FC = () => {
  const [loading, setLoading] = useState(false);
  const [listKeys, setListKeys] = useState<KeysAppProps[]>([]);

  const getAllKeys = async () => {
    try {
      setLoading(true);
      const responseConfigs = await api.get("config");

      if (responseConfigs.status) {
        const keys = responseConfigs.data.response;

        setListKeys(keys);
        localStorage.setItem("keysApp", JSON.stringify(keys));
      }
    } catch (error) {
      console.error(error);
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.response,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllKeys();
  }, []);

  if (loading) return <Loader spinning />;

  return (
    <Content>
       
      <Collapse>
        {listKeys.map((item) => {
          return (
            <Panel header={item.type} key={item.type}>
              {item.config.map((value) => {
                return (
                  <ContentKeys key={value.key}>
                    <Title>{value.description}</Title>

                    <InputLink
                      valueInput={value.value}
                      id={value.key}
                      keyInput={value.key}
                      inputTypePro={value.inputTypePro}
                    />
                  </ContentKeys>
                );
              })}
            </Panel>
          );
        })}
      </Collapse>
    </Content>
  );
};

export default KeysApp;
