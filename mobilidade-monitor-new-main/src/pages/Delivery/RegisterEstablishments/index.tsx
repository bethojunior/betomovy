import { useEffect, useState } from "react";
import RegisterTable from "../../../components/Delivery/RegisterEstablisments/RegisterTable";
import { AlertType } from "../Config/Sections/types";
import { Button } from "antd";
import { AxiosError } from "axios";
import api from "../../../services/api";
import Alert from "../../../components/Utils/Alert";
import Preload from "../../../components/Utils/Preload";
import {
  EstablishmentsProps,
  FantasyNameProps,
  Listlocals,
  OnSaveProps,
  PerfilProps,
  SelectProps,
} from "./types";
import RegisterModal from "../../../components/Delivery/RegisterEstablisments/RegisterModal";
import Session from "../../../utils/Session";
import { useDebounce } from "../../../hooks/useDebounce";
import LocalsModal from "../../../components/Delivery/RegisterEstablisments/LocalsModal";
import swal from "sweetalert";
import { resizeLogo } from "../../../hooks/resizeLogo";

const RegisterEstablishments = () => {
  const [loading, setLoading] = useState(false);
  const [listEstablishments, setListEstablishments] = useState<
    EstablishmentsProps[]
  >([]);
  const [listPerfil, setListPerfil] = useState<PerfilProps[]>([]);
  const [listFantasyName, setListFantasyName] = useState<SelectProps[]>([]);
  const [listLocals, setListLocals] = useState<Listlocals[]>([]);

  const [tableLoading, setTableLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Procurando...");
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [typeAlert, setTypeAlert] = useState<AlertType>("warning");

  const [open, setOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Cadastro");
  const [editValues, setEditValues] = useState<EstablishmentsProps | undefined>(
    undefined
  );

  const [openLocalsModal, setOpenLocalsModal] = useState(false);
  const [placeSelected, setPlaceSelected] = useState<any>({});
  const [companyId, setCompanyId] = useState(0);
  const [isDefault, setIsDefault] = useState(false);

  const cityId = Session.getLocal("citySelected")?.cityId;

  const sendAlert = (message: string, type: AlertType) => {
    setMessageAlert(message);
    setTypeAlert(type);
    setShowAlert(true);
  };

  const validationFile = (file: File) => {
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

  const onSave = async (values: OnSaveProps) => {
    try {
      const imgResized =
        values.picture && (await validationFile(values.picture.file as File));
      if (!imgResized && values?.picture) return;

      if (!values.perfil)
        return sendAlert("Campo perfil é obrigatório", "warning");
      const formData = new FormData();
      formData.append("companyId", values.companyId);
      formData.append("releaseDelivery", values.releaseDelivery ? "1" : "0");
      formData.append("releaseMenu", values.releaseMenu ? "1" : "0");
      formData.append("establishmentCollectionManagementId", values.perfil);
      values?.picture && formData.append("picture", imgResized as File);

      setLoading(true);
      const result = await api.post("companyDeliveryConfig", formData);
      setLoading(false);
      const { data } = result;
      if (data.status) {
        setOpen(false);
        sendAlert("Estabelecimento criado com sucesso", "success");
        return getAll();
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(axiosError.request);
      setLoading(false);
      let errorMsg = "Erro ao criar estabelecimento";
      try {
        if (axiosError?.response?.data?.message) {
          errorMsg = axiosError.response.data.message;
        } else if (axiosError?.request?.responseText) {
          const parsed = JSON.parse(axiosError.request.responseText);
          if (parsed?.response?.[0]) errorMsg = parsed.response[0];
        }
      } catch {}
      sendAlert(errorMsg, "warning");
    }
  };

  const onEdit = async (values: any) => {
    const imgResized =
      values.picture && (await validationFile(values.picture.file as File));
    if (!imgResized && values?.picture) return;

    if (values?.picture?.file.status == "removed")
      return sendAlert(
        "Não é possivel editar um estabelecimento sem foto",
        "warning"
      );

    const formData = new FormData();
    formData.append("releaseDelivery", values.releaseDelivery ? "1" : "0");
    formData.append("releaseMenu", values.releaseMenu ? "1" : "0");
    formData.append("establishmentCollectionManagementId", values.perfil);
    values?.picture && formData.append("picture", imgResized as File);

    try {
      setLoading(true);
      const result = await api.post(
        `companyDeliveryConfig/company/${values.companyId.value}`,
        formData
      );
      setLoading(false);

      const { data } = result;
      if (data.status) {
        setOpen(false);
        sendAlert("Estabalecimento editado com sucesso", "success");
        return getAll();
      }
      sendAlert("Erro ao tentar editar o stabalecimento", "warning");
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(axiosError.request);
      let errorMsg = "Erro ao tentar editar o estabelecimento";
      try {
        if (axiosError?.response?.data?.message) {
          errorMsg = axiosError.response.data.message;
        } else if (axiosError?.request?.responseText) {
          const parsed = JSON.parse(axiosError.request.responseText);
          if (parsed?.response?.[0]) errorMsg = parsed.response[0];
        }
      } catch {}
      sendAlert(errorMsg, "warning");
      setLoading(false);
    }
  };

  const getAll = async () => {
    try {
      setTableLoading(true);
      const result = await api.get("companyDeliveryConfig/company");
      const { data } = result;
      setTableLoading(false);
      if (data?.status) {
        setListEstablishments(data.response);
      }
      if (data.response.length === 0) {
        setLoadingText("Nenhum estabelecimento encontrado");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      setTableLoading(false);
      sendAlert("Erro ao listar categorias estabelecimentos", "error");
      console.error(axiosError);
    }
  };

  const loadOptions = useDebounce((inputValue: string) => {
    getFantasyName(inputValue);
  }, 500);

  const onSearch = (userSearch: string) => {
    loadOptions(userSearch);
  };

  const getFantasyName = async (name: string) => {
    try {
      setLoadingText("Procurando...");
      const result = await api.get(
        `company?cityId=${cityId}&fantasyName=${name}`
      );
      const { data } = result;
      if (data?.status) {
        const responseFilterFormated = data.response.map(
          (result: FantasyNameProps) => ({
            value: result.id,
            label: result.fantasyName,
          })
        );
        setListFantasyName(responseFilterFormated);
      }
      if (data.response.length == 0) {
        setLoadingText("Nenhum encontrado");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      setLoadingText("Nenhum encontrado");
      sendAlert("Erro ao listar nomes", "error");
      console.error(axiosError);
    }
  };

  const getPerfil = async () => {
    try {
      const result = await api.get("establishmentCollectionManagement");
      const { data } = result;
      if (data?.status) {
        setListPerfil(data.response);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      sendAlert("Erro ao listar perfis", "error");
      console.error(axiosError);
    }
  };

  const openModalEdit = (values: EstablishmentsProps) => {
    setEditValues(values);
    setOpen(true);
    setModalTitle("Editar");
  };

  const openLocals = async (companyId: number) => {
    try {
      setLoading(true);
      const result = await api.get(`companyAddress?companyId=${companyId}`);
      setLoading(false);
      const { data } = result;

      if (data.status) {
        setCompanyId(companyId);
        setListLocals(data.response);
        setOpenLocalsModal(true);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(axiosError);
      setLoading(false);
      setOpenLocalsModal(false);
      sendAlert("Erro ao buscar locais", "warning");
    }
  };

  const updatePrimaryLocal = (id: number, companyId: number) => {
    swal({
      title: "Selecionar como principal?",
      text: "",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then(async (res) => {
      if (res) {
        try {
          setLoading(true);
          const result = await api.put(`companyAddress/${id}`);
          setLoading(false);
          const { data } = result;

          if (data.status) {
            sendAlert("Local alterado com sucesso", "success");
            return openLocals(companyId);
          }

          sendAlert("Erro ao alterar local", "warning");
        } catch (error) {
          const axiosError = error as AxiosError;
          console.error(axiosError);
          setLoading(false);
          setOpenLocalsModal(false);
          sendAlert("Erro ao alterar local", "warning");
        }
      }
    });
  };

  const deleteLocal = (id: number, companyId: number) => {
    swal({
      title: "Atenção",
      text: "Deseja excluir esse local?",
      icon: "info",
      buttons: ["Não", "Sim"],
      dangerMode: true,
    }).then(async (res) => {
      if (res) {
        try {
          setLoading(true);
          const result = await api.delete(`companyAddress/${id}`);
          setLoading(false);
          const { data } = result;

          if (data.status) {
            sendAlert("Local excluido com sucesso", "success");
            return openLocals(companyId);
          }

          sendAlert("Erro ao excluir local", "warning");
        } catch (error) {
          const axiosError = error as AxiosError;
          console.error(axiosError);
          setLoading(false);
          sendAlert("Erro ao excluir local", "warning");
        }
      }
    });
  };

  const addLocal = async () => {
    try {
      if (!placeSelected.latitude) {
        return sendAlert("Selecione um endereço", "warning");
      }
      const payload = {
        address: placeSelected.address,
        companyId: companyId,
        isDefault,
        latitude: placeSelected.latitude,
        longitude: placeSelected.longitude,
      };
      setLoading(true);
      const result = await api.post("companyAddress", payload);
      setLoading(false);

      const { data } = result;
      if (data.status) {
        setIsDefault(false);
        sendAlert("Endereço inserido com sucesso", "success");
        return openLocals(companyId);
      }
      sendAlert("Erro ao tentar inserir endereço", "warning");
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(axiosError);
      sendAlert("Erro ao tentar inserir endereço", "warning");

      setLoading(false);
    }
  };

  const changeValues = (val: number) => {
    return val == 1 ? 0 : 1;
  };

  const changeStatus = async (values: EstablishmentsProps, isMenu: boolean) => {
    console.log(values);
    try {
      setLoading(true);
      const result = await api.post(
        `companyDeliveryConfig/company/${values.companyId}`,
        {
          releaseMenu: isMenu
            ? changeValues(values.releaseMenu)
            : values.releaseMenu,
          releaseDelivery: !isMenu
            ? changeValues(values.releaseDelivery)
            : values.releaseDelivery,
          establishmentCollectionManagementId:
            values.company.establishmentCollectionManagementId,
        }
      );
      setLoading(false);

      const { data } = result;
      if (data.status) {
        sendAlert("Sucesso ao alterar status", "success");
        return getAll();
      }
      sendAlert("Erro ao trocar status", "warning");
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(axiosError);
      sendAlert("Erro ao trocar status", "warning");
      setLoading(false);
    }
  };

  useEffect(() => {
    getAll();
    getPerfil();
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
      <Button
        style={{ marginBottom: 19 }}
        onClick={() => {
          setOpen(true);
          setEditValues(undefined);
          setModalTitle("Cadastrar");
        }}
        type="primary"
      >
        Cadastro de estabelecimento
      </Button>
      <RegisterTable
        tableLoading={tableLoading}
        listEstablishments={listEstablishments}
        loadingText={loadingText}
        openLocals={openLocals}
        changeStatus={changeStatus}
        openModalEdit={openModalEdit}
      />
      <RegisterModal
        title={modalTitle}
        open={open}
        onCancel={() => setOpen(false)}
        onSave={onSave}
        listPerfil={listPerfil}
        listFantasyName={listFantasyName}
        onSearch={onSearch}
        loadingText={loadingText}
        editValues={editValues}
        onEdit={onEdit}
      />
      <LocalsModal
        listLocals={listLocals}
        visibility={openLocalsModal}
        onCancel={() => setOpenLocalsModal(false)}
        updatePrimaryLocal={updatePrimaryLocal}
        deleteLocal={deleteLocal}
        loadingText={loadingText}
        setLoadingText={setLoadingText}
        setPlaceSelected={setPlaceSelected}
        addLocal={addLocal}
        setIsDefault={setIsDefault}
      />
    </>
  );
};

export default RegisterEstablishments;
