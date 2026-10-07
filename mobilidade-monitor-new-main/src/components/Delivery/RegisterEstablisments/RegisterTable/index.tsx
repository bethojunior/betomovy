import { Button, Image, Table } from "antd";
import { MdEdit } from "react-icons/md";
import { RegisterTableProps } from "./types";
import { EstablishmentsProps } from "../../../../pages/Delivery/RegisterEstablishments/types";
import Mask from "../../../../services/Mask";
import { theme_colors } from "../../../../theme/theme";

const RegisterTable = ({
  tableLoading,
  loadingText,
  listEstablishments,
  openLocals,
  changeStatus,
  openModalEdit,
}: RegisterTableProps) => {
  const columns = [
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      render: (logo: string) => <Image width={60} height={60} src={logo} />,
    },
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "CNPJ",
      dataIndex: "cnpj",
      key: "cnpj",
      render: (document: string) => (
        <span>{Mask.setMaskCPFCNPJ(document)}</span>
      ),
    },
    {
      title: "Delivery",
      dataIndex: "delivery",
      key: "delivery",
      render: (item: EstablishmentsProps) => (
        <Button
          style={{
            backgroundColor: item.releaseDelivery
              ? theme_colors.green
              : theme_colors.red_crismon,
            color: theme_colors.white,
          }}
          onClick={() => changeStatus(item, false)}
        >
          {item.releaseDelivery ? "Ativado" : "Desativado"}
        </Button>
      ),
    },
    {
      title: "Menu",
      dataIndex: "menu",
      key: "menu",
      render: (item: EstablishmentsProps) => (
        <Button
          style={{
            backgroundColor: item.releaseMenu
              ? theme_colors.green
              : theme_colors.red_crismon,
            color: theme_colors.white,
          }}
          onClick={() => changeStatus(item, true)}
        >
          {item.releaseMenu ? "Ativado" : "Desativado"}
        </Button>
      ),
    },
    {
      title: "",
      dataIndex: "locais",
      key: "locais",
      render: (companyId: number) => (
        <Button type="link" onClick={() => openLocals(companyId)}>
          Locais
        </Button>
      ),
    },
    {
      title: "",
      dataIndex: "edit",
      key: "edit",
      render: (item: EstablishmentsProps) => (
        <MdEdit
          onClick={() => openModalEdit(item)}
          style={{ fontSize: 20, cursor: "pointer" }}
        />
      ),
    },
  ];

  const tableData = listEstablishments.map((item) => {
    return {
      key: item.id,
      logo: item.picture,
      name: item.company.name,
      cnpj: item.company.document,
      delivery: item,
      menu: item,
      locais: item.companyId,
      edit: item,
    };
  });

  let locale = {
    emptyText: loadingText,
  };

  return (
    <Table
      rowKey={(item) => item.key}
      dataSource={tableData}
      columns={columns}
      loading={tableLoading}
      pagination={false}
      locale={locale}
      scroll={{ x: 600 }}
    />
  );
};

export default RegisterTable;
