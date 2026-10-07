import { Button, Modal } from "antd";

import { Container } from "./styles";
import { VersionFormFields } from "./VersionFormFields";
import { useVersionForm } from "./useVersionForm";
import { VersionFormModalProps } from "./types";

const TITLES = {
  create: { modal: "Adicionar nova versão", submit: "Salvar" },
  edit: { modal: "Editar versão", submit: "Salvar alterações" },
};

export const VersionFormModal = ({
  mode,
  initialValues,
  showModal,
  setShowModal,
  getAllVersions,
  setLoading,
  listVersions,
}: VersionFormModalProps) => {
  const { values, setField, handleAppChange, listApps, handleSubmit } = useVersionForm({
    mode,
    initialValues,
    listVersions,
    getAllVersions,
    setShowModal,
    setLoading,
    showModal,
  });

  return (
    <Modal
      title={TITLES[mode].modal}
      open={showModal}
      destroyOnClose
      onCancel={() => setShowModal(false)}
      footer={[
        <Button key="cancel" onClick={() => setShowModal(false)}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {TITLES[mode].submit}
        </Button>,
      ]}
    >
      <Container>
        <VersionFormFields
          values={values}
          listApps={listApps}
          onAppChange={handleAppChange}
          onFieldChange={setField}
        />
      </Container>
    </Modal>
  );
};
