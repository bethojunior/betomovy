import { useEffect, useState } from "react";
import api from "../../../../services/api";
import { AxiosError } from "axios";
import Preload from "../../../../components/Utils/Preload";
import { DeliveryListProps, FieldType } from "./types";
import Alert from "../../../../components/Utils/Alert";
import { Button, Tooltip, type FormProps, UploadFile } from "antd";
import AccessoriesTable from "../../../../components/Delivery/Config/DeliveryAccessories/AccessoriesTable";
import AccessoriesModal from "../../../../components/Delivery/Config/DeliveryAccessories/AccessoriesModal";
import { IoMdInformationCircle } from "react-icons/io";
import { ButtonContainer } from "./styles";
import { resizeLogo } from "../../../../hooks/resizeLogo";
import swal from "sweetalert";

const DeliveryAccessories = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [accessoriesList, setAccessoriesList] = useState<DeliveryListProps[]>(
    []
  );
  const [editValues, setEditValues] = useState<DeliveryListProps>();
  const [tableLoading, setTableLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Procurando...");
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [typeAlert, setTypeAlert] = useState<AlertType>("warning");

  const sendAlert = (message: string, type: AlertType) => {
    setMessageAlert(message);
    setTypeAlert(type);
    setShowAlert(true);
  };

  const getAll = async () => {
    try {
      setTableLoading(true);
      const result = await api.get("driverAttachmentType");
      const { data } = result;
      setTableLoading(false);
      if (data?.status) {
        setAccessoriesList(Array.isArray(data.response) ? data.response : []);
      }
      if (!data?.response || (Array.isArray(data.response) && data.response.length === 0)) {
        setLoadingText("Nenhum item encontrado");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      setTableLoading(false);
      setLoadingText("Erro ao trazer itens");
      sendAlert("Erro ao listar categorias estabelecimentos", "error");
      console.log(axiosError);
    }
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (event) => {
    editValues ? editItem(event) : register(event);
  };

  const validationFile = (file: UploadFile) => {
    if (Number(file?.size) > 2097152) {
      return swal({
        title: "Essa imagem é maior do que 2 MB, deseja redimensionar?",
        icon: "info",
        buttons: ["Não", "Sim"],
        dangerMode: true,
      }).then(async (res) => {
        if (res) {
          const typeFile = file?.type?.split("/");
          const imgResized = await resizeLogo(
            file as any,
            200,
            400,
            typeFile ? typeFile[1]?.toUpperCase() : ("JPEG" as any),
            "blob"
          );
          return imgResized;
        }
        return false;
      });
    }
    return file;
  };

  const register = async (event: FieldType) => {
    const imgResized = await validationFile(event?.icon?.file as any);
    if (!imgResized) return;

    try {
      const formData = new FormData();
      formData.append("name", event.name);
      formData.append("picture", imgResized as File);
      formData.append("description", event.description ?? "");
      setLoading(true);
      const result = await api.post("driverAttachmentType", formData);
      setLoading(false);
      const { data } = result;
      if (data.status) {
        setOpen(false);
        getAll();
        return sendAlert("Sucesso ao adicionar um acessório", "success");
      }
      sendAlert("Erro ao tentar inserir acessório", "warning");
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log(axiosError);
      setLoading(false);
      sendAlert("Erro ao tentar inserir acessório", "warning");
    }
  };

  const editItem = async (event: FieldType) => {
    try {
      if (!event.icon) {
        setLoading(true);
        const result = await api.put(`driverAttachmentType/${editValues?.id}`, {
          description: event.description,
          name: event.name,
        });
        setLoading(false);

        const { data } = result;
        if (data.status) {
          setOpen(false);
          getAll();
          return sendAlert("Acessório editado com sucesso", "success");
        }
        sendAlert("Erro ao tentar editar acessório", "warning");
      } else {
        if (event?.icon?.file.status == "removed") {
          return sendAlert("Insira uma imagem", "warning");
        }
        const imgResized = await validationFile(event?.icon?.file as any);
        if (!imgResized) return;

        const formData = new FormData();
        formData.append("picture", (imgResized ?? event?.icon?.file) as any);
        const resultLogo = api.post(
          `driverAttachmentType/${editValues?.id}/updatePicture`,
          formData
        );
        const resultName = api.put(`driverAttachmentType/${editValues?.id}`, {
          description: event.description,
          name: event.name,
        });
        setLoading(true);
        const requestResult = await Promise.all([resultLogo, resultName]);
        setLoading(false);

        if (requestResult[0].data.status && requestResult[1].data.status) {
          setOpen(false);
          getAll();
          return sendAlert("Acessório editado com sucesso", "success");
        }
        sendAlert("Erro ao tentar editar acessório", "warning");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log(axiosError);
      setLoading(false);
      sendAlert("Erro ao tentar editar acessório", "warning");
    }
  };

  const edit = (values: DeliveryListProps) => {
    setEditValues(values);
    setOpen(true);
  };

  useEffect(() => {
    getAll();
  }, []);
  return (
    <>
      <Preload visible={loading} />
      <Alert
        visibility={showAlert}
        message={messageAlert}
        typeAlert={typeAlert}
        setVisibility={setShowAlert}
      />
      <ButtonContainer>
        <Button
          type="primary"
          onClick={() => {
            setEditValues(undefined);
            setOpen(true);
          }}
        >
          Adicionar
        </Button>
        <Tooltip
          placement="right"
          title={
            "Os acessórios de cadastrados serão exibidos no cadastro do entregador, caso esteja ativo."
          }
        >
          <IoMdInformationCircle style={{ fontSize: 20 }} />
        </Tooltip>
      </ButtonContainer>
      <AccessoriesTable
        getAll={getAll}
        setTableLoading={setTableLoading}
        tableLoading={tableLoading}
        sendAlert={sendAlert}
        loadingText={loadingText}
        accessoriesList={accessoriesList}
        edit={edit}
      />
      <AccessoriesModal
        title={editValues ? "Editar" : "Adicionar"}
        open={open}
        onCancel={() => setOpen(false)}
        onFinish={onFinish}
        editValues={editValues}
      />
    </>
  );
};

export default DeliveryAccessories;
