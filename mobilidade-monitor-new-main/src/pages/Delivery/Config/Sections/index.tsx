import SectionsTable from "../../../../components/Delivery/Config/Sections/SectionsTable";
import SectionsModal from "../../../../components/Delivery/Config/Sections/SectionsModal";
import { useState } from "react";
import { FormProps } from "antd/lib";
import { FieldType } from "../../../../components/Delivery/Config/Sections/SectionsModal/types";
import { AxiosError } from "axios";
import api from "../../../../services/api";
import { AlertType, SectionsTableType } from "./types";
import Alert from "../../../../components/Utils/Alert";
import { Button } from "antd";

const Sections = () => {
  const [open, setOpen] = useState(false);
  const [listSections, setListSections] = useState<SectionsTableType[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Procurando...");
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [typeAlert, setTypeAlert] = useState<AlertType>("warning");
  const [editValues, setEditValues] = useState<SectionsTableType>();
  const [isEdit, setIsEdit] = useState(false);
  const [getFile, setGetFile] = useState<Blob>();

  const sendAlert = (message: string, type: AlertType) => {
    setMessageAlert(message);
    setTypeAlert(type);
    setShowAlert(true);
  };

  const getAll = () => {
    try {
      setTableLoading(true);
      api.get("deliverySection/all").then(({ data }) => {
        setTableLoading(false);
        if (data?.status) {
          setListSections(data.response);
        }
        if (data.response.length === 0) {
          setLoadingText("Nenhum item encontrado");
        }
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      setTableLoading(false);
      sendAlert("Erro ao listar seções", "error");
      console.log(axiosError);
    }
  };

  const registerSection: FormProps<FieldType>["onFinish"] = (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("icon", getFile as Blob);
      formData.append("description", values.description);
      setTableLoading(true);
      setOpen(false);
      api
        .post(`deliverySection${isEdit ? `/${editValues?.id}` : ""}`, formData)
        .then(({ data }) => {
          if (data?.status) {
            sendAlert(
              `Seção ${isEdit ? "editada" : "cadastrada"} com sucesso`,
              "success"
            );
            return getAll();
          }
          setTableLoading(false);
          sendAlert(
            `Erro ao ${isEdit ? "editada" : "cadastrada"} seção`,
            "warning"
          );
        });
    } catch (error) {
      const axiosError = error as AxiosError;
      sendAlert("Erro ao cadastrada seção", "warning");
      setTableLoading(false);
      console.log(axiosError);
    }
  };

  return (
    <div>
      <Alert
        visibility={showAlert}
        message={messageAlert}
        typeAlert={typeAlert}
        setVisibility={setShowAlert}
      />
      <Button
        style={{ marginBottom: 10 }}
        type="primary"
        onClick={() => {
          setOpen(true);
          setIsEdit(false);
          setEditValues(undefined);
        }}
      >
        Cadastrar
      </Button>
      <SectionsTable
        getAll={getAll}
        listSections={listSections}
        tableLoading={tableLoading}
        setTableLoading={setTableLoading}
        loadingText={loadingText}
        sendAlert={sendAlert}
        setEditValues={setEditValues}
        setOpen={setOpen}
        setIsEdit={setIsEdit}
      />
      <SectionsModal
        title={isEdit ? "Editar" : "Cadastrar"}
        open={open}
        registerSection={registerSection}
        onCancel={() => setOpen(false)}
        editValues={editValues}
        setGetFile={setGetFile}
      />
    </div>
  );
};

export default Sections;
