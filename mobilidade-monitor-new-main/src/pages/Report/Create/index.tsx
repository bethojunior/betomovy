import { Button, Collapse, List } from "antd";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { Content, CardReport, Pannel, Loader } from "./styles";
import Alert from "../../../components/Utils/Alert";
import CreateReportModal from "../Modal/CreateReport";
import Preload from "../../../components/Utils/Preload";

interface ReportNameArray extends Array<ReportName> {}

interface ReportName {
  id: number;
  name: string;
  reports: ReportsArray;
}

interface ReportsArray extends Array<Reports> {}

interface Reports {
  description: string;
  enablePdf: number;
  id: number;
  name: string;
  path: string;
  permission: string;
  reportTypeId: number;
  report_filters: ReportFiltersArray;
  statusId: number;
}

interface ReportFiltersArray extends Array<ReportFilters> {}

interface ReportFilters {
  field: string;
  fieldType: string;
  id: number;
  name: string;
  path_url: string;
  reportId: number;
  required: boolean;
  statusId: number;
}

const CreateReport = () => {
  const [loading, setLoading] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");

  const [typeReport, setTypeReport] = useState<ReportNameArray>([]);
  const [openModal, setOpenModal] = useState(false);
  const [itemSelected, setItemSelected] = useState<Reports>();

  useEffect(() => {
    setLoading(true);
    api("report?withType=1").then((result) => {
      setLoading(false);
      if (!result?.data?.status) {
        setMessageAlert(
          "Não foi possível carregar os relatórios, tente novamente"
        );
        setTypeAlert("error");
        return setShowAlert(true);
      }
      return setTypeReport(
        Array.isArray(result?.data?.response) ? result.data.response : []
      );
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const handleShowModal = (result: Reports) => {
    setItemSelected(result);
    setOpenModal(true);
  };

  if (loading) return <Loader spinning />;

  return (
    <Content>
      <Alert
        visibility={showAlert}
        
        setVisibility={setShowAlert}
        typeAlert={typeAlert}
        message={messageAlert}
      />
      <Preload visible={loading} />
      <CardReport>
        <List
          dataSource={typeReport}
          renderItem={(item) => (
            <List.Item>
              <Collapse ghost>
                <Pannel header={item.name} key={item.id}>
                  {(Array.isArray(item?.reports) ? item.reports : []).map((result) => {
                    return (
                      <Button
                        key={result?.id}
                        value={result?.id}
                        onClick={() => handleShowModal(result)}
                        type="link"
                      >
                        {result?.name}
                      </Button>
                    );
                  })}
                </Pannel>
              </Collapse>
            </List.Item>
          )}
        />
      </CardReport>
      <CreateReportModal
        visibility={openModal}
        setVisibility={setOpenModal}
        data={itemSelected}
        
      />
    </Content>
  );
};

export default CreateReport;
