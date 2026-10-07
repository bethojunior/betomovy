import { Button, Table } from "antd";
import { FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useEffect } from "react";
import { AxiosError } from "axios";
import api from "../../../../../services/api";
import { SectionsTableProps } from "./types";
import { EstablishmentsList } from "../../../../../pages/Delivery/Config/Establishments/types";
import swal from "sweetalert";

const EstablishmentsTable = ({
  getAll,
  listEstablishments,
  tableLoading,
  setTableLoading,
  loadingText,
  sendAlert,
  setEditValues,
  setOpen,
  setIsEdit,
  getSection,
}: SectionsTableProps) => {
  const deleteItem = (id: number) => {
    try {
      swal({
        title: "Atenção",
        text: "Deseja excluir esta categoria?",
        icon: "info",
        buttons: ["Não", "Sim"],
      }).then((res) => {
        if (res) {
          setTableLoading(true);
          api.delete(`typeDeliveryCategory/${id}`).then(({ data }) => {
            if (data?.status) {
              sendAlert("categoria excluida com sucesso", "success");
              return getAll();
            }
            sendAlert("Erro ao tentar excluir essa categoria", "warning");
          });
        }
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      sendAlert("Erro ao tentar excluir essa categoria", "warning");
      setTableLoading(false);
      console.log(axiosError);
    }
  };

  const columns = [
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
      title: "",
      dataIndex: "actions",
      key: "actions",
      render: (item: EstablishmentsList) => (
        <div
          style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
        >
          <div
            style={{
              width: 230,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <MdEdit
              onClick={() => {
                setEditValues(item), setOpen(true);
                setIsEdit(true);
              }}
              style={{ fontSize: 20, cursor: "pointer" }}
            />
            <FaTrashAlt
              onClick={() => deleteItem(item.id)}
              style={{ color: "red", fontSize: 20, cursor: "pointer" }}
            />
            <Button
              type="primary"
              onClick={() => {
                getSection(item.id);
              }}
            >
              Vincular seção
            </Button>
          </div>
        </div>
      ),
    },
  ];

  const tableData = listEstablishments.map((item) => {
    return {
      key: item.id,
      name: item.name,
      description: item.description,
      actions: item,
    };
  });

  let locale = {
    emptyText: loadingText,
  };

  useEffect(() => {
    getAll();
  }, []);
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

export default EstablishmentsTable;
