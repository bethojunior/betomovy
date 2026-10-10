import { Button, Select, Space, Table } from "antd";
import { FC, useEffect, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiDownload } from "react-icons/fi";
import { SelectValue } from "antd/lib/select";
import Alert from "../../../components/Utils/Alert";
import api from "../../../services/api";
import {
  Title,
  TableContent,
  Header,
  Section,
  SelectSearch,
  InputSearch,
  DoSearch,
  PaginationButton,
  ContentPagination,
  Loader,
} from "./styles";
import Preload from "../../../components/Utils/Preload";

const { Option } = Select;

interface ListReport {
  created_at: string;
  error: string;
  fileName: string;
  filters: {};
  id: string;
  link: string;
  reportId: number;
  reportName: string;
  status: string;
  updated_at: string;
}

interface ListTypeReportArray extends Array<ListTypeReport> {}

interface ListTypeReport {
  description: string;
  enablePdf: boolean;
  id: number;
  name: string;
  reportTypeId: number;
  statusId: number;
}

const statusReport = [
  {
    id: "pending",
    name: "Pendente",
  },
  {
    id: "in_process",
    name: "Em processo",
  },
  {
    id: "finished",
    name: "Finalizado",
  },

  {
    id: "error",
    name: "Com erro",
  },
];

const ListReport: FC = () => {
  const [loading, setLoading] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");

  const [listTypeReport, setListTypeReport] = useState<ListTypeReportArray>([]);
  const [visibilityTable, setVisibilityTable] = useState(false);
  const [statusSelected, setStatusSelected] = useState("" as SelectValue);
  const [typeReportSelected, setTypeReportSelected] = useState(
    "" as SelectValue
  );
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [listReport, setListReport] = useState<ListTypeReportArray>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);

  useEffect(() => {
    api("report?withType=0").then((result) => {
      if (!result?.data?.status) {
        return "";
      }

      return setListTypeReport(result.data.response || result.data.data || []);
    }).catch(() => {});
  }, []);

  const onSearch = (page = 1) => {
    setLoading(true);
    api(
      `reportRecord?page=${page}&status=${statusSelected}&reportId=${typeReportSelected}&dateStart=${dateStart}&dateEnd=${dateEnd}`
    ).then((result) => {
      setLoading(false);
      if (!result.data.status) {
        setMessageAlert("Não foi possível carregar a listagem de relatórios");
        setTypeAlert("error");
        return setShowAlert(true);
      }

      if (result.data.response.data.length === 0) {
        setMessageAlert(
          "Não existem relatórios correspondentes a sua pesquisa"
        );
        setTypeAlert("warning");
        setShowAlert(true);
        return setVisibilityTable(false);
      }

      setListReport(
        result.data.response.data.map((item: ListReport) => {
          return {
            name: item.reportName,
            created_at: new Date(item.created_at).toLocaleString(),
            status: statusReport.find((element) => element.id === item.status)
              ?.name,
            link: item.link,
          };
        })
      );
      setCurrentPage(result.data.response.current_page);
      setNextPage(result.data.response.next_page_url);
      return setVisibilityTable(true);
    });
  };

  const columns = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Data de criação",
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      ellipsis: true,
    },
    {
      key: "action",
      width: 50,
      ellipsis: true,
      render: (item: ListReport) => (
        <Space>
          {item.link && (
            <Button target="_blank" type="link" href={item.link}>
              <FiDownload />
            </Button>
          )}
        </Space>
      ),
    },
  ];

  if (loading) return <Loader spinning />;

  return (
    <div>
      <Preload visible={loading} />
      <Alert
        visibility={showAlert}
        setVisibility={setShowAlert}
        message={messageAlert}
        typeAlert={typeAlert}
      />
      <Header>
        <Section>
          <Title>Status</Title>
          <SelectSearch
            value={statusSelected}
            onChange={(e) => setStatusSelected(e as string)}
            defaultValue=""
          >
            <Option value="">Todos</Option>
            <Option value="pending">Pendente</Option>
            <Option value="in_process">Em processo</Option>
            <Option value="finished">Finalizado</Option>
            <Option value="error">Com erro</Option>
          </SelectSearch>
        </Section>
        <Section>
          <Title>Tipo de relatório</Title>
          <SelectSearch
            value={typeReportSelected}
            defaultValue="Todos"
            onChange={(e) => setTypeReportSelected(e as string)}
          >
            <Option value="">Todos</Option>
            {listTypeReport.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </SelectSearch>
        </Section>
        <Section>
          <Title>Data inicial</Title>
          <InputSearch
            value={dateStart}
            onChange={(e) => setDateStart(e.target.value)}
            type="date"
          />
        </Section>
        <Section>
          <Title>Data final</Title>
          <DoSearch
            type="date"
            value={dateEnd}
            onChange={(e) => setDateEnd(e.target.value)}
            onSearch={() => onSearch(1)}
            enterButton
          />
        </Section>
      </Header>
      <TableContent visible={visibilityTable}>
        <Table size="small" dataSource={listReport} columns={columns} />
        <ContentPagination>
          <PaginationButton
            icon={<FiArrowLeft />}
            onClick={() => {
              onSearch(currentPage - 1);
            }}
            disabled={currentPage === 1}
          />
          <PaginationButton
            onClick={() => {
              onSearch(currentPage + 1);
            }}
            icon={<FiArrowRight />}
            disabled={nextPage === null}
          />
        </ContentPagination>
      </TableContent>
    </div>
  );
};

export default ListReport;
