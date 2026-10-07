import { Modal, Button, Input } from "antd";
import { useState } from "react";

import { ContentInput, LabelText } from "./styles";

import api from "../../../../../services/api";
import swal from "sweetalert";

interface ModalAddKeyProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  setLoading: (data: boolean) => void;
  getKeyMaps: () => void;
}

export const ModalAddKey = ({
  visible,
  setVisible,
  setLoading,
  getKeyMaps,
}: ModalAddKeyProps) => {
  const [keyMap, setKeyMap] = useState<string>("");

  const handleAddKeyMap = async () => {
    try {
      setLoading(true);

      if (keyMap.length <= 0) {
        swal({
          title: "Preencha o campo chave",
          icon: "warning",
        });
      }

      const responseKey = await api.post("webMapKey", {
        key: keyMap,
      });

      if (responseKey.status) {
        swal({
          title: "Chave adicionada com sucesso",
          icon: "success",
        });
        getKeyMaps();
        setKeyMap("");
        setVisible(false);
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao tentar cadastrar a chave",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={() => setVisible(false)}
      footer={[
        <Button onClick={() => setVisible(false)} key={1}>
          Cancelar
        </Button>,
        <Button type="primary" onClick={handleAddKeyMap} key={2}>
          Salvar
        </Button>,
      ]}
    >
      <ContentInput>
        <LabelText>Chave</LabelText>
        <Input
          style={{
            width: "100%",
          }}
          value={keyMap}
          onChange={(event) => setKeyMap(event.target.value)}
        />
      </ContentInput>
    </Modal>
  );
};
