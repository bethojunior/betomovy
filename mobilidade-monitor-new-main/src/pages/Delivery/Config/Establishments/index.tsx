import { useEffect, useState } from "react";
import { AlertType, EstablishmentsList } from "./types";
import api from "../../../../services/api";
import Alert from "../../../../components/Utils/Alert";
import { AxiosError } from "axios";
import EstablishmentsTable from "../../../../components/Delivery/Config/Establisments/EstablishmentsTable/indesx";
import { Button } from "antd";
import RegisterAndEditModal from "../../../../components/Delivery/Config/Establisments/RegisterAndEditModal";
import { FormProps } from "antd/lib";
import { FieldType } from "../../../../components/Delivery/Config/Establisments/RegisterAndEditModal/types";
import LinkSectionModal from "../../../../components/Delivery/Config/Establisments/LinkSectionModal";
import { SectionsTableType } from "../Sections/types";
import Preload from "../../../../components/Utils/Preload";

const Establishments = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [listEstablishments, setListEstablishments] = useState<
    EstablishmentsList[]
  >([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Procurando...");
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [typeAlert, setTypeAlert] = useState<AlertType>("warning");
  const [editValues, setEditValues] = useState<EstablishmentsList>();
  const [isEdit, setIsEdit] = useState(false);
  const [openLinkSection, setOpenLinkSection] = useState(false);
  const [listSections, setListSections] = useState<SectionsTableType[]>([]);
  const [linkSections, setLinkSections] = useState<SectionsTableType[]>([]);
  const [sectionId, setSectionId] = useState(0);

  const sendAlert = (message: string, type: AlertType) => {
    setMessageAlert(message);
    setTypeAlert(type);
    setShowAlert(true);
  };

  const getAll = async () => {
    try {
      setTableLoading(true);
      const result = await api.get("typeDeliveryCategory");
      const { data } = result;
      setTableLoading(false);
      if (data?.status) {
        setListEstablishments(data.response);
      }
      if (data.response.length === 0) {
        setLoadingText("Nenhum item encontrado");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      setTableLoading(false);
      sendAlert("Erro ao listar categorias estabelecimentos", "error");
      console.error(axiosError);
    }
  };

  const registerOrEdit: FormProps<FieldType>["onFinish"] = async (event) => {
    try {
      setTableLoading(true);
      setOpen(false);
      const request = isEdit ? api.put : api.post;
      const result = await request(
        `typeDeliveryCategory${isEdit ? `/${editValues?.id}` : ""}`,
        event
      );
      const { data } = result;
      if (data?.status) {
        sendAlert(
          `Categoria ${isEdit ? "editada" : "cadastrada"} com sucesso`,
          "success"
        );
        return getAll();
      }
      sendAlert(
        `Erro ao ${isEdit ? "editada" : "cadastrada"} Categoria`,
        "warning"
      );
    } catch (error) {
      const axiosError = error as AxiosError;
      sendAlert(
        `Erro ao ${isEdit ? "editada" : "cadastrada"} Categoria`,
        "warning"
      );
      setTableLoading(false);
      console.error(axiosError);
    }
  };

  const getSection = async (id: number) => {
    try {
      const sections = api.get("deliverySection/all");
      const linkSection = api.get(`typeDeliveryCategoryBySection/${id}`);
      setLoading(true);
      const result = await Promise.all([sections, linkSection]);

      setLoading(false);
      if (result[0].data.status && result[1].data.status) {
        setSectionId(id);
        setOpenLinkSection(true);
        setLinkSections(result[1].data.response);
        return setListSections(result[0].data.response);
      }
      sendAlert("Erro ao listar seções", "error");
    } catch (error) {
      setLoading(false);
      const axiosError = error as AxiosError;
      console.error(axiosError);
      sendAlert("Erro ao listar seções", "error");
    }
  };

  useEffect(() => {
    getAll();
  }, []);
  return (
    <div>
      <Preload visible={loading} />
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
        Adcionar um tipo de categoria
      </Button>
      <EstablishmentsTable
        getAll={getAll}
        listEstablishments={listEstablishments}
        tableLoading={tableLoading}
        setTableLoading={setTableLoading}
        loadingText={loadingText}
        sendAlert={sendAlert}
        setEditValues={setEditValues}
        setOpen={setOpen}
        setIsEdit={setIsEdit}
        getSection={getSection}
      />
      <RegisterAndEditModal
        title={isEdit ? "Editar" : "Cadastrar"}
        open={open}
        registerOrEdit={registerOrEdit}
        onCancel={() => setOpen(false)}
        editValues={editValues}
      />
      <LinkSectionModal
        open={openLinkSection}
        setOpen={setOpenLinkSection}
        onCancel={() => setOpenLinkSection(false)}
        listSections={listSections}
        linkSections={linkSections}
        sectionId={sectionId}
        sendAlert={sendAlert}
        setLoading={setLoading}
      />
    </div>
  );
};

export default Establishments;
