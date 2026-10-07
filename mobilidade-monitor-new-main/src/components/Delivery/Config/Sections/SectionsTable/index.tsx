import { Image, Table } from "antd";
import { FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useEffect } from "react";
import { AxiosError } from "axios";
import api from "../../../../../services/api";
import { SectionsTableProps } from "./types";
import { SectionsTableType } from "../../../../../pages/Delivery/Config/Sections/types";

const SectionsTable = ({
  getAll,
  listSections,
  tableLoading,
  setTableLoading,
  loadingText,
  sendAlert,
  setEditValues,
  setOpen,
  setIsEdit,
}: SectionsTableProps) => {
  const deleteItem = (id: number) => {
    try {
      setTableLoading(true);
      api.delete(`deliverySection/${id}`).then(({ data }) => {
        if (data?.status) {
          sendAlert("Seção excluida com sucesso", "success");
          return getAll();
        }
        sendAlert("Erro ao tentar excluir uma seção", "warning");
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      sendAlert("Erro ao tentar excluir uma seção", "warning");
      setTableLoading(false);
      console.log(axiosError);
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
      title: "",
      dataIndex: "actions",
      key: "actions",
      render: (item: SectionsTableType) => (
        <div
          style={{
            width: 100,
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
        </div>
      ),
    },
  ];

  const tableData = listSections.map((item) => {
    return {
      key: item.id,
      name: item.name,
      description: item.description,
      logo: item.icon,
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
    />
  );
};

export default SectionsTable;
