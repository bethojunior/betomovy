import { Modal, Select, Button, Input } from "antd";
import { useEffect, useState } from "react";
import swal from "sweetalert";

import api from "../../../../../services/api";

import { Container, ContentInput, LabelText, Content } from "./styles";

import {
  TypesProps,
  MapServiceMetaDataProps,
} from "../../../../../pages/Advanced/Maps/ConfigCity/types";

interface ModalAddMapServiceProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  typesMaps: TypesProps[];
  setLoading: (data: boolean) => void;
  getDatas: () => void;
}

export const ModalAddMapService = ({
  setVisible,
  visible,
  typesMaps,
  setLoading,
  getDatas,
}: ModalAddMapServiceProps) => {
  const [value, setValue] = useState<string>("");
  const [listConfigCredencies, setListConfigCredencies] = useState<
    MapServiceMetaDataProps[]
  >([]);

  const typesMapsFormated = (Array.isArray(typesMaps) ? typesMaps : []).map((value) => {
    return {
      value: JSON.stringify(value?.map_service_meta_data || []),
      label: value?.description || value?.name || "",
    };
  });

  const handleChangeInput = (index: number, value: string) => {
    const cloneListConfigCredencies = [...listConfigCredencies];
    cloneListConfigCredencies[index]["value"] = value;
    setListConfigCredencies(cloneListConfigCredencies);
  };

  const handleCreateCredentials = async () => {
    try {
      setLoading(true);

      const metadasSend = (Array.isArray(listConfigCredencies) ? listConfigCredencies : []).map((val) => {
        return {
          key: val?.key,
          value: val?.value,
        };
      });

      const objectSend = {
        mapServiceId: listConfigCredencies?.[0]?.mapServiceId,
        metadata: metadasSend,
      };

      const responseCreateCredentials = await api.post(
        "mapService",
        objectSend
      );

      if (responseCreateCredentials.status) {
        swal({
          title: "Credenciais atualizada com sucesso",
          icon: "success",
        });
        setVisible(false);
        setListConfigCredencies([]);
        getDatas();
        setValue("");
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao criar credencial",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (value && value.length > 0) {
      try {
        const parsed = JSON.parse(value);
        setListConfigCredencies(Array.isArray(parsed) ? parsed : []);
      } catch {
        setListConfigCredencies([]);
      }
    } else {
      setListConfigCredencies([]);
    }
  }, [value]);

  return (
    <Modal
      title="Adicionar Credencial"
      open={visible}
      onCancel={() => setVisible(false)}
      footer={[
        <Button onClick={() => setVisible(false)} key={1}>
          Fechar
        </Button>,
        <Button type="primary" onClick={handleCreateCredentials} key={2}>
          Salvar
        </Button>,
      ]}
    >
      <Container>
        <ContentInput>
          <LabelText>Selecione o tipo de mapa</LabelText>
          <Select
            style={{
              width: "100%",
            }}
            value={value}
            onChange={(val) => setValue(val)}
            options={typesMapsFormated}
          />
        </ContentInput>
        <Content>
          {(Array.isArray(listConfigCredencies) ? listConfigCredencies : []).map((valItem, index) => {
            return (
              <div
                key={valItem?.id || index}
                style={{
                  marginTop: 5,
                  marginBottom: 5,
                }}
              >
                <LabelText>{valItem?.description || valItem?.key || ""}</LabelText>
                <Input
                  onChange={(event) =>
                    handleChangeInput(index, event.target.value)
                  }
                />
              </div>
            );
          })}
        </Content>
      </Container>
    </Modal>
  );
};
