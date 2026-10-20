import { Button, Modal, Switch, Table } from "antd";
import { useEffect, useState } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import {
  Container,
  ContentBtnActions,
  ContentTable,
  DeleteActionButton,
  DriverLogoImage,
  EditActionButton,
  NewTypeDriverButton,
  TransferDriverTypeSelect,
} from "./styles";
import {
  DRIVER_STATUS_ERROR_MESSAGE,
  DRIVER_STATUS_LOAD_ERROR_MESSAGE,
  DRIVER_STATUS_SUCCESS_MESSAGE,
  LOAD_INFORMATION_ERROR_MESSAGE,
} from "./constants";
import { Driver, Icon, ITypeDriverProps, TypeDriver as TypeDriverRow } from "./types";
import { useDriverTypeActions } from "./useDriverTypeActions";
import api from "../../../../../../services/api";
import Alert from "../../../../../Utils/Alert";
import DriverTypeModal from "../../Modal/DriverType";

const TypeDriver = ({ optionsAppPartners }: ITypeDriverProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [messageAlert, setMessageAlert] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [typeAlert, setTypeAlert] = useState<"success" | "info" | "warning" | "error">(
    "success",
  );
  const [driver, setDriver] = useState<Driver[]>([]);
  const [typeDriverSelected, setTypeDriverSelected] = useState<Driver>();
  const [titleModal, setTitleModal] = useState<string>("Editar tipo");
  const [typeModal, setTypeModal] = useState<string>("");
  const [driverTypeModal, setDriverTypeModal] = useState<boolean>(false);
  const [iconDriver, setIconDriver] = useState<Icon[]>([]);

  const showFeedback = (
    message: string,
    alertType: "success" | "info" | "warning" | "error",
  ): void => {
    setMessageAlert(message);
    setTypeAlert(alertType);
    setShowAlert(true);
  };

  const loadInformation = async (): Promise<void> => {
    setLoading(true);
    try {
      const [driversRes, iconsRes] = await Promise.allSettled([
        api("userType/drivers"),
        api("iconMapDriver"),
      ]);

      if (driversRes.status === "fulfilled" && driversRes.value?.data?.status) {
        const d = driversRes.value.data.response ?? driversRes.value.data.data ?? [];
        setDriver(Array.isArray(d) ? d : []);
      }

      if (iconsRes.status === "fulfilled" && iconsRes.value?.data?.status) {
        const ic = iconsRes.value.data.response ?? iconsRes.value.data.data ?? [];
        setIconDriver(Array.isArray(ic) ? ic : []);
      }
    } catch {
      showFeedback(LOAD_INFORMATION_ERROR_MESSAGE, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInformation();
  }, []);

  const {
    availableDriverTypes,
    deleteTypeDriver,
    driverTypeTransferId,
    moveUsersAndDeleteTypeDriver,
    resetTransferState,
    setDriverTypeTransferId,
    showTransferDriversModal,
  } = useDriverTypeActions({
    driver,
    setLoading,
    showFeedback,
    reloadData: loadInformation,
  });

  const editTypeDriver = (id: number): void => {
    setTypeDriverSelected(driver.find((el) => el.idUserType === id));
    setDriverTypeModal(true);
    setTypeModal("edit");
    setTitleModal("Editar tipo de motorista");
  };

  const updateStatusDriverType = (status: boolean, id: number): void => {
    setLoading(true);
    const type = status ? "enable" : "disable";
    api
      .put(`userType/${id}/${type}`)
      .then((result) => {
        if (!result.data.status) {
          setLoading(false);
          showFeedback(DRIVER_STATUS_ERROR_MESSAGE, "error");
          return;
        }
        api("userType/drivers")
          .then((response) => {
            setLoading(false);
            if (!response.data.status) {
              showFeedback(DRIVER_STATUS_LOAD_ERROR_MESSAGE, "error");
              return;
            }
            setDriver(response.data.response);
            showFeedback(DRIVER_STATUS_SUCCESS_MESSAGE, "success");
          })
          .catch(() => {
            setLoading(false);
            showFeedback(DRIVER_STATUS_LOAD_ERROR_MESSAGE, "error");
          });
      })
      .catch(() => {
        setLoading(false);
        showFeedback(DRIVER_STATUS_ERROR_MESSAGE, "error");
      });
  };

  const renderDriverTypeDescription = (record: TypeDriverRow) => {
    return (
      <>
        <div>{record?.name}</div>
        <div>ID:{record?.idUserType}</div>
      </>
    );
  };

  const columnsDriverType = [
    {
      title: "Logo",
      dataIndex: "picture",
      key: "picture",
      render: (item: string) => <DriverLogoImage src={item} alt="logo" />,
    },
    {
      title: "Descrição",
      dataIndex: "name",
      key: "name",
      render: (_value: unknown, record: TypeDriverRow) =>
        renderDriverTypeDescription(record),
    },
    {
      title: "Veículo",
      dataIndex: "vehicleType",
      key: "vehicleType",
      render: (value: string | null | undefined) => {
        const normalizedValue = String(value || "")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();
        return normalizedValue === "bike" ? "Moto" : "Carro";
      },
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (item: number, key: Driver) => {
        return <Switch checked={!!item} onChange={(value) => updateStatusDriverType(value, key.idUserType)} />;
      },
    },
    {
      title: "Ações",
      dataIndex: "idUserType",
      key: "idUserType",
      render: (id: number) => {
        return (
          <ContentBtnActions>
            <EditActionButton type="link" onClick={() => editTypeDriver(id)} icon={<AiFillEdit />} />
            <DeleteActionButton
              type="link"
              onClick={() => deleteTypeDriver(id)}
              icon={<AiFillDelete />}
            />
          </ContentBtnActions>
        );
      },
    },
  ];

  return (
    <Container>
      <Alert
        visibility={showAlert}
        message={messageAlert}
        typeAlert={typeAlert}
        setVisibility={setShowAlert}
      />
      <NewTypeDriverButton
        onClick={() => {
          setDriverTypeModal(true);
          setTypeModal("create");
          setTitleModal("Criar novo tipo de motorista");
        }}
        type="primary"
      >
        Novo tipo de motorista
      </NewTypeDriverButton>
      <ContentTable>
        <Table
          dataSource={driver}
          columns={columnsDriverType}
          rowKey="idUserType"
          pagination={false}
          loading={loading}
        />
      </ContentTable>
      <DriverTypeModal
        visibility={driverTypeModal}
        setVisibility={setDriverTypeModal}
        titleModal={titleModal}
        icon={iconDriver}
        loadInformation={loadInformation}
        driverSelected={typeDriverSelected}
        typeModal={typeModal}
        optionsAppPartners={optionsAppPartners}
      />
      <Modal
        title="Selecione o novo tipo de motorista"
        centered
        open={showTransferDriversModal}
        onCancel={resetTransferState}
        footer={[
          <Button key="cancel" onClick={resetTransferState}>
            NÃO!
          </Button>,
          <Button key="confirm" type="primary" onClick={moveUsersAndDeleteTypeDriver}>
            SIM!
          </Button>,
        ]}
      >
        <TransferDriverTypeSelect
          value={driverTypeTransferId ?? undefined}
          placeholder="Selecionar"
          onChange={(value) => setDriverTypeTransferId(Number(value))}
          options={availableDriverTypes.map((item) => ({
            label: item.name,
            value: item.idUserType,
          }))}
        />
      </Modal>
    </Container>
  );
};

export default TypeDriver;
