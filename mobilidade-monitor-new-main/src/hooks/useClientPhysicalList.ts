import { useState, useEffect, useContext, useCallback } from "react";
import { SelectValue } from "antd/lib/select";
import swal from "sweetalert";
import api from "../services/api";
import { runConfirmedAction } from "../utils/confirmedAction";
import AuthContext from "../contexts/auth";
import { CLIENTE } from "../constants/permissions";
import { Constants } from "@/utils/constants";
import { ListClient } from "../components/Client/PhysicalPerson/Modal/Edition/type";
import {
  DependentsClientData,
  StatusToSearchInterface,
  ListClientFormProps,
  ClientPhysicalSearchBy,
  GeneralInterface,
} from "../pages/Client/Physical/types";
import { useClientPhysicalSearch } from "./useClientPhysicalSearch";
import { handleValidateRegistration } from "../utils/validateRegistration";

export interface UseClientPhysicalListReturn {
  // Filter
  infosListClient: ListClient[] | undefined;
  filterLoading: boolean;
  hasPagination: boolean;
  filters: { search: string; radio: ClientPhysicalSearchBy };
  setSearch: (value: string) => void;
  setRadio: (value: ClientPhysicalSearchBy) => void;
  setStatus: (value: SelectValue) => void;
  onSearch: (page?: number) => void;
  fetchMore: () => void;

  // Page data
  StatusToSearch: StatusToSearchInterface | undefined;
  whatsappMessage: string;
  baseImageCustomer: string;
  isMilitary: boolean;
  canDeletePhysicalClient: boolean;
  dependentsClient: DependentsClientData;
  annotations: string;
  setAnnotations: (v: string) => void;

  // Loading
  loading: boolean;
  setLoading: (v: boolean) => void;

  // Alert
  showAlert: boolean;
  setShowAlert: (v: boolean) => void;
  messageAlert: string;
  typeAlert: "success" | "info" | "warning" | "error";

  // Modal state
  isModalVisible: boolean;
  voucherModal: boolean;
  setVoucherModal: (v: boolean) => void;
  documentsVisible: boolean;
  modalOfDependents: boolean;
  annotationsModal: boolean;
  customer: ListClientFormProps | ListClient | undefined;
  customerEdit: ListClientFormProps | undefined;
  userId: number;
  customerId: number;

  // Actions
  showModal: (item: ListClientFormProps | ListClient) => void;
  showVoucherModal: (item: ListClientFormProps | ListClient) => void;
  showAnnotationsModal: (item: ListClientFormProps | ListClient) => void;
  openDocuments: (item: ListClient) => void;
  handleCancel: () => void;
  blockClient: (id: number, clientStatus: string) => void;
  resetPassword: (id: number) => void;
  annotationsClient: (idUser: number) => void;
  deleteClient: (idUser: number) => void;
  clientsDependents: (idCustomer: number) => void;
  validateCustomerRegistration: (idCustomer: number) => void;
  canEditPhysicalClient: boolean;
}

