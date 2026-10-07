import { FC, useState } from "react";
import { Button, Modal, Radio, Checkbox } from "antd";
import api from "../../../../services/api";
import Select from "../../Input/Select";
import Select2 from "../../Input/Select2";
import Input from "../../Input/Input";
import Preload from "../../../../components/Utils/Preload";
import Alert from "../../../../components/Utils/Alert";
import { LabeledValue } from "antd/es/tree-select";

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

type ValueProps = string | number | any | LabeledValue | LabeledValue[];

interface SelectProps {
  [key: string]: ValueProps;
}
interface modalProps {
  visibility: boolean;
  setVisibility(visibility: boolean): void;
  data: Reports | undefined;
}

const CreateReportModal: FC<modalProps> = ({
  visibility,
  setVisibility,
  data,
}) => {
  const [loading] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");
  const [filters, setFilters] = useState({
    isPdf: "0",
    dateStart: "",
    dateEnd: "",
    tripPaymentFormId: "",
    tripCallTypeId: "",
    driverId: "",
    userId: "",
    cityId: "",
    status: "",
    tripTypeId: "",
    centralId: "",
  });
  const [typeReportExport, setTypeReportExport] = useState(0);
  const [hasDocument, setHasDocument] = useState(false);

  const handleCloseModal = () => {
    setVisibility(false);
    setFilters({
      isPdf: "0",
      dateStart: "",
      dateEnd: "",
      tripPaymentFormId: "",
      tripCallTypeId: "",
      driverId: "",
      userId: "",
      cityId: "",
      status: "",
      tripTypeId: "",
      centralId: "",
    });
    setTypeReportExport(0);
    setHasDocument(false);
  };

  const soliciteReport = () => {
    setMessageAlert("Seu relatório está sendo gerado...");
    setTypeAlert("success");
    setShowAlert(true);
    handleCloseModal();

    
    const hasDocumentParam = hasDocument ? "1" : "0";
    const url = `reportRecord?hasDocument=${hasDocumentParam}`;

    api
      .post(url, {
        filters: { ...filters, isPdf: typeReportExport, hasDocument: hasDocumentParam },
        reportId: data?.id,
      })
      .then((result) => {
        if (!result.data.status) {
          setMessageAlert("Não foi possível gerar seu relatório. Tente novamente.");
          setTypeAlert("error");
          return setShowAlert(true);
        }


      })
      .catch(() => {
        setMessageAlert("Erro ao tentar solicitar o relatório.");
        setTypeAlert("error");
        setShowAlert(true);
      });
  };




  return (
    <>
      <Preload visible={loading} />
      <Alert
        visibility={showAlert}
        setVisibility={setShowAlert}
        message={messageAlert}
        typeAlert={typeAlert}
      />
      <Modal
        title={data?.name}
        open={visibility}
        onCancel={handleCloseModal}
        footer={[
          <Button onClick={handleCloseModal}>Cancelar</Button>,
          <Button type="primary" onClick={soliciteReport}>
            Confirmar
          </Button>,
        ]}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {data?.report_filters.map((item) => {
            switch (item.fieldType) {
              case "select2": {
                return (
                  <Select2
                    key={`select2-${item.id}`}
                    item={item}
                    onChangeValue={(value, name) => {
                      const result: SelectProps = {
                        ...filters,
                      };
                      result[name] = value;
                      setFilters(result as any);
                    }}
                  />
                );
              }
              case "select": {
                return (
                  <Select
                    key={`select-${item.id}`}
                    item={item}
                    onChangeValue={(value, name) => {
                      const result: SelectProps = {
                        ...filters,
                      };
                      result[name] = value;
                      setFilters(result as any);
                    }}
                  />
                );
              }

              default: {
                return (
                  <Input
                    key={`input-${item.id}`}
                    item={item}
                    onChangeValue={(value, name) => {
                      const result: SelectProps = {
                        ...filters,
                      };
                      result[name] = value;
                      setFilters(result as any);
                    }}
                  />
                );
              }
            }
          })}
        </div>
        
        {data?.path === "report/all-customers" && (
          <div style={{ marginTop: 20, marginBottom: 10 }}>
            <Checkbox 
              checked={hasDocument}
              onChange={(e) => setHasDocument(e.target.checked)}
            >
              Filtrar por documentos
            </Checkbox>
          </div>
        )}
        
        <div style={{ marginTop: 10, marginBottom: -10 }}>
          <Radio.Group
            onChange={(e) => setTypeReportExport(e.target.value)}
            value={typeReportExport}
          >
            <Radio value={0}>EXCEL</Radio>
            {data?.enablePdf && <Radio value={1}>PDF</Radio>}
          </Radio.Group>
        </div>
      </Modal>
    </>
  );
};

export default CreateReportModal;
