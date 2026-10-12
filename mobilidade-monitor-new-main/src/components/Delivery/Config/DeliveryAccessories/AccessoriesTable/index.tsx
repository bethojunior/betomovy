import { AxiosError } from "axios";
import { FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import swal from "sweetalert";
import { Image, Table, Switch } from "antd";
import { DeliveryListProps } from "../../../../../pages/Delivery/Config/DeliveryAccessories/types";
import api from "../../../../../services/api";
import { AccessoriesTableProps } from "./types";

const AccessoriesTable = ({
  getAll,
  setTableLoading,
  tableLoading,
  sendAlert,
  loadingText,
  accessoriesList,
  edit,
}: AccessoriesTableProps) => {
  const deleteItem = (id: number) => {
    swal({
      title: "Atenção",
      text: "Deseja excluir este acessório?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then(async (res) => {
      if (res) {
        try {
          setTableLoading(true);
          const result = await api.delete(`driverAttachmentType/${id}`);
          const { data } = result;
          if (data?.status) {
            sendAlert("Acessório excluido com sucesso", "success");
            return getAll();
          }
          sendAlert("Erro ao tentar excluir essa acessório", "warning");
        } catch (error) {
          const axiosError = error as AxiosError;
          console.log(axiosError);
          sendAlert("Erro ao tentar excluir essa acessório", "warning");
          setTableLoading(false);
        }
      }
    });
  };

  const enableOrDesable = async (e: boolean, id: number) => {
    try {
      setTableLoading(true);
      const result = await api.put(
        `driverAttachmentType/${id}/${e ? "enable" : "disable"}`
      );
      setTableLoading(false);
      const { data } = result;
      if (data.status) {
        return sendAlert(
          `Acessório ${e ? "ativado" : "desativado"} com sucesso`,
          "success"
        );
      }
      sendAlert(`Erro ao ${e ? "ativar" : "desativar"} acessório`, "warning");
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log(axiosError);
      setTableLoading(false);
      sendAlert(`Erro ao ${e ? "ativar" : "desativar"} acessório`, "warning");
    }
  };

  const columns = [
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      render: (logo: string) => {
        return <Image width={50} height={50} src={logo} />;
      },
    },
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Ativar",
      dataIndex: "active",
      key: "active",
      render: (item: DeliveryListProps) => {
        return (
          <Switch
            onChange={(e) => enableOrDesable(e, item.id)}
            defaultChecked={Boolean(item.active)}
          />
        );
      },
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      render: (item: DeliveryListProps) => (
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <div
            style={{
              width: 100,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <MdEdit
              onClick={() => edit(item)}
              style={{ fontSize: 20, cursor: "pointer" }}
            />
            <FaTrashAlt
              onClick={() => deleteItem(item.id)}
              style={{ color: "red", fontSize: 20, cursor: "pointer" }}
            />
          </div>
        </div>
      ),
    },
  ];

  const tableData = (Array.isArray(accessoriesList) ? accessoriesList : []).map((item: DeliveryListProps) => {
    return {
      logo: item.picture,
      key: item.id,
      name: item.name,
      description: item.description,
      active: item,
      actions: item,
    };
  });

  let locale = {
    emptyText: loadingText,
  };

  return (
    <Table
      dataSource={tableData}
      columns={columns}
      loading={tableLoading}
      pagination={false}
      locale={locale}
      scroll={{ x: 500 }}
    />
  );
};

export default AccessoriesTable;