export function useClientPhysicalList(): UseClientPhysicalListReturn {
  const { hasPermission } = useContext(AuthContext);

  const {
    infosListClient,
    loading: filterLoading,
    hasPagination,
    filters,
    setSearch,
    setRadio,
    setStatus,
    onSearch,
    fetchMore,
  } = useClientPhysicalSearch();

  const [loading, setLoading] = useState(false);
  const [StatusToSearch, setStatusToSearch] = useState<StatusToSearchInterface>();
  const [dependentsClient, setDependentsClient] = useState<DependentsClientData>([]);
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [isMilitary, setIsMilitary] = useState(false);
  const [annotations, setAnnotations] = useState("");

  const [customer, setCustomer] = useState<ListClientFormProps | ListClient>();
  const [userId, setUserId] = useState(0);
  const [customerId, setCustomerId] = useState(0);
  const [customerEdit, setCustomerEdit] = useState<ListClientFormProps>();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [voucherModal, setVoucherModal] = useState(false);
  const [documentsVisible, setDocumentsVisible] = useState(false);
  const [modalOfDependents, setModalOfDependents] = useState(false);
  const [annotationsModal, setAnnotationsModal] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [typeAlert, setTypeAlert] = useState<"success" | "info" | "warning" | "error">("success");

  const canDeletePhysicalClient = hasPermission(CLIENTE, "excluir");
  const canEditPhysicalClient = hasPermission(CLIENTE, "editar");
  const baseImageCustomer = Constants.url_photo_customer;

  useEffect(() => {
    api.get("config/whatsapp_message_client")
      .then((message) => {
        if (message.data?.status) {
          setWhatsappMessage(message.data.response);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setIsMilitary(hasPermission(CLIENTE, "filtro_militar"));
  }, [hasPermission]);

  useEffect(() => {
    api.get("customerRegisterStatus")
      .then((values) => {
        if (values.data?.status) {
          setStatusToSearch(values.data.response);
        }
      })
      .catch(() => {});
  }, [hasPermission]);

  const showAlert_ = useCallback(
    (message: string, type: "success" | "info" | "warning" | "error") => {
      setMessageAlert(message);
      setTypeAlert(type);
      setShowAlert(true);
    },
    []
  );

  const showModal = useCallback((item: ListClientFormProps | ListClient) => {
    setIsModalVisible(true);
    setCustomerEdit(item as ListClientFormProps);
  }, []);

  const showVoucherModal = useCallback((item: ListClientFormProps | ListClient) => {
    setVoucherModal(true);
    setCustomer(item as ListClientFormProps);
    setCustomerEdit(item as ListClientFormProps);
  }, []);

  const showAnnotationsModal = useCallback((item: ListClientFormProps | ListClient) => {
    setAnnotationsModal(true);
    setCustomer(item as ListClientFormProps);
    setAnnotations(item.observation as string);
  }, []);

  const openDocuments = useCallback((item: ListClient) => {
    setUserId(item.idUser);
    setCustomerId(item.idCustomer);
    setCustomer(item as unknown as ListClientFormProps);
    setDocumentsVisible(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsModalVisible(false);
    setVoucherModal(false);
    setAnnotationsModal(false);
    setModalOfDependents(false);
    setDocumentsVisible(false);
  }, []);

  const blockClient = useCallback(
    (idCostomer: number, clientStatus: string) => {
      swal({
        title: `Você realmente deseja ${clientStatus === "ATIVO" ? "bloquear" : "desbloquear"} esse cliente?`,
        icon: "warning",
        buttons: ["Cancelar", "Confirmar"],
        dangerMode: true,
      }).then((confirmed: boolean) => {
        if (!confirmed) return;
        setLoading(true);
        if (clientStatus === "ATIVO") {
          api.post<GeneralInterface>(`customer/${idCostomer}/block`, {}).then((res) => {
            setLoading(false);
            if (res.data.status) {
              showAlert_("Usuário bloqueado com sucesso!", "success");
              onSearch();
            } else {
              showAlert_("Erro ao tentar bloquear conta!", "error");
            }
          });
        } else {
          api.put(`customer/${idCostomer}/unlock`, {}).then((res) => {
            setLoading(false);
            if (res.data.status) {
              showAlert_("Usuário desbloqueado com sucesso!", "success");
              onSearch();
            } else {
              showAlert_("Erro ao tentar desbloquear conta!", "error");
            }
          });
        }
      });
    },
    [onSearch, showAlert_]
  );

  const resetPassword = useCallback(
    (idCostomer: number) => {
      swal({
        title: "Você realmente deseja resetar a senha deste usuário para (123456)?",
        text: "Essa ação é irreversível",
        icon: "warning",
        buttons: ["Cancelar", "Confirmar"],
        dangerMode: true,
      }).then((confirmed: boolean) => {
        if (!confirmed) return;
        setLoading(true);
        api.put(`customer/${idCostomer}`, { idCostumer: idCostomer, password: "123456" }).then((res) => {
          setLoading(false);
          if (res.data.status) {
            showAlert_("Senha resetada com sucesso!", "success");
            onSearch();
          } else {
            showAlert_("Erro ao tentar redefinir senha!", "error");
          }
        });
      });
    },
    [onSearch, showAlert_]
  );

  const annotationsClient = useCallback(
    (idUser: number) => {
      if (!annotations || annotations.trim() === "") {
        showAlert_("Insira algo no campo", "error");
        return;
      }
      setLoading(true);
      api.put(`user/${idUser}/observation`, { observation: annotations })
        .then((res) => {
          setLoading(false);
          if (res.data.status) {
            showAlert_("Anotação inserida com sucesso!", "success");
            onSearch();
            setAnnotationsModal(false);
          } else {
            showAlert_("Erro, tente novamente!", "error");
            setAnnotationsModal(false);
          }
        })
        .catch(() => {
          setLoading(false);
          showAlert_("Erro, tente novamente!", "error");
          setAnnotationsModal(false);
        });
    },
    [annotations, onSearch, showAlert_]
  );

  const deleteClient = useCallback(
    async (idUser: number) => {
      try {
        const res = await runConfirmedAction(
          {
            title: "Você realmente deseja excluir esse usuário?",
            text: "Essa ação é irreversível",
          },
          setLoading,
          () => api.delete(`user/${idUser}`)
        );
        if (!res) return;

        if (res.data.status) {
          showAlert_("Usuário excluído com sucesso!", "success");
          onSearch();
        } else {
          showAlert_("Erro ao tentar excluir", "error");
        }
      } catch (error) {
        console.error(error);
        showAlert_("Erro ao tentar excluir", "error");
      }
    },
    [onSearch, showAlert_]
  );

  const clientsDependents = useCallback((idCustomer: number) => {
    setLoading(true);
    api.get(`customer/${idCustomer}`).then((res) => {
      setLoading(false);
      if (res.data.response.dependents.length !== 0) {
        setDependentsClient(res.data.response.dependents);
        setModalOfDependents(true);
      } else {
        swal("Não há dependentes para esse usuário", "", "info");
      }
    });
  }, []);

  const validateCustomerRegistration = useCallback(
    (idCustomer: number) => {
      handleValidateRegistration(
        idCustomer,
        "customer",
        (message) => {
          setMessageAlert(message);
          setTypeAlert("success");
          setShowAlert(true);
          onSearch();
        },
        (message) => {
          setMessageAlert(message);
          setTypeAlert("error");
          setShowAlert(true);
        },
        setLoading
      );
    },
    [onSearch]
  );

  return {
    infosListClient,
    filterLoading,
    hasPagination,
    filters: { search: filters.search, radio: filters.radio },
    setSearch,
    setRadio,
    setStatus,
    onSearch,
    fetchMore,
    StatusToSearch,
    whatsappMessage,
    baseImageCustomer,
    isMilitary,
    canDeletePhysicalClient,
    canEditPhysicalClient,
    dependentsClient,
    annotations,
    setAnnotations,
    loading,
    setLoading,
    showAlert,
    setShowAlert,
    messageAlert,
    typeAlert,
    isModalVisible,
    voucherModal,
    setVoucherModal,
    documentsVisible,
    modalOfDependents,
    annotationsModal,
    customer,
    customerEdit,
    userId,
    customerId,
    showModal,
    showVoucherModal,
    showAnnotationsModal,
    openDocuments,
    handleCancel,
    blockClient,
    resetPassword,
    annotationsClient,
    deleteClient,
    clientsDependents,
    validateCustomerRegistration,
  };
}
